# Compatibility shims for running the GitHub Pages Jekyll stack on Ruby 4.
class Object
  unless method_defined?(:tainted?)
    def tainted?
      false
    end
  end

  unless method_defined?(:untaint)
    def untaint
      self
    end
  end

  unless method_defined?(:taint)
    def taint
      self
    end
  end

  unless method_defined?(:untrusted?)
    def untrusted?
      false
    end
  end

  unless method_defined?(:untrust)
    def untrust
      self
    end
  end

  unless method_defined?(:trust)
    def trust
      self
    end
  end
end
