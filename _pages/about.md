---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

Jialun CAO received her PhD degree from the Department of Computer Science and Engineering at The Hong Kong University of Science and Technology <a href='https://hkust.edu.hk/'>(HKUST)</a>, under the supervision of <a href="https://www.cse.ust.hk/faculty/scc/">Prof. Shing-Chi Cheung</a> in the [CASTLE](https://aka.henryhc.net/castle) lab. She is now a [**Research Assistant Professor**](https://cse.hkust.edu.hk/admin/people/faculty/profile/jialuncao) in HKUST.

Her research interests lie in the intersection of <strong>Software Engineering (SE) and Large Language Models (LLMs)</strong>, with an emphasis on LLM4SE, and LLM Evaluation. She has published more than 20 papers at the top conferences and journals, including ICSE, FSE, ASE, TOSEM, CAV, Usenix Security, AAAI, etc. She serves as a program committee member in top conferences such as ICSE, FSE, and ASE, SANER, Internetware, APSEC, etc; and is a reviewer for top journals including TOSEM, TSE, EmSE, etc. 

# 🔥 News
- *2025.05.15*: &nbsp;🎉🎉 Two papers 📑 "[From Informal to Formal](https://arxiv.org/abs/2501.16207)" and 📑 "[CruxEval-X](https://arxiv.org/pdf/2408.13001)" have been accepted by **ACL 2025 to the main** conference! Congrats!
- *2025.05.01*: &nbsp;🎉🎉 Our paper 📑 "[Enhancing Differential Testing With LLMs For Testing Deep Learning Libraries](https://arxiv.org/abs/2406.07944)" has been accepted by **TOSEM**. Congrats to Ziniu!
- *2025.03.31*: &nbsp;🎉🎉 Our paper 📑 "[CodeCleaner: Elevating Standards with A Robust Data Contamination Mitigation Toolkit](https://arxiv.org/abs/2411.10842)" has been accepted by **Internetware** 2025. Congrats!
- *2025.03.08*: Our 🤗<a href='https://huggingface.co/fm-universe'>Huggingface repo</a> reached 1.6k+ downloads. Contributions are welcomed 👉 <a href='https://huggingface.co/fm-universe'>[Link]</a> The Chinese <a href='https://mp.weixin.qq.com/s/oyhICTRo2fJL5MZkDrutXg'>article</a> has reached 37k+ reads👀 and 2k+ forwards↗️. Full paper 👉 <a href='https://arxiv.org/abs/2501.16207'>[Paper]</a>
- *2025.02.12*: &nbsp;🎉🎉 Our paper 📑 "SemBIC: Semantic-aware Identification of Bug-inducing Commits" has been accepted to **FSE 2025**. Congrats to Xiao!
- *2025.02.02*: &nbsp;🎉🎉 Our paper 📑 "A study on Prompt Design, Advantages and Limitations of ChatGPT for Deep Learning Program Repair" has been accepted to **JASE 2025**. Finally!
- *2025.01.23*: &nbsp;🎉🎉 I am honored to receive the prestigious 🏆<a href='https://www2.sigsoft.org/awards/dissertation/'><strong style="color:#D20F39">ACM SIGSOFT 2025 Outstanding Dissertation Award</strong></a>! Only 1 or 2 award receivers worldwide per year 🎉 🔗[[News]](https://cse.hkust.edu.hk/News/SIGSOFT2025/)
- *2024.12.10*: &nbsp;🎉🎉 Our paper 📑 "<a href='https://arxiv.org/pdf/2408.13204'>DomainEval: An Auto-Constructed Benchmark for Multi-Domain Code Generation</a>" has been accepted to **AAAI 2025**. Congrats to Qiming!


# 🌍 Visiting & Program Experience 

- *2024.12*. I am honored to be mentored by [**Prof. Paola Ricaurte Quijano**](https://cyber.harvard.edu/people/paola-ricaurte-quijano) at **Harvard University** in the 5th cohort of the [Asia Pacific Women in Leadership (APWiL) Mentoring Program](https://www.apru.org/our-work/pacific-rim-challenges/asia-pacific-women-in-leadership/).

- *2024.10*. I am honored to visit [**Prof. Michael Pradel**](https://software-lab.org/people/Michael_Pradel.html) at the **University of Stuttgart**.
- *2024.03*. I am honored to visit [**Prof. Pinjia He**](https://pinjiahe.github.io/) at the **Chinese University of Hong Kong, Shenzhen**.


# 📝 Publications 

### 2025

- [C19] 📄 <strong style="color:#DE3163">Jialun Cao</strong>, Songqiang Chen, Wuqi Zhang, Hau Ching Lo, Yeting Li, Shing-Chi Cheung. _CodeCleaner: Elevating Standards with A Robust Data Contamination Mitigation Toolkit._ In Internetware 2025. 🔗[[Paper]](https://arxiv.org/abs/2411.10842) 💻 [[Github]](https://github.com/ArabelaTso/CodeCleaner-v1)

- [J3] 📚 <strong style="color:#DE3163">Jialun Cao</strong>, Meiziniu Li, Ming Wen, Shing-chi Cheung. *A study on prompt design, advantages and limitations of chatgpt for deep learning program repair*. In Journal of Automated Software Engineering (**ASEJ**). 🔗[[arxiv]](https://arxiv.org/abs/2304.08191) 🔗[[Official]](https://link.springer.com/article/10.1007/s10515-025-00492-x)

- [C20] 📝 <strong style="color:#DE3163">**Jialun Cao**</strong>, Yaojie Lu, Meiziniu Li, Haoyang Ma, Haokun Li, Mengda He, Cheng Wen, Le Sun, Hongyu Zhang, Shengchao Qin, Shing-Chi Cheung, Cong Tian. _From Informal to Formal -- Incorporating and Evaluating LLMs on Natural Language Requirements to Verifiable Formal Proofs_. In **ACL Main 2025**. 🔗[[Paper]](https://arxiv.org/abs/2501.16207) 🤗 [[Huggingface]](https://huggingface.co/fm-universe) 🇨🇳[[Chinese article]](https://mp.weixin.qq.com/s/oyhICTRo2fJL5MZkDrutXg)

- [C21] 📄 Xiao Chen, Hengcheng Zhu, <strong style="color:#DE3163">**Jialun Cao (Corresponding)**</strong>, Ming Wen, Shing-Chi Cheung (Corresponding). *SemBIC: Semantic-aware Identification of Bug-inducing Commits*. In the ACM International Conference on the Foundations of Software Engineering (**FSE 2025**). 🔗[[paper]](https://scholar.henryhc.net/files/publications/2025/FSE2025-SemBIC.pdf)

- [C22] 📄 Qiming Zhu, <strong style="color:#DE3163">**Jialun Cao (Co-1st)**</strong>, Yaojie Lu, Hongyu Lin, Xianpei Han, Ben He, Le Sun, Shing-Chi Cheung. _DomainEval: An Auto-Constructed Benchmark for Multi-Domain Code Generation._ In 39th Annual AAAI Conference on Artificial Intelligence (**AAAI 2025**). 🔗[[Paper]](https://arxiv.org/pdf/2408.13204) 🎯[[Leaderboard]](https://domaineval.github.io/leaderboard.html) 💻 [[Github]](https://github.com/domaineval/DomainEval) 

- [C23] 📝 Ruiyang Xu, <strong style="color:#DE3163">Jialun Cao (Co-1st)</strong>, Yaojie Lu, Ming Wen, Hongyu Lin, Xianpei Han, Ben He, Shing-Chi Cheung, Le Sun. _CruxEval-X: A Benchmark for Multilingual Code Reasoning, Understanding and Execution_. In **ACL Main 2025**. 🔗[[Paper]](https://arxiv.org/pdf/2408.13001) 🎯[[Leaderboard]](https://cruxeval-x.github.io/leaderboard.html) 💻 [[Github]](https://github.com/CRUXEVAL-X/cruxeval-x) 

- [C24] 📄 Mengyang Wu, Yuzhi Zhao, <strong style="color:#DE3163">Jialun Cao</strong>, Mingjie Xu, zhongming Jiang, Xuehui Wang, Qinbin Li, Guangneng Hu, Shengchao Qin, Chi-Wing Fu. _ICM-Assistant: Instruction-tuning Multimodal Large Language Models for Rule-based Explainable Image Content Moderation._ In 39th Annual AAAI Conference on Artificial Intelligence (**AAAI 2025**). 🔗[[Paper]](https://arxiv.org/abs/2412.18216)

- [J4] 📝 Meiziniu Li, Dongze Li, Jianmeng Liu, <strong style="color:#DE3163">**Jialun Cao**</strong>, Yongqiang Tian, Shing-Chi Cheung. Enhancing Differential Testing With LLMs For Testing Deep Learning Libraries. In TOSEM 2025. 🔗[[Paper]](https://arxiv.org/abs/2406.07944)

- [Pre1] 📝 <strong style="color:#DE3163">Jialun Cao</strong>, Yuk-Kit Chan*, Zixuan Ling*, Wenxuan Wang†, Shuqing Li, Mingwei Liu, Ruixi Qiao, Yuting Han, Chaozheng Wang, Boxi Yu, Pinjia He, Shuai Wang, Zibin Zheng, Michael R. Lyu, Shing-Chi Cheung. _How Should We Build A Benchmark? Revisiting 274 Code-Related Benchmarks For LLMs_. In arXiv 2025. 🔗[[Paper]](https://arxiv.org/pdf/2501.10711) 🇨🇳[[Chinese article]](https://mp.weixin.qq.com/s/noYYnJW3PHggxt0Wex-t-Q)

- [Pre2] 📝 <strong style="color:#DE3163">**Jialun Cao**</strong>, Wuqi Zhang, Shing-Chi Cheung. _Concerned with Data Contamination? Assessing Countermeasures in Code Language Model_. In arXiv. 🔗[[Paper]](https://arxiv.org/abs/2403.16898)

- [Pre3] 📝 Jiarong Wu, Songqiang Chen, <strong style="color:#DE3163">Jialun Cao (Corresponding)</strong>, Hau Ching Lo, Shing-Chi Cheung (Corresponding). _Isolating Language-Coding from Problem-Solving: Benchmarking LLMs with PseudoEval._ In arXiv. 🔗[[Paper]](https://arxiv.org/abs/2502.19149)

- [Pre4] 📝 Jingyi Chen, Songqiang Chen, <strong style="color:#DE3163">Jialun Cao (Corresponding)</strong>, Jiasi Shen (Corresponding), Shing-Chi Cheung. _When LLMs Meet API Documentation: Can Retrieval Augmentation Aid Code Generation Just as It Helps Developers?_ In arXiv. 🔗[[Paper]](https://arxiv.org/abs/2503.15231)

- [Pre5] 📝 Dekun Dai, MingWei Liu, Anji Li, <strong style="color:#DE3163">**Jialun Cao**</strong>, Yanlin Wang, Chong Wang, Xin Peng, Zibin Zheng. _FeedbackEval: A Benchmark for Evaluating Large Language Models in Feedback-Driven Code Repair Tasks._ In arXiv. 🔗[[Paper]](https://arxiv.org/abs/2504.06939)

- [Pre6] 📝 Xiaolei Li, <strong style="color:#DE3163">**Jialun Cao**</strong>, Yepang Liu, Shing-Chi Cheung, Hailong Wang. _ReuseDroid: A VLM-empowered Android UI Test Migrator Boosted by Active Feedback._ In arXiv. 🔗[[Paper]](https://arxiv.org/abs/2504.02357)

- [Pre7] 📝 Ruiyang Xu*, <strong style="color:#DE3163">**Jialun Cao (Co-1st)**</strong>, Mingyuan Wu, Wenliang Zhong, Yaojie Lu, Ben He, Xianpei Han, Shing-Chi Cheung, Le. _EmbedAgent: Benchmarking Large Language Models in Embedded System Development._ In arXiv. 🔗[[Paper]](https://www.researchgate.net/publication/392093991_EmbedAgent_Benchmarking_Large_Language_Models_in_Embedded_System_Development)

### 2024

- [C13] 📄 <strong style="color:#DE3163">Jialun Cao</strong>, Zhiyong Chen*, Jiarong Wu, Shing-chi Cheung, Chang Xu. _JavaBench: A Benchmark of Object-Oriented Code Generation for Evaluating Large Language Models_. In the 39th IEEE/ACM International Conference on Automated Software Engineering (**ASE 2024**). 🔗[[Paper]](https://arxiv.org/abs/2406.12902) 🎯[[Leaderboard]](https://java-bench.github.io/leaderboard.html) 💻 [[Github]](https://github.com/java-bench/JavaBench) 

- 🏆 [C14] 📄 <strong style="color:#D20F39">Distinguished paper award</strong>. Zongze Jiang, Ming Wen, <strong style="color:#DE3163">Jialun Cao</strong>, Xuanhua Shi and Hai Jin. _Towards Understanding the Effectiveness of Large Language Models on Directed Test Input Generation_. In the 39th IEEE/ACM International Conference on Automated Software Engineering (**ASE 2024**). 🔗[[Paper]](https://github.com/CGCL-codes/PathEval/blob/main/PathEval_Preprint.pdf) 💻 [[Github]](https://github.com/CGCL-codes/PathEval) 

- [C15] 📄 Congying Xu, Songqiang Chen, Jiarong Wu, Valerio Terragni, Shing-chi Cheung (Corresponding), Hengcheng Zhu, <strong style="color:#DE3163">Jialun Cao (Corresponding)</strong>. _MR-Adopt: Automatic Deduction of Input Transformation Function for Metamorphic Testing._ In the 39th IEEE/ACM International Conference on Automated Software Engineering (**ASE 2024**). 🔗[[Paper]](https://arxiv.org/pdf/2408.15815) 

- [C16] 📄 Cheng Wen, <strong style="color:#DE3163">Jialun Cao (Corresponding)</strong>, Jie Su, Zhiwu Xu, Shengchao Qin (Corresponding), Mengda He, Haokun Li, Shing-Chi Cheung, Cong Tian. _Enchanting Program Specification Synthesis by Large Language Models using Static Analysis and Program Verification_. In 37th International Conference on Computer Aided Verification (**CAV 2024**) 🔗[[Paper]](https://arxiv.org/pdf/2404.00762) 💻 [[Homepage]](https://sites.google.com/view/autospecification)

- [C17] 📄 Bo Yang, Jiawei Hu, <strong style="color:#DE3163">Jialun Cao (Corresponding)</strong> _SDEFL: A Lightweight Fault Detection and Localization Method for Deep Neural Networks._ In 31st Asia-Pacific Software Engineering Conference (**APSEC 2024**)

- [C18] 📄 Kunpeng Jian, Yanyan Zou, Yeting Li, <strong style="color:#DE3163">Jialun Cao</strong>, Menghao Li, Jian Sun, Jingyi Shi and Wei Huo. _Fuzzing for Stateful Protocol Implementations: Are We There Yet?_ In The 18th Theoretical Aspects of Software Engineering Conference (**TASE 2024**)


### 2023

- [C11] 📄 <strong style="color:#DE3163">Jialun Cao</strong>, Yaojie Lu, Ming Wen, Shing-Chi Cheung. _Testing Coreference Resolution Systems without Labeled Test Sets._ In The ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering (**ESEC/FSE 2023**). 🔗[[Paper]](https://dl.acm.org/doi/pdf/10.1145/3611643.3616258) 💻 [[Github]](https://github.com/ArabelaTso/Crest-artifacts)

- [C12] 📄 Xiaohu Du, Xiao Chen, <strong style="color:#DE3163">Jialun Cao</strong>, Ming Wen, Shing-Chi Cheung, Hai Jin. _Understanding the Bug Characteristics and Fix Strategies of Federated Learning Systems_. In The ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering (**ESEC/FSE 2023**). 🔗[[Paper]](https://dl.acm.org/doi/pdf/10.1145/3611643.3616347)

- [J2] 📚 Meiziniu Li, <strong style="color:#DE3163">Jialun Cao</strong>, Yongqiang Tian, Tsz On Li, Ming Wen, Shing-Chi Cheung. _COMET: Coverage-guided Model Generation For Deep Learning Library Testing._  In ACM Transactions on Software Engineering and Methodology (**TOSEM**) 🔗[[Paper]](https://dl.acm.org/doi/10.1145/3583566)  💻 [[Github]](https://github.com/maybeLee/COMET)

### 2022

- [J1] 📚 <strong style="color:#DE3163">Jialun Cao</strong>, Meiziniu Li, Yeting Li, Ming Wen, Shing-chi Cheung. _SemMT: A Semantic-Based Testing Approach for Machine Translation Systems._ In ACM Transactions on Software Engineering and Methodology (**TOSEM**). 🔗[[Paper]](https://dl.acm.org/doi/10.1145/3490488) 💻 [[Github]](https://github.com/ArabelaTso/SemMT)

- [C9] 📄 <strong style="color:#DE3163">Jialun Cao</strong>, Meiziniu Li, Xiao Chen, Ming Wen, Yongqiang Tian, Bo Wu, Shing-chi Cheung. _DeepFD: Automated Fault Diagnosis and Localization for Deep Learning Programs._ In Proceedings of the 44th International Conference on Software Engineering (**ICSE 2022**). 🔗[[Paper]](https://dl.acm.org/doi/10.1145/3510003.3510099) 💻 [[Github]](https://github.com/ArabelaTso/DeepFD)

- [C10] 📄 Yeting Li, Yecheng Sun, Zhiwu Xu, <strong style="color:#DE3163">Jialun Cao</strong>, Yuekang Li, Rongchen Li, Haiming Chen, Shing-Chi Cheung, Yang Liu, Yang Xiao. _RegexScalpel: Regular Expression Denial of Service (ReDoS) Defense by Localize-and-Fix_. In the 31st **USENIX Security** Symposium. 🔗[[Paper]](https://www.usenix.org/conference/usenixsecurity22/presentation/li-yeting)

### 2021

- [C7] 📄 Yeting Li, Zixuan Chen, <strong style="color:#DE3163">Jialun Cao</strong>, Zhiwu Xu, Qiancheng Peng, Haiming Chen, Liyuan Chen, Shing-Chi Cheung. _ReDoSHunter: A Combined Static and Dynamic Approach for Regular Expression DoS Detection._ In the 30th **USENIX Security** Symposium. 🔗[[Paper]](https://www.usenix.org/conference/usenixsecurity21/presentation/li-yeting)

- [C8] 📄 Yeting Li, Shuaimin Li, Zhiwu Xu, <strong style="color:#DE3163">Jialun Cao</strong>, Zixuan Chen, Yun Hu, Haiming Chen, Shing-Chi Cheung. _TransRegex: Multi-modal Regular Expression Synthesis by Generate-and-Repair._ In the 2021 IEEE/ACM 43rd International Conference on Software Engineering (**ICSE 2021**). 🔗[[Paper]](https://ieeexplore.ieee.org/document/9401951)

### 2020

- [C5] 📄 Yeting Li, <strong style="color:#DE3163">Jialun Cao</strong>, Haiming Chen, Tingjian Ge, Zhiwu Xu, Qiancheng Peng. _FlashSchema: Achieving High Quality XML Schemas with Powerful Inference Algorithms and Large-scale Schema Data_. In the IEEE 36th International Conference on Data Engineering (**ICDE 2020**). 🔗[[Paper]](https://ieeexplore.ieee.org/document/9101818)

- [C6] 📄 Yeting Li, Zhiwu Xu, <strong style="color:#DE3163">Jialun Cao</strong>, Haiming Chen, Tingjian Ge, Shing-Chi Cheung. _FlashRegex: Deducing Anti-ReDoS Regexes from Examples_. In the Proceedings of the 35th IEEE/ACM International Conference on Automated Software Engineering (**ASE 2020**). 🔗[[Paper]](https://dl.acm.org/doi/10.1145/3324884.3416556)

### 2019

- [C3] 📄 Yongjian Li, <strong style="color:#DE3163">Jialun Cao (1st student author)</strong>, Jun Pang. _A Learning-Based Framework for Automatic Parameterized Verification_. In 2019 IEEE 37th International Conference on Computer Design (**ICCD 2019**). 🔗[[Paper]](https://ieeexplore.ieee.org/document/8988606)

- [C4] 📄 Yeting Li, Xiaolan Zhang, <strong style="color:#DE3163">Jialun Cao</strong>, Haiming Chen, Chong Gao. Learning k-Occurrence Regular Expressions with Interleaving. In the International Conference on Database Systems for Advanced Applications (**DASFAA 2019**) 🔗[[Paper]](https://link.springer.com/chapter/10.1007/978-3-030-18579-4_5)

### 2018

- [C1] 📄 <strong style="color:#DE3163">Jialun Cao</strong>, Yongjian Li, Jun Pang. _L-CMP: an automatic learning-based parameterized verification tool_. In Proceedings of the 33rd ACM/IEEE International Conference on Automated Software Engineering (**ASE 2018 Demo**). 🔗[[Paper]](https://dl.acm.org/doi/10.1145/3238147.3240487) 💻 [[Github]](https://github.com/ArabelaTso/Learning-Based-ParaVerifer)  🎬 [[Video]](https://www.youtube.com/watch?v=6Dl2HiiiS4E&list=LL&index=8&t=1s&ab_channel=BellaTSO)

- [C2] 📄 Yongjian Li, <strong style="color:#DE3163">Jialun Cao (1st student author)</strong>, Kaiqiang Duan. _An automatic parameterized verification of FLASH cache coherence protocol_. In 2018 IEEE International Conference on Software Quality, Reliability and Security (QRS 2018) 🔗[[Paper]](https://ieeexplore.ieee.org/abstract/document/8424956)


# 💯 Teaching

- _2025 Spring_, **Instructor** in [COMP 1021](https://course.cse.ust.hk/comp1021/) - Introduction to Computer Science. _Course materials_ ↗️ [[Link]](https://github.com/ArabelaTso/COMP1021-2025S)
- _2023 Fall_, **Teaching Assistant** in [COMP 1021](https://course.cse.ust.hk/comp1021/) - Introduction to Computer Science.
- _2020 Fall_, **Teaching Assistant** in [COMP 3021](https://course.cse.ust.hk/comp3021/) - Java Programming.
- _2020 Spring_, **Teaching Assistant** in [COMP 3021](https://course.cse.ust.hk/comp3021/) - Java Programming.

# 🎖 Honors and Awards
- *2025* [ACM SIGSOFT Outstanding Doctoral Dissertation Award](https://www2.sigsoft.org/awards/dissertation/) (Only 1~2 award receivers worldwide per year)
- *2024* Shortlisted Participant for the [Rising Stars Women in Engineering Workshop at Asian Deans' Forum](https://risingstarsasia.org/index.php)
- *2024* [Hong Kong Postgraduate Studentship](https://fytgs.hkust.edu.hk/admissions/Admission-to-Hong-Kong-Campus/submitting-an-application/scholarships-and-fees)
- *2024* [ACM SIGSOFT CAPS Travel Grant](https://www2.sigsoft.org/caps/capsmain/) (ASE 2024)
- *2023* [ACM SIGSOFT CAPS Travel Grant](https://www2.sigsoft.org/caps/capsmain/) (ESEC/FSE 2023)
- *2019 - 2023*: [Huawei Fellowship Scholarship](https://seng.hkust.edu.hk/academics/research-postgraduate/scholarships-studentships-awards)
- *2017*: China National Scholarship (Postgraduate, Rank 1/106, Top 1%)
- *2014*: China National Scholarship (Undergraduate, Rank 1/52, Top 2%)


# 🎓 Educations
- *2019.09 - 2024.03*, **Ph.D**, The Hong Kong University of Science and Technology.
- *2016.09 - 2019.06*, **M.S.**, State Key Laboratory of Computer Science, Institute of Software, Chinese Academy of Sciences.
- *2012.09 - 2016.06*, **B.S.**, Shandong University.


# 👩🏻‍💻 Working Experience
- *2024.08 - now*, **Research Assistant Professor** at the Department of Computer Science and Engineering at The Hong Kong University of Science and Technology
- *2024.04 - 2024.07*, **Postdoctoral Fellow** at HKUST, working with <a href="https://www.cse.ust.hk/faculty/scc/">Prof. Shing-Chi Cheung</a>
- *2023.07 - 2023.09*, **Intern** at huawei (Hong Kong) - Fermat Lab.
- *2022.09 - 2023.01*, **Intern** at Huawei - Trusted Software Engineering and Open Source Laboratory.
- *2021.09 - 2022.08*, **Intern** at Huawei - Theory Lab.

# 🪴 Service
**Award committee member**:
- ACM SIGSOFT [Outstanding Research Award 2025](https://www2.sigsoft.org/awards/outstandingresearch/)
- ACM SIGSOFT [Distinguished Service Award 2025](https://www2.sigsoft.org/awards/distinguishedservice/)
- ACM SIGSOFT [Influential Educator Award 2025](https://www2.sigsoft.org/awards/influentialeducator/)

**Program committee member** 
- **ICSE 2026** [research track](https://conf.researchr.org/committee/icse-2026/icse-2026-research-track-research-track)
- **ICSE 2025** [research track](https://conf.researchr.org/committee/icse-2025/icse-2025-research-track-research-track)
- **ASE 2025** [research track](https://conf.researchr.org/committee/ase-2025/ase-2025-papers-program-committee)
- **FSE 2025** [research track](https://conf.researchr.org/committee/fse-2025/fse-2025-papers-program-committee)
- **ISSRE 2024** [research track](https://issre.github.io/2024/committee_research-PC.html)
- Workshop on Responsible AI Engineering 2025 ([RAIE](https://conf.researchr.org/committee/icse-2025/raie-2025-papers-program-committee))
- APSEC 2025 [Technical Track](https://conf.researchr.org/committee/apsec-2025/apsec-2025-papers-program-committee)
- Internetware 2025 [Research Track](https://conf.researchr.org/committee/internetware-2025/internetware-2025-research-track-cuiyun-gao)
- CAIN 2025 [Research and Experience Papers-track](https://conf.researchr.org/committee/cain-2025/cain-2025-call-for-papers-program-committee)
- Forge 2025 [Research track](https://conf.researchr.org/committee/forge-2025/forge-2025-papers-program-committee) and [Data and Benchmarking-track](https://conf.researchr.org/committee/forge-2025/forge-2025-benchmarking-organization-committee)
- SANER 2024 [Short Papers and Posters Track track](https://conf.researchr.org/committee/saner-2025/saner-2025-short-papers-and-posters-track-program-commitee)
- APSEC 2024 [Technical Track](https://conf.researchr.org/committee/apsec-2024/apsec-2024-technical-track-program-committee)
- Internetware 2024 [Research track](https://conf.researchr.org/committee/internetware-2024/internetware-2024-papers-program-committee)
- AIware 2024 [Main track](https://2024.aiwareconf.org/committee/aiware-2024-papers-program-committee)
- Forge 2024 [Research track](https://conf.researchr.org/committee/forge-2024/forge-2024-papers-program-committee)


**Session chair**
- ASE 2024 - Session Chair of [Code generation 3](https://conf.researchr.org/track/ase-2024/ase-2024-research)
- ASE 2024 - Session Chair of [Testing 1](https://conf.researchr.org/track/ase-2024/ase-2024-research)
- Internetware 2024 - Session Chair of Session 6: [Code Generation and Transformation](https://conf.researchr.org/track/internetware-2024/internetware-2024-research) 

**Reviewer**
- ACM Transactions on Software Engineering and Methodology (TOSEM)
- IEEE Transactions on Software Engineering (TSE)
- Empirical Software Engineering (EMSE)
- Journal of Automated Software Engineering (JASE)
- Journal of Software: Evolution and Process (JSME)
- ACM Transactions on Knowledge Discovery from Data (TKDD)
- IEEE Transactions on Mobile Computing (TMC)	

# 💬 Invited Talks
- *2025.04*, **Exploring Code Generation and Reasoning Capabilities of LLMs.** In the Applied Mathematics Seminar at Peking University. 🔗 [[Link]](https://www.math.pku.edu.cn/kxyj/xsbg/tlb/informationsciences/167435.htm).
- *2025.01*, **From Benchmarks to Practice: A Preliminary Study on the Code Capabilities of Large Language Models.** In the Next Era of AI-assisted R&D Seminar (2025华为AI辅助研发Next研讨会) by Huawei, Hong Kong. 📽️[[Recording]](https://www.chaspark.com/#/live/1095803543143456768?videoId=1100606948265017344)
- *2025.01*, **From Requirement to Formal Specification andModel Generation via Large Language Models**. In Zhejiang University (Online).
- *2024.11*, **Is Large Language Model a Rescue for Code Generation & Code Reasoning?** In Trusted Large Language Model Evaluation and Open-Source Technology Forum by CCF China Open Source Conference. 
- *2024.10*, **Exploring Automatic Testing and Verification for Software Programs using Large Language Models.** In High Trust Software Engineering Technology Laboratory, Guangzhou Research Institute, Xidian University.
- *2024.08*, **Trusted Architecture of Intelligent CPS Systems**. Micro-Forum of Intelligent Software Development hosted by Fudan University. 🔗 [[Link]](https://mp.weixin.qq.com/s/03JZNjTbinRYmDirEapBoA)
- *2024.08*, **Can AI be a Panacea for Software Reliability? Exploring Automatic Testing and Verification for Software Programs.** In the Software Systems Engineering Group at University College London.
- *2024.07*, **Concerned with Data Contamination? Assessing Countermeasures in Code Language Model**. In the IEEE World Congress on Service - Cloud & AI Symposium
- *2024.05*, **From Requirement to Formal Specification and Model Generation via Large Language Models** In the Formal Methods Committee Strategic Seminar (2024 CCF形式化方法专委会战略研讨会——形式化方法与人工智能的交叉融合：机遇与挑战) hosted in China Computer Federation (CCF). 📽️[[Recording]](https://www.chaspark.com/#/live/994058991643467776?videoId=1006392740579553280) 🪧[[News]](https://www.ccf.org.cn/Chapters/TC/News_/2024-05-12/821601.shtml)
- *2023.12*, **Crafting Future: A Dancer's Leap into Computer Science.** The 1st Forum for Women Scholars in Software Engineering hosted by ChinaSoft.
- *2023.12*, **A Study on the Problem of Data Contamination in the Era of Large Language Models.** In the Forum on the new paradigm of software engineering under AIGC hosted by Chinasoft.

