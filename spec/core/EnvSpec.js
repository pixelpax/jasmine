// TODO: Fix these unit tests!
describe("Env", function() {
  var env;
  beforeEach(function() {
    env = new jasmineUnderTest.Env();
  });

  describe("#pending", function() {
    it("throws the Pending Spec exception", function() {
      expect(function() {
        env.pending();
      }).toThrow(jasmineUnderTest.Spec.pendingSpecExceptionMessage);
    });

    it("throws the Pending Spec exception with a custom message", function() {
      expect(function() {
        env.pending('custom message');
      }).toThrow(jasmineUnderTest.Spec.pendingSpecExceptionMessage + 'custom message');
    });
  });

  describe("#topSuite", function() {
    it("returns the Jasmine top suite for users to traverse the spec tree", function() {
      var suite = env.topSuite();
      expect(suite.description).toEqual('Jasmine__TopLevel__Suite');
    });
  });

  it('can configure specs to throw errors on expectation failures', function() {
    env.configure({oneFailurePerSpec: true});

    spyOn(jasmineUnderTest, 'Spec');
    env.it('foo', function() {});
    expect(jasmineUnderTest.Spec).toHaveBeenCalledWith(jasmine.objectContaining({
      throwOnExpectationFailure: true
    }));
  });

  it('can configure suites to throw errors on expectation failures', function() {
    env.configure({oneFailurePerSpec: true});

    spyOn(jasmineUnderTest, 'Suite');
    env.describe('foo', function() {});
    expect(jasmineUnderTest.Suite).toHaveBeenCalledWith(jasmine.objectContaining({
      throwOnExpectationFailure: true
    }));
  });

  describe('promise library', function() {
    it('can be configured with a custom library', function() {
      var myLibrary = { resolve: jasmine.createSpy(), reject: jasmine.createSpy() };
      env.configure({ Promise: myLibrary });
    });

    it('cannot be configured with an invalid promise library', function() {
      var myLibrary = {};

      expect(function() {
        env.configure({ Promise: myLibrary });
      }).toThrowError('Custom promise library missing `resolve`/`reject` functions');
    });
  });

  it('defaults to multiple failures for specs', function() {
    spyOn(jasmineUnderTest, 'Spec');
      env.it('bar', function() {});
    expect(jasmineUnderTest.Spec).toHaveBeenCalledWith(jasmine.objectContaining({
      throwOnExpectationFailure: false
    }));
  });

  it('defaults to multiple failures for suites', function() {
    spyOn(jasmineUnderTest, 'Suite');
    env.describe('foo', function() {});
    expect(jasmineUnderTest.Suite).toHaveBeenCalledWith(jasmine.objectContaining({
      throwOnExpectationFailure: false
    }));
  });

  describe('#describe', function () {
    it("throws an error when given arguments", function() {
      expect(function() {
        env.describe('done method', function(done) {});
      }).toThrowError('describe does not expect any arguments');
    });

    it('throws an error when it receives a non-fn argument', function() {
      // Some versions of PhantomJS return [object DOMWindow] when
      // Object.prototype.toString.apply is called with `undefined` or `null`.
      // In a similar fashion, IE8 gives [object Object] for both `undefined`
      // and `null`. We mostly just want these tests to check that using
      // anything other than a function throws an error.
      expect(function() {
        env.describe('undefined arg', undefined);
      }).toThrowError(/describe expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/);
      expect(function() {
        env.describe('null arg', null);
      }).toThrowError(/describe expects a function argument; received \[object (Null|DOMWindow|Object)\]/);

      expect(function() {
        env.describe('array arg', []);
      }).toThrowError('describe expects a function argument; received [object Array]');
      expect(function() {
        env.describe('object arg', {});
      }).toThrowError('describe expects a function argument; received [object Object]');

      expect(function() {
        env.describe('fn arg', function() {});
      }).not.toThrowError('describe expects a function argument; received [object Function]');
    });
  });

  describe('#it', function () {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.it('undefined arg', null);
      }).toThrowError(/it expects a function argument; received \[object (Null|DOMWindow|Object)\]/);
    });

    it('does not throw when it is not given a fn argument', function() {
      expect(function() {
        env.it('pending spec');
      }).not.toThrow();
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.it('async', jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#xit', function() {
    it('calls spec.pend with "Temporarily disabled with xit"', function() {
      var pendSpy = jasmine.createSpy();
      spyOn(env, 'it').and.returnValue({
        pend: pendSpy
      });
      env.xit('foo', function() {});
      expect(pendSpy).toHaveBeenCalledWith('Temporarily disabled with xit');
    });

    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.xit('undefined arg', null);
      }).toThrowError(/xit expects a function argument; received \[object (Null|DOMWindow|Object)\]/);
    });

    it('does not throw when it is not given a fn argument', function() {
      expect(function() {
        env.xit('pending spec');
      }).not.toThrow();
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.xit('async', jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#fit', function () {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.fit('undefined arg', undefined);
      }).toThrowError(/fit expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/);
    });
  });

  describe('#beforeEach', function () {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.beforeEach(undefined);
      }).toThrowError(/beforeEach expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/);
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.beforeEach(jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#beforeAll', function () {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.beforeAll(undefined);
      }).toThrowError(/beforeAll expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/);
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.beforeAll(jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#afterEach', function () {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.afterEach(undefined);
      }).toThrowError(/afterEach expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/);
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.afterEach(jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#afterAll', function () {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.afterAll(undefined);
      }).toThrowError(/afterAll expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/);
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.afterAll(jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('when not constructed with suppressLoadErrors: true', function() {
    it('installs a global error handler on construction', function() {
      var globalErrors = jasmine.createSpyObj('globalErrors', ['install', 'pushListener', 'popListener']);
      spyOn(jasmineUnderTest, 'GlobalErrors').and.returnValue(globalErrors);
      new jasmineUnderTest.Env();
      expect(globalErrors.install).toHaveBeenCalled();
    });
  });

  describe('when constructed with suppressLoadErrors: true', function() {
    it('does not install a global error handler until execute is called', function() {
      var globalErrors = jasmine.createSpyObj('globalErrors', ['install', 'pushListener', 'popListener']);
      spyOn(jasmineUnderTest, 'GlobalErrors').and.returnValue(globalErrors);
      env = new jasmineUnderTest.Env({suppressLoadErrors: true});
      expect(globalErrors.install).not.toHaveBeenCalled();
      env.execute();
      expect(globalErrors.install).toHaveBeenCalled();
    });
  });
});
