/* Meta-tests for the testing library. */


(() => {
	const increment = (value) => {
		/*
		This is a simple function that will be tested in order to test the testing library.
		*/
		if(value % 2 === 0) {
			throw new Error("Uh oh!");
		}
		return value + 1;
	};

	testing.addUnit("TestUnit constructor", {
		"can create a unit with auto-named tests from a list of functions": () => {
			const unit = new TestUnit("increment()", [
				() => {
					const result = increment(1);
					expect(result).toEqual(2);
				},
				() => {
					/* this test will fail - see the intentionally bad implementation of increment() above */
					const result = increment(2);
					expect(result).toEqual(3);
				}
			]);
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case 1").getResult()).toEqual(true);
			expect(unit.findTest("test case 2").getResult()).toEqual(false);
		},
		"can create a unit with custom-named tests from an object with functions as properties": () => {
			const unit = new TestUnit("increment()", {
				"test case foo": () => {
					const result = increment(1);
					expect(result).toEqual(2);
				},
				"test case bar": () => {
					/* this test will fail - see the intentionally bad implementation of increment() above */
					const result = increment(2);
					expect(result).toEqual(3);
				}
			});
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case foo").getResult()).toEqual(true);
			expect(unit.findTest("test case bar").getResult()).toEqual(false);
		},
		"can create a unit with auto-generated tests from an array of inputs and outputs - ordinary syntax": () => {
			const unit = new TestUnit("increment()", [
				increment,

				/* first test case: increment(1) === 2 */
				[1, 2],
				/* this 2nd test will fail - see the intentionally bad implementation of increment() above */
				[2, 3]
			]);
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case 1").getResult()).toEqual(true);
			expect(unit.findTest("test case 2").getResult()).toEqual(false);
		},
		"can create a unit with auto-generated tests from an array of inputs and outputs - alternative syntax": () => {
			const unit = new TestUnit("increment()", increment, [
				/* first test case: increment(1) === 2 */
				[1, 2],
				/* this 2nd test will fail - see the intentionally bad implementation of increment() above */
				[2, 3]
			]);
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case 1").getResult()).toEqual(true);
			expect(unit.findTest("test case 2").getResult()).toEqual(false);
		},
		"can create a unit with custom-named but auto-generated tests": () => {
			const unit = new TestUnit("increment()", increment, {
				/* first test case: increment(1) === 2 */
				"test case foo": [1, 2],
				/* this 2nd test will fail - see the intentionally bad implementation of increment() above */
				"test case bar": [2, 3]
			});
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case foo").getResult()).toEqual(true);
			expect(unit.findTest("test case bar").getResult()).toEqual(false);
		}
	});
}) ();
testing.addUnit("expect()", {
	"toEqual() works for primitives": () => {
		expect(123).toEqual(123);
		expect(123n).toEqual(123n);
		expect(123n).toEqual(123);
		expect(123).toEqual(123n);
		expect("abc").toEqual("abc");
		expect(true).toEqual(true);
		expect(false).toEqual(false);
		expect(null).toEqual(null);
		expect(undefined).toEqual(undefined);
		expect(NaN).toEqual(NaN);
		testing.assertThrows(() => {
			expect(1).toEqual(2);
		});
		testing.assertThrows(() => {
			expect(1).toEqual("abc");
		});
		testing.assertThrows(() => {
			expect(undefined).toEqual();
		});
	},
	"toEqual() works for objects": () => {
		expect({}).toEqual({});
		expect([]).toEqual([]);
		class Foo {
			constructor(prop) {
				this.prop = prop;
			}
		}
		expect(new Foo(123)).toEqual(new Foo(123));

		testing.assertThrows(() => {
			expect(new Foo(123).toEqual(new Foo(124)));
		});
		testing.assertThrows(() => {
			expect(new Foo(123).toEqual({ prop: 123 }));
		});
		testing.assertThrows(() => {
			expect([1]).toEqual([2]);
		});
		testing.assertThrows(() => {
			expect([1, 2, 3]).toEqual(4);
		});
		testing.assertThrows(() => {
			expect(4).toEqual([1, 2, 3]);
		});
	},
	"toStrictlyEqual() works for primitives": () => {
		expect(1).toStrictlyEqual(1);
		expect("abc").toStrictlyEqual("abc");
		expect(true).toStrictlyEqual(true);
		expect(false).toStrictlyEqual(false);
		expect(null).toStrictlyEqual(null);
		expect(undefined).toStrictlyEqual(undefined);
		expect(NaN).toStrictlyEqual(NaN);
		testing.assertThrows(() => {
			expect(1).toStrictlyEqual(2);
		});
		testing.assertThrows(() => {
			expect(1).toStrictlyEqual("abc");
		});
		testing.assertThrows(() => {
			expect(undefined).toStrictlyEqual();
		});
	},
	"toStrictlyEqual() works for objects": () => {
		const obj = {};
		expect(obj).toStrictlyEqual(obj);
		const arr = [];
		expect(arr).toStrictlyEqual(arr);
		class MyClass {
			constructor(prop) {
				this.prop = prop;
			}
		};
		const myInstance = new MyClass("foo");
		expect(myInstance).toStrictlyEqual(myInstance)


		testing.assertThrows(() => {
			expect({}).toStrictlyEqual({});
		});
		testing.assertThrows(() => {
			expect({ prop: 1 }).toStrictlyEqual({ prop: 1 });
		});
		testing.assertThrows(() => {
			expect([]).toStrictlyEqual([]);
		});
		testing.assertThrows(() => {
			expect([1, 2, 3]).toStrictlyEqual([1, 2, 3]);
		});
		testing.assertThrows(() => {
			expect(new MyClass("foo")).toStrictlyEqual(new MyClass("foo"));
		});
	},
	"toNotStrictlyEqual() works for primitives": () => {
		testing.assertThrows(() => {
			expect(1).toNotStrictlyEqual(1);
		});
		testing.assertThrows(() => {
			expect("abc").toNotStrictlyEqual("abc");
		});
		testing.assertThrows(() => {
			expect(true).toNotStrictlyEqual(true);
		});
		testing.assertThrows(() => {
			expect(false).toNotStrictlyEqual(false);
		});
		testing.assertThrows(() => {
			expect(null).toNotStrictlyEqual(null);
		});
		testing.assertThrows(() => {
			expect(undefined).toNotStrictlyEqual(undefined);
		});
		testing.assertThrows(() => {
			expect(NaN).toNotStrictlyEqual(NaN);
		});
		expect(1).toNotStrictlyEqual(2);
		expect(1).toNotStrictlyEqual("abc");
		testing.assertThrows(() => {
			expect(undefined).toNotStrictlyEqual();
		});
	},
	"toNotStrictlyEqual() works for objects": () => {
		const obj = {};
		testing.assertThrows(() => {
			expect(obj).toNotStrictlyEqual(obj);
		});
		const arr = [];
		testing.assertThrows(() => {
			expect(arr).toNotStrictlyEqual(arr);
		});
		class MyClass {
			constructor(prop) {
				this.prop = prop;
			}
		};
		const myInstance = new MyClass("foo");
		testing.assertThrows(() => {
			expect(myInstance).toNotStrictlyEqual(myInstance)
		});


		expect({}).toNotStrictlyEqual({});
		expect({ prop: 1 }).toNotStrictlyEqual({ prop: 1 });
		expect([]).toNotStrictlyEqual([]);
		expect([1, 2, 3]).toNotStrictlyEqual([1, 2, 3]);
		expect(new MyClass("foo")).toNotStrictlyEqual(new MyClass("foo"));
	},
	"toNotEqual() works for primitives": () => {
		testing.assertThrows(() => {
			expect(123).toNotEqual(123);
		});
		testing.assertThrows(() => {
			expect(123n).toNotEqual(123n);
		});
		testing.assertThrows(() => {
			expect(123n).toNotEqual(123);
		});
		testing.assertThrows(() => {
			expect(123).toNotEqual(123n);
		});
		testing.assertThrows(() => {
			expect("abc").toNotEqual("abc");
		});
		testing.assertThrows(() => {
			expect(true).toNotEqual(true);
		});
		testing.assertThrows(() => {
			expect(false).toNotEqual(false);
		});
		testing.assertThrows(() => {
			expect(null).toNotEqual(null);
		});
		testing.assertThrows(() => {
			expect(undefined).toNotEqual(undefined);
		});
		testing.assertThrows(() => {
			expect(NaN).toNotEqual(NaN);
		});
		expect(1).toNotEqual(2);
		expect(1).toNotEqual("abc");
		testing.assertThrows(() => {
			expect(undefined).toNotEqual();
		});
	},
	"toBeTrue() works": () => {
		expect(true).toBeTrue();


		testing.assertThrows(() => {
			expect(false).toBeTrue();
		});
		testing.assertThrows(() => {
			expect(123).toBeTrue();
		});
		testing.assertThrows(() => {
			expect({ prop: 123 }).toBeTrue();
		});
	},
	"toBeFalse() works": () => {
		expect(false).toBeFalse();


		testing.assertThrows(() => {
			expect(true).toBeFalse();
		});
		testing.assertThrows(() => {
			expect(0).toBeFalse();
		});
		testing.assertThrows(() => {
			expect({ prop: 123 }).toBeFalse();
		});
	},
	"toBeTruthy() works": () => {
		expect(true).toBeTruthy();
		expect(123).toBeTruthy();
		expect("abc").toBeTruthy();

		testing.assertThrows(() => {
			expect(false).toBeTruthy();
		});
		testing.assertThrows(() => {
			expect(0).toBeTruthy();
		});
		testing.assertThrows(() => {
			expect("").toBeTruthy();
		});
	},
	"toBeFalsy() works": () => {
		expect(false).toBeFalsy();
		expect(0).toBeFalsy();
		expect("").toBeFalsy();

		testing.assertThrows(() => {
			expect(true).toBeFalsy();
		});
		testing.assertThrows(() => {
			expect(123).toBeFalsy();
		});
		testing.assertThrows(() => {
			expect("abc").toBeFalsy();
		});
	},
	"toThrow() works": () => {
		const foo = (arg) => {
			if(arg !== 123) {
				throw new Error("Uh-oh, something went wrong!");
			}
		}

		// foo throws an error when the argument is not 123, as seen above
		expect(foo).toThrow();
		expect(foo, 456).toThrow();
		expect(foo.bind(null, 456)).toThrow();

		testing.assertThrows(() => {
			// here, foo should be called with 123 as a parameter, so no error should be thrown.
			expect(foo, 123).toThrow();
		});
		testing.assertThrows(() => {
			// here also, foo should be called with 123 as a parameter, so no error should be thrown.
			expect(foo.bind(null, 123)).toThrow();
		});
	},
	"toBeNumeric() works": () => {
		expect(1).toBeNumeric();
		expect(-1.23).toBeNumeric();
		expect(123n).toBeNumeric();

		testing.assertThrows(() => {
			expect("abc").toBeNumeric();
		});
		testing.assertThrows(() => {
			expect(NaN).toBeNumeric();
		});
	},
	"toBeAnObject() works": () => {
		expect({}).toBeAnObject();
		expect({ x: 1 }).toBeAnObject();
		expect([]).toBeAnObject();
		class Foo { constructor() {} }
		expect(new Foo()).toBeAnObject();


		testing.assertThrows(() => {
			expect(123).toBeAnObject();
		});
		testing.assertThrows(() => {
			expect("abc").toBeAnObject();
		});
		testing.assertThrows(() => {
			expect(null).toBeAnObject();
		});
	},
	"toBeAnArray() works": () => {
		expect([]).toBeAnArray();
		expect([1, 2, 3]).toBeAnArray();

		testing.assertThrows(() => {
			expect(123).toBeAnArray();
		});
		testing.assertThrows(() => {
			expect({}).toBeAnArray();
		});
	},
	"toBePositive() works": () => {
		expect(123).toBePositive();

		testing.assertThrows(() => {
			expect(-1).toBePositive();
		});
		testing.assertThrows(() => {
			expect(0).toBePositive();
		});
		testing.assertThrows(() => {
			expect("abc").toBePositive();
		});
	},
	"toBeNegative() works": () => {
		expect(-123).toBeNegative();

		testing.assertThrows(() => {
			expect(1).toBeNegative();
		});
		testing.assertThrows(() => {
			expect(0).toBeNegative();
		});
		testing.assertThrows(() => {
			expect("abc").toBeNegative();
		});
	},
	"toBeAnInteger() works": () => {
		expect(123).toBeAnInteger();
		expect(123n).toBeAnInteger();

		testing.assertThrows(() => {
			expect(1.23).toBeAnInteger();
		});
		testing.assertThrows(() => {
			expect("abc").toBeAnInteger();
		});
	},
	"toBeBetween() works": () => {
		expect(123).toBeBetween(100, 200);
		expect(123n).toBeBetween(100, 200);
		expect(123).toBeBetween(100n, 200n);
		expect(123n).toBeBetween(100n, 200n);

		expect(123).toBeBetween(123, 456);
		expect(123).toBeBetween(0, 123);

		testing.assertThrows(() => {
			expect(123).toBeBetween(50, 60);
		});
		testing.assertThrows(() => {
			expect(123n).toBeBetween(50, 60);
		});
	},
	"toBeStrictlyBetween() works": () => {
		expect(123).toBeStrictlyBetween(100, 200);
		expect(123n).toBeStrictlyBetween(100, 200);
		expect(123).toBeStrictlyBetween(100n, 200n);
		expect(123n).toBeStrictlyBetween(100n, 200n);

		testing.assertThrows(() => {
			expect(123).toBeStrictlyBetween(123, 456);
		});
		testing.assertThrows(() => {
			expect(123).toBeStrictlyBetween(0, 123);
		});

		testing.assertThrows(() => {
			expect(123).toBeStrictlyBetween(50, 60);
		});
		testing.assertThrows(() => {
			expect(123n).toBeStrictlyBetween(50, 60);
		});
	},
	"toBeGreaterThan() works": () => {
		expect(1).toBeGreaterThan(0);

		testing.assertThrows(() => {
			expect(1).toBeGreaterThan(2);
		});
		testing.assertThrows(() => {
			expect("abc").toBeGreaterThan(2);
		});
		testing.assertThrows(() => {
			expect(1).toBeGreaterThan("abc");
		});
	},
	"toApproximatelyEqual() works": () => {
		expect(0.1 + 0.2).toApproximatelyEqual(0.3);
		expect(0.3 - 0.1).toApproximatelyEqual(0.2);

		testing.assertThrows(() => {
			expect(2).toApproximatelyEqual(3);
		});
		testing.assertThrows(() => {
			expect(0.1 + 0.2 + 4e-14).toApproximatelyEqual(0.3);
		});
	},
	"toHaveProperties() works": () => {
		expect({ x: 1 }).toHaveProperties("x");
		expect({ x: 1, y: 1 }).toHaveProperties("x", "y");
		expect({ x: 1, y: 1, z: 1 }).toHaveProperties("x", "y");

		testing.assertThrows(() => {
			expect({ x: 1 }).toHaveProperties("y");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toHaveProperties("x", "y", "z");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toHaveProperties("x", "y", "z");
		});
	},
	"toOnlyHaveProperties() works": () => {
		expect({ x: 1 }).toOnlyHaveProperties("x");
		expect({ x: 1, y: 1 }).toOnlyHaveProperties("x", "y");

		testing.assertThrows(() => {
			expect({ x: 1, y: 1, z: 1 }).toOnlyHaveProperties("x", "y");
		});
		testing.assertThrows(() => {
			expect({ x: 1 }).toOnlyHaveProperties("y");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toOnlyHaveProperties("x", "y", "z");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toOnlyHaveProperties("x", "y", "z");
		});
	},
	"toInstantiate() works": () => {
		expect({}).toInstantiate(Object);
		expect([]).toInstantiate(Array);
		expect([]).toInstantiate(Object);
		class Foo { constructor() {} };
		expect(new Foo()).toInstantiate(Foo);
		expect(new Foo()).toInstantiate(Object);

		testing.assertThrows(() => {
			expect([]).toInstantiate(Foo);
		});
		testing.assertThrows(() => {
			expect({}).toInstantiate(Array);
		});
	},
	"toDirectlyInstantiate() works": () => {
		expect({}).toDirectlyInstantiate(Object);
		expect([]).toDirectlyInstantiate(Array);
		class Foo { constructor() {} };
		expect(new Foo()).toDirectlyInstantiate(Foo);

		testing.assertThrows(() => {
			expect(new Foo()).toDirectlyInstantiate(Object);
		});
		testing.assertThrows(() => {
			expect([]).toDirectlyInstantiate(Object);
		});

		testing.assertThrows(() => {
			expect([]).toDirectlyInstantiate(Foo);
		});
		testing.assertThrows(() => {
			expect({}).toDirectlyInstantiate(Array);
		});
	}
});
