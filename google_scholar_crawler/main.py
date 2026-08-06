import json
import os
import signal
import sys
import time
from datetime import datetime

from scholarly import scholarly

# Hard wall-clock budget for the whole crawl. Without this the job hangs:
# ProxyGenerator.FreeProxies() and scholarly's internal retry loop have no
# global time bound, so a blocked Scholar response burns the full 6h GitHub
# job limit before being cancelled.
DEADLINE_SECONDS = int(os.environ.get('SCHOLAR_DEADLINE_SECONDS', '420'))
# Free proxies are slow and mostly dead; only worth trying as a fallback.
USE_PROXY = os.environ.get('SCHOLAR_USE_PROXY', '1') != '0'
PROXY_WAIT_SECONDS = int(os.environ.get('SCHOLAR_PROXY_WAIT_SECONDS', '90'))


class Timeout(Exception):
    pass


def _deadline_handler(signum, frame):
    raise Timeout(f'crawl exceeded {DEADLINE_SECONDS}s budget')


def bound_scholarly():
    """Cap scholarly's per-request timeout and retry count where supported."""
    for setter, value in (('set_timeout', 30), ('set_retries', 2)):
        try:
            getattr(scholarly, setter)(value)
        except Exception:
            pass


def enable_free_proxies():
    from scholarly import ProxyGenerator

    pg = ProxyGenerator()
    if pg.FreeProxies(timeout=1, wait_time=PROXY_WAIT_SECONDS):
        scholarly.use_proxy(pg)
        return True
    return False


def fetch(scholar_id):
    author = scholarly.search_author_id(scholar_id)
    if not author:
        raise RuntimeError(f'no author returned for id {scholar_id}')
    scholarly.fill(author, sections=['basics', 'indices', 'counts', 'publications'])
    if not author.get('name'):
        raise RuntimeError('author profile came back empty (likely blocked by Scholar)')
    return author


def crawl(scholar_id):
    """Try direct first, then behind free proxies. Raises on total failure."""
    attempts = [('direct', None)]
    if USE_PROXY:
        attempts.append(('free-proxy', enable_free_proxies))

    last_error = None
    for label, setup in attempts:
        try:
            if setup is not None and not setup():
                print(f'[{label}] no usable proxy found, skipping', file=sys.stderr)
                continue
            print(f'[{label}] fetching profile...', file=sys.stderr)
            return fetch(scholar_id)
        except Timeout:
            raise
        except Exception as exc:
            last_error = exc
            print(f'[{label}] failed: {exc!r}', file=sys.stderr)
            time.sleep(2)

    raise RuntimeError(f'all strategies failed; last error: {last_error!r}')


def main():
    scholar_id = os.environ.get('GOOGLE_SCHOLAR_ID')
    if not scholar_id:
        print('GOOGLE_SCHOLAR_ID is not set', file=sys.stderr)
        return 1

    bound_scholarly()
    signal.signal(signal.SIGALRM, _deadline_handler)
    signal.alarm(DEADLINE_SECONDS)
    try:
        author = crawl(scholar_id)
    except (Timeout, RuntimeError) as exc:
        # Don't fail the workflow over a transient Scholar block — the previous
        # data on the google-scholar-stats branch stays valid.
        print(f'::warning::Google Scholar crawl skipped: {exc}', file=sys.stderr)
        return 0
    finally:
        signal.alarm(0)

    author['updated'] = str(datetime.now())
    author['publications'] = {v['author_pub_id']: v for v in author['publications']}
    print(json.dumps(author, indent=2))

    os.makedirs('results', exist_ok=True)
    with open('results/gs_data.json', 'w') as outfile:
        json.dump(author, outfile, ensure_ascii=False)

    shieldio_data = {
        "schemaVersion": 1,
        "label": "citations",
        "message": f"{author['citedby']}",
    }
    with open('results/gs_data_shieldsio.json', 'w') as outfile:
        json.dump(shieldio_data, outfile, ensure_ascii=False)
    return 0


if __name__ == '__main__':
    sys.exit(main())
