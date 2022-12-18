/* Meta-tests for the testing library. */

testing.addUnit("Test.getResult()", {
	"returns true for a test that passes": () => {
		const test = new Test(() => {}, "example-test");
		expect(test.getResult()).toEqual(true);
	},
	"returns false for a test that fails": () => {
		const test = new Test(
			() => { throw new Error("test failed"); },
			"example-test"
		);
		expect(test.getResult()).toEqual(false);
	},
	"sets the `error` property on the Test object when it fails": () => {
		const test = new Test(() => {
			throw new Error("test failed");
		}, "example-test");
		test.getResult();
		expect(test.error).toInstantiate(Error);
	},
	"sets the `error` property on the Test object to null when it passes": () => {
		const test = new Test(() => {}, "example-test");
		test.error = "foo";
		test.getResult();
		expect(test.error).toEqual(null);
	}
});
testing.addUnit("Test.autoGenerateName()", {
	"can generate a test name from the function name": () => {
		const increment = function increment(num) { return num + 1; };
		const result = Test.autoGenerateName([1], 2, increment, "unit-name");
		expect(result).toEqual("increment(1) should return 2");
	},
	"can generate a test name from the unit name": () => {
		const increment = (num) => num + 1;
		const result = Test.autoGenerateName([1], 2, increment, "increment()");
		expect(result).toEqual("increment(1) should return 2");
	},
	"can generate a test name when the function name cannot be identified": () => {
		const result = Test.autoGenerateName([1], 2, num => num + 1, "unit-name");
		expect(result).toEqual("it should return 2 when given an input of 1");
	}
});
testing.addUnit("TestUnit constructor", {
	"can create a unit with auto-named tests from a list of functions": () => {
		const unit = new TestUnit("unit-name", [
			() => { },
			() => { throw new Error("test failed"); }
		]);
		expect(unit.unitName).toEqual("unit-name");
		expect(unit.findTest("test case 1").getResult()).toEqual(true);
		expect(unit.findTest("test case 2").getResult()).toEqual(false);
	},
	"can create a unit with custom-named tests from an object with functions as properties": () => {
		const unit = new TestUnit("unit-name", {
			"test case foo": () => { },
			"test case bar": () => { throw new Error("test failed"); }
		});
		expect(unit.unitName).toEqual("unit-name");
		expect(unit.findTest("test case foo").getResult()).toEqual(true);
		expect(unit.findTest("test case bar").getResult()).toEqual(false);
	},
	"can create a unit with auto-generated tests from an array of inputs and outputs - ordinary syntax": () => {
		const increment = (num) => num + 1;
		const unit = new TestUnit("unit-name", [
			increment,
			[1, 2], // test passes
			[2, 3], // test passes
			[3, 100] // test fails
		]);
		expect(unit.unitName).toEqual("unit-name");
		expect(unit.findTest("increment(1) should return 2").getResult()).toEqual(true);
		expect(unit.findTest("increment(2) should return 3").getResult()).toEqual(true);
		expect(unit.findTest("increment(3) should return 100").getResult()).toEqual(false);
	},
	"can create a unit with auto-generated tests from an array of inputs and outputs - alternative syntax": () => {
		const increment = (num) => num + 1;
		const unit = new TestUnit("increment()", increment, [
			[1, 2], // test passes
			[2, 3], // test passes
			[3, 100] // test fails
		]);
		expect(unit.unitName).toEqual("increment()");
		expect(unit.findTest("increment(1) should return 2").getResult()).toEqual(true);
		expect(unit.findTest("increment(2) should return 3").getResult()).toEqual(true);
		expect(unit.findTest("increment(3) should return 100").getResult()).toEqual(false);
	},
	"can create a unit with auto-generated tests where the unit name is inferred from the function name": () => {
		const increment = (num) => num + 1;
		const unit = new TestUnit(increment, [
			[1, 2], // test passes
			[2, 3], // test passes
			[3, 100] // test fails
		]);
		expect(unit.unitName).toEqual("increment()");
		expect(unit.findTest("increment(1) should return 2").getResult()).toEqual(true);
		expect(unit.findTest("increment(2) should return 3").getResult()).toEqual(true);
		expect(unit.findTest("increment(3) should return 100").getResult()).toEqual(false);
	},
	"can create a unit with custom-named but auto-generated tests": () => {
		const increment = (num) => num + 1;
		const unit = new TestUnit("increment()", increment, {
			"test that passes": [1, 2],
			"test that fails": [2, 100],
		});
		expect(unit.unitName).toEqual("increment()");
		expect(unit.findTest("test that passes").getResult()).toEqual(true);
		expect(unit.findTest("test that fails").getResult()).toEqual(false);
	},

	"throws an error when called with something other than one of the valid argument formats": () => {
		testing.assertThrows(() => new TestUnit([1, 2, 3]));
	},
	"throws an error when auto-generating tests but the function is omitted": () => {
		testing.assertThrows(() => new TestUnit("foo()", [ [1, 2] ]));
	},
	"throws an error when called with an object that has non-function values": () => {
		testing.assertThrows(() => new TestUnit("foo()", { "test case 1": () => {}, "test case 2": "foo"} ));
	}
});
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
	},
	"toMatch() works": () => {
		expect("foo123bar").toMatch(/foo\d+bar/g);
		testing.assertThrows(() => {
			expect("foo123bar").toMatch(/foobar/g);
		});
	}
});
testing.addUnit("Testing.testAll()", {
	"correctly runs the tests and logs the output when all the tests pass": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that passes": () => { },
			"other test that passes": () => { },
		});
		const results = [];
		const output = { log: (...args) => results.push([...args]) };
		fixture.testAll(false, false, output);
		expect(results.length).toEqual(1);
		expect(results[0].length).toEqual(3);
		expect(results[0][0]).toMatch(/^%cAll tests passed%c in \d+ms.$/);
		expect(results[0][1]).toEqual("color: rgb(0, 192, 64)");
		expect(results[0][2]).toEqual("");
	},
	"correctly runs the tests and logs the output when one test fails": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that passes": () => { },
			"test that fails": () => { throw new Error("error message"); },
		});
		const results = [];
		const output = { log: (...args) => results.push([...args]) };
		fixture.testAll(false, false, output);
		expect(results).toEqual([
			["%c1 test failed%c: Unit 1 - test that fails (Error: error message)", "color: red;", ""]
		]);
	},
	"correctly runs the tests and logs the output when multiple tests fail": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that fails": () => { throw new Error("error message 1"); },
			"another test that fails": () => { throw new Error("error message 2"); },
		});
		const results = [];
		const output = { log: (...args) => results.push([...args]) };
		fixture.testAll(false, false, output);
		expect(results).toEqual([[
			"%c2 tests failed%c:\n- Unit 1 - test that fails (Error: error message 1)\n- Unit 1 - another test that fails (Error: error message 2)",
			"color: red;", ""
		]]);
	},
	"can run only the fast tests": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that passes": () => { },
			"test that fails": () => { throw new Error("error message 1"); },
		});
		fixture.addUnit("Unit 2", {
			"test that passes": () => { },
			"test that fails": () => { throw new Error("error message 2"); },
		});
		fixture.units[fixture.units.length - 1].isSlow = true;

		const results = [];
		const output = {
			log: (...args) => results.push({ type: "log", data: [...args] }),
			warn: (...args) => results.push({ type: "warn", data: [...args] }),
		};
		fixture.testAll(true, false, output);
		expect(results).toEqual([
			{ type: "warn", data: [`Only running 2 of 4 tests.`] },
			{ type: "log", data: [`%c1 test failed%c: Unit 1 - test that fails (Error: error message 1)`, `color: red;`, ``] }
		]);
	}
});
testing.addUnit("Testing.testUnit()", {
	"correctly runs the tests and logs the output when all the tests pass": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that passes": () => { },
			"other test that passes": () => { },
		});
		const results = [];
		const output = { log: (...args) => results.push([...args]) };
		fixture.testUnit("Unit 1", output);
		expect(results.length).toEqual(1);
		expect(results[0].length).toEqual(3);
		expect(results[0][0]).toMatch(/^%cAll tests passed%c in unit Unit 1 \(\d+ms\)$/);
		expect(results[0][1]).toEqual("color: rgb(0, 192, 64)");
		expect(results[0][2]).toEqual("");
	},
	"correctly runs the tests and logs the output when one test fails": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that passes": () => { },
			"test that fails": () => { throw new Error("test failed"); },
		});
		const results = [];
		const output = { log: (...args) => results.push([...args]) };
		fixture.testUnit("Unit 1", output);
		expect(results).toEqual([
			["%c1 test failed%c in unit Unit 1: test that fails (Error: test failed)", "color: red", ""]
		]);
	},
	"correctly runs the tests and logs the output when multiple tests failed": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that fails": () => { throw new Error("error message 1"); },
			"another test that fails": () => { throw new Error("error message 2"); },
		});
		const results = [];
		const output = { log: (...args) => results.push([...args]) };
		fixture.testUnit("Unit 1", output);
		expect(results).toEqual([
			["%c2 tests failed%c in unit Unit 1:\n- test that fails (Error: error message 1)\n- another test that fails (Error: error message 2)", "color: red;", ""]
		]);
	},
});
testing.addUnit("Testing.runTestByName()", {
	"correctly runs the test and logs the output when the test passes": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that passes": () => { },
		});
		const results = [];
		const output = { log: (...args) => results.push([...args]) };
		fixture.runTestByName("Unit 1 - test that passes", output);
		expect(results.length).toEqual(1);
		expect(results[0].length).toEqual(3);
		expect(results[0][0]).toMatch(/^%cTest passed: %cUnit 1 - test that passes \(\d+ms\)/);
		expect(results[0][1]).toEqual("color: rgb(0, 192, 64)");
		expect(results[0][2]).toEqual("");
	},
	"correctly finds the test when given a test name without a unit name": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that passes": () => { },
		});
		const results = [];
		const output = { log: (...args) => results.push([...args]) };
		fixture.runTestByName("test that passes", output);
		expect(results.length).toEqual(1);
		expect(results[0].length).toEqual(3);
		expect(results[0][0]).toMatch(/^%cTest passed: %cUnit 1 - test that passes \(\d+ms\)/);
		expect(results[0][1]).toEqual("color: rgb(0, 192, 64)");
		expect(results[0][2]).toEqual("");
	},
	"throws the error when the test fails": () => {
		const fixture = new Testing();
		fixture.addUnit("Unit 1", {
			"test that fails": () => { throw new Error("error message 1"); },
		});
		let threwError = false;
		try {
			fixture.runTestByName("test that fails");
		}
		catch(e) {
			threwError = true;
			expect(e.message).toEqual("error message 1");
		}
		expect(threwError).toEqual(true);
	}
});
(() => {
	const fixture = new Testing();
	let testsRun = [];
	fixture.addUnit("Unit A", {
		"test case 1": () => testsRun.push("A1"),
		"test case 2": () => testsRun.push("A2")
	});
	fixture.addUnit("Unit B", {
		"test case 1": () => testsRun.push("B1"),
		"test case 2": () => testsRun.push("B2")
	});
	let logs = [];
	const output = { log: (...input) => logs.push(input) };
	testing.addUnit("Testing.run()", {
		"can run one test when the test is provided": () => {
			logs = [], testsRun = [];
			fixture.run(fixture.tests()[0], output);
			expect(logs.length).toEqual(1);
			expect(logs[0].length).toEqual(3);
			expect(logs[0][0]).toMatch(/^%cTest passed: %cUnit A - test case 1 \(\d+ms\)/g);
			expect(logs[0][1]).toEqual("color: rgb(0, 192, 64)");
			expect(logs[0][2]).toEqual("");
			expect(testsRun).toEqual(["A1"]);
		},
		"can run one unit when the unit is provided": () => {
			logs = [], testsRun = [];
			fixture.run(fixture.units[1], output);
			expect(logs.length).toEqual(1);
			expect(logs[0].length).toEqual(3);
			expect(logs[0][0]).toMatch(/%cAll tests passed%c in unit Unit B \(\d+ms\)/g);
			expect(logs[0][1]).toEqual("color: rgb(0, 192, 64)");
			expect(logs[0][2]).toEqual("");
			expect(testsRun).toEqual(["B1", "B2"]);
		},
		"can run one unit when the unit name is provided": () => {
			logs = [], testsRun = [];
			fixture.run("Unit A", output);
			expect(logs.length).toEqual(1);
			expect(logs[0].length).toEqual(3);
			expect(logs[0][0]).toMatch(/%cAll tests passed%c in unit Unit A \(\d+ms\)/g);
			expect(logs[0][1]).toEqual("color: rgb(0, 192, 64)");
			expect(logs[0][2]).toEqual("");
			expect(testsRun).toEqual(["A1", "A2"]);
		},
		"can run one test when the test name is provided": () => {
			logs = [], testsRun = [];
			fixture.run("test case 1", output);
			expect(logs.length).toEqual(1);
			expect(logs[0].length).toEqual(3);
			expect(logs[0][0]).toMatch(/%cTest passed: %cUnit A - test case 1 \(\d+ms\)/g);
			expect(logs[0][1]).toEqual("color: rgb(0, 192, 64)");
			expect(logs[0][2]).toEqual("");
			expect(testsRun).toEqual(["A1"]);
		},
		"can run one test when the test name and unit name are provided": () => {
			logs = [], testsRun = [];
			fixture.run("Unit B - test case 1", output);
			expect(logs.length).toEqual(1);
			expect(logs[0].length).toEqual(3);
			expect(logs[0][0]).toMatch(/%cTest passed: %cUnit B - test case 1 \(\d+ms\)/g);
			expect(logs[0][1]).toEqual("color: rgb(0, 192, 64)");
			expect(logs[0][2]).toEqual("");
			expect(testsRun).toEqual(["B1"]);
		},
		"can run all the tests when called without arguments": () => {
			logs = [], testsRun = [];
			fixture.run(undefined, output);
			expect(logs.length).toEqual(1);
			expect(logs[0].length).toEqual(3);
			expect(logs[0][0]).toMatch(/%cAll tests passed%c in \d+ms\./g);
			expect(logs[0][1]).toEqual("color: rgb(0, 192, 64)");
			expect(logs[0][2]).toEqual("");
			expect(testsRun).toEqual(["A1", "A2", "B1", "B2"]);
		},
	});
}) ();
