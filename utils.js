class Test {
	static autoGenerateName(input, expectedOutput, func, unitName) {
		let funcName = null;
		const GET_FUNCTION_NAME = /^(\w+)\(\)$/;
		if(func.name !== "") {
			funcName = func.name;
		}
		else if(GET_FUNCTION_NAME.test(unitName)) {
			[funcName] = GET_FUNCTION_NAME.exec(unitName);
		}
		const MAX_LENGTH = 30;
		const inputsStringified = input.map(v => utils.toString(v, MAX_LENGTH)).join(", ");
		if(funcName != null) {
			return `${funcName}(${inputsStringified}) should return ${utils.toString(expectedOutput, MAX_LENGTH)}`;
		}
		else {
			return `it should return ${utils.toString(expectedOutput, MAX_LENGTH)} when given an input of ${inputsStringified}`;
		}
	}
	static createTest(input, expectedOutput, func, unitName) {
		return new Test(
			() => {
				const result = func(...input);
				expect(result).toEqual(expectedOutput);
			},
			Test.autoGenerateName(input, expectedOutput, func, unitName)
		);
	}

	constructor(functionToRun, name) {
		this.functionToRun = functionToRun;
		this.name = name;
		this.unitName = null;
		this.error = null;
	}
	getResult() {
		let passed = true;
		try {
			this.functionToRun();
			this.error = null;
		}
		catch (error) {
			passed = false;
			this.error = error;
		}
		return passed;
	}
}
class TestUnit {
	constructor() {
		this.tests = [];
		if(Array.isArray(arguments[1])) {
			if(arguments[1].every(v => typeof v === "function")) {
				const [unitName, tests] = arguments;
				this.unitName = unitName;
				this.tests = tests.map((functionToRun, index) => new Test(functionToRun, `test case ${index + 1}`));
			}
			else if(typeof arguments[0] === "string" && typeof arguments[1][0] === "function" && arguments[1].slice(1).every(Array.isArray)) {
				const [unitName, [functionToRun, ...testCases]] = arguments;
				this.tests = testCases.map(testCase => {
					const input = testCase.slice(0, testCase.length - 1);
					const expectedOutput = testCase[testCase.length - 1];
					return Test.createTest(input, expectedOutput, functionToRun, unitName);
				});
				this.unitName = unitName;
			}
			else if(typeof arguments[0] === "function") {
				const [functionToRun, testCases] = arguments;
				const unitName = functionToRun.name.includes("(") ? functionToRun.name : `${functionToRun.name}()`;
				this.tests = testCases.map(testCase => {
					const input = testCase.slice(0, testCase.length - 1);
					const expectedOutput = testCase[testCase.length - 1];
					return Test.createTest(input, expectedOutput, functionToRun, unitName);
				});
				this.unitName = unitName;
			}
		}
		else if(typeof arguments[1] === "function" && !Array.isArray(arguments[2]) && Object.keys(arguments[2]).every(key => Array.isArray(arguments[2][key]))) {
			const [unitName, functionToRun, testCases] = arguments;
			const testNames = Object.keys(testCases);
			const testFuncs = testNames.map((testName, index) => {
				const testCase = testCases[testName];
				const input = testCase.slice(0, testCase.length - 1);
				const expectedOutput = testCase[testCase.length - 1];
				return () => {
					const result = functionToRun(...input);
					expect(result).toEqual(expectedOutput);
				};
			});
			this.unitName = unitName;
			this.tests = testFuncs.map((testFunc, index) => new Test(testFunc, testNames[index]));
		}
		else if(typeof arguments[1] === "function" && arguments[2].every(Array.isArray)) {
			const [unitName, functionToRun, testCases] = arguments;
			this.tests = testCases.map(testCase => {
				const input = testCase.slice(0, testCase.length - 1);
				const expectedOutput = testCase[testCase.length - 1];
				return Test.createTest(input, expectedOutput, functionToRun, unitName);
			});
			this.unitName = unitName;
		}
		else if(arguments[1] instanceof Object) {
			if(Object.keys(arguments[1]).every(testName => typeof arguments[1][testName] === "function")) {
				const [unitName, tests] = arguments;
				this.unitName = unitName;
				this.tests = Object.entries(tests).map(([testName, functionToRun]) => new Test(functionToRun, testName));
			}
		}
		else {
			throw new Error("Invalid usage.");
		}


		this.tests.forEach(test => {
			test.unitName = this.unitName;
		});
	}

	findTest(name) {
		return this.tests.find(t => t.name === name);
	}
}


const expect = function() {
	const expectArgs = [...arguments];
	const [value] = arguments;
	if(!arguments.length) {
		throw new Error("expect() cannot be called without arguments.");
	}
	const equals = (v1, v2) => (
		// used for expect(...).toEqual(...) and expect(...).toNotEqual(...)
		v1 === v2 ||
		(Number.isNaN(v1) && Number.isNaN(v2)) ||
		(typeof v1 === "object" && v1 !== null && typeof v2 === "object" && v1.equals(v2)) ||

		(typeof v1 === "number" && typeof v2 === "bigint" && Number(v2) === v1) ||
		(typeof v2 === "number" && typeof v1 === "bigint" && Number(v1) === v2)
	);
	const strictlyEquals = (v1, v2) => ((v1 === v2) || (Number.isNaN(v1) && Number.isNaN(v2)));
	const isNumeric = (value) => (typeof value === "number" || typeof value === "bigint") && !Number.isNaN(value);
	return {
		toEqual: function(valueToEqual) {
			if(!arguments.length) {
				throw new Error("expect(value).toEqual(value) should be called with one argument; instead recieved no arguments.");
			}
			testing.assert(
				equals(value, valueToEqual),
				`Expected value of '${valueToEqual}' did not equal actual value of '${value}'`
			);
		},
		toStrictlyEqual: function(valueToEqual) {
			if(!arguments.length) {
				throw new Error("expect(value).toStrictlyEqual(value) should be called with one argument; instead recieved no arguments.");
			}
			testing.assert(
				strictlyEquals(value, valueToEqual),
				`Expected value of '${valueToEqual}' did not strictly equal actual value of '${value}'.`
			);
		},
		toNotEqual: function(valueToNotEqual) {
			if(!arguments.length) {
				throw new Error("expect(value).toNotEqual(value) should be called with one argument; instead recieved no arguments.");
			}
			testing.assert(
				!equals(value, valueToNotEqual),
				`Expected value of '${valueToNotEqual}' did not equal actual value of '${value}'`
			);
		},
		toNotStrictlyEqual: function(valueToNotEqual) {
			if(!arguments.length) {
				throw new Error("expect(value).toNotStrictlyEqual(value) should be called with one argument; instead recieved no arguments.");
			}
			testing.assert(
				!strictlyEquals(value, valueToNotEqual),
				`Expected value of '${valueToNotEqual}' did strictly equal actual value of '${value}'.`
			);
		},

		toBeTrue: function() {
			testing.assert(
				value === true,
				`Expected the value to be true, but the actual value was '${value}'.`
			);
		},
		toBeFalse: function() {
			testing.assert(
				value === false,
				`Expected the value to be false, but the actual value was '${value}'.`
			);
		},
		toBeTruthy: function() {
			testing.assert(
				value,
				`Expected the value to be truthy, but the actual value was '${value}'.`
			);
		},
		toBeFalsy: function() {
			testing.assert(
				!value,
				`Expected the value to be falsy, but the actual value was '${value}'.`
			);
		},

		toThrow: function() {
			const func = value;
			const args = expectArgs.slice(1);
			if(typeof func !== "function") {
				throw new Error(`Usage: 'expect(func).toThrow();'. The provided value (${value}) was not a function.`);
			}

			let threwError = false;
			try {
				func(...args);
			}
			catch(e) {
				threwError = true;
			}
			testing.assert(threwError, `Expected function '${func.name}' to throw an error.`)
		},

		toBeNumeric: function() {
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be numeric.`
			);
		},
		toBeAnObject: function() {
			testing.assert(
				typeof value === "object" && value !== null,
				`Expected ${value} to be an object.`
			);
		},
		toBeAnArray: function() {
			testing.assert(
				Array.isArray(value),
				`Expected ${value} to be an array.`
			);
		},

		toBePositive: function() {
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a positive number, but it was non-numeric.`
			);
			testing.assert(
				value > 0,
				`Expected ${value} to be a positive number.`
			);
		},
		toBeNegative: function() {
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a negative number, but it was non-numeric.`
			);
			testing.assert(
				value < 0,
				`Expected ${value} to be a negative number.`
			);
		},
		toBeAnInteger: function() {
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be an integer, but it was non-numeric.`
			);
			testing.assert(
				typeof value === "bigint" || Math.round(value) === value,
				`Expected ${value} to be an integer.`
			);
		},
		toBeBetween: function(min, max) {
			testing.assert(
				arguments.length === 2,
				`expect(value).toBeBetween(min, max) should be called with exactly two arguments.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a number.`
			);
			testing.assert(
				isNumeric(min) && isNumeric(max),
				`expect(value).toBeBetween(min, max) should be called with two numeric arguments.`
			);
			testing.assert(
				max > min,
				`expect(value).toBeBetween(min, max) should be called with two arguments such that max > min.`
			);
			testing.assert(
				min <= value && value <= max,
				`Expected ${value} to be between ${min} and ${max}.`
			);
		},
		toBeStrictlyBetween: function(min, max) {
			testing.assert(
				arguments.length === 2,
				`expect(value).toBeStrictlyBetween(min, max) should be called with exactly two arguments.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a number.`
			);
			testing.assert(
				isNumeric(min) && isNumeric(max),
				`expect(value).toBeStrictlyBetween(min, max) should be called with two numeric arguments.`
			);
			testing.assert(
				max > min,
				`expect(value).toBeStrictlyBetween(min, max) should be called with two arguments such that max > min.`
			);
			testing.assert(
				min < value && value < max,
				`Expected ${value} to be strictly between ${min} and ${max}.`
			);
		},
		toApproximatelyEqual: function(num, tolerance = 1e-15) {
			testing.assert(
				arguments.length >= 1 && arguments.length <= 2,
				`expect(value).toApproximatelyEqual(value) should be called with one or two arguments.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to approximately equal ${num}, but the value was non-numeric.`
			);
			testing.assert(
				isNumeric(num),
				`expect(value).toApproximatelyEqual(value) should be called with a numeric argument.`
			);
			testing.assert(
				isNumeric(tolerance),
				`Tolerance value for approximate comparisons must be a number.`
			);
			testing.assert(
				Math.abs(value - num) < tolerance,
				`Expected ${value} to be extremely close to ${num}.`
			);
		},
		toBeGreaterThan: function(num) {
			testing.assert(
				arguments.length === 1,
				`expect(value).toBeGreaterThan(value) should be called with exactly one argument.`
			);
			testing.assert(
				isNumeric(num),
				`expect(value).toBeGreaterThan(value) should be called with a numeric argument.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a number greater than ${num}, but the value was non-numeric.`
			);
			testing.assert(
				value > num,
				`Expected ${value} to be greater than ${num}.`
			);
		},
		toBeLessThan: function(num) {
			testing.assert(
				arguments.length === 1,
				`expect(value).toBeLessThan(value) should be called with exactly one argument.`
			);
			testing.assert(
				isNumeric(num),
				`expect(value).toBeLessThan(value) should be called with a numeric argument.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a number less than ${num}, but the value was non-numeric.`
			);
			testing.assert(
				value < num,
				`Expected ${value} to be greater than ${num}.`
			);
		},

		toHaveProperties: function(...properties) {
			testing.assert(
				properties.every(prop => typeof prop === "string"),
				`expect(value).toHaveProperties() should be called with string arguments.`
			);

			properties.forEach(prop => {
				testing.assert(
					value.hasOwnProperty(prop),
					`Expected ${value} to have the property '${prop}'.`
				);
			});
		},
		toOnlyHaveProperties: function(...properties) {
			testing.assert(
				properties.every(prop => typeof prop === "string"),
				`expect(value).toHaveProperties() should be called with string arguments.`
			);

			properties.forEach(prop => {
				testing.assert(
					value.hasOwnProperty(prop),
					`Expected ${value} to have the property '${prop}'.`
				);
			});
			Object.keys(value).forEach(prop => {
				testing.assert(
					properties.includes(prop),
					`${value} had the extra property ${prop} (with value of ${value[prop]}).`
				);
			});
		},
		toInstantiate: function(constructor) {
			testing.assert(
				value instanceof constructor,
				`Expected ${value} to be an instance of ${constructor}.`
			);
		},
		toDirectlyInstantiate: function(constructor) {
			testing.assert(
				value.constructor === constructor,
				`Expected ${value} to be an instance of ${constructor}.`
			);
		}
	};
};

class Testing {
	constructor() {
		this.units = [];

		this.assertionsRun = 0;
		this.assertionsPassed = 0;
		this.assertionsFailed = 0;
	}

	addUnit() {
		if(arguments[0] instanceof TestUnit) {
			const [unit] = arguments;
			this.units.push(unit);
		}
		else {
			const unit = new TestUnit(...arguments);
			this.units.push(unit);
		}
	}

	testAll(fastOnly = false, output = console) {
		this.resetTests();

		const tests = fastOnly ? this.tests().filter(t => !t.isSlow && !this.units.find(u => u.unitName === t.unitName).isSlow) : this.tests();
		tests.forEach(test => {
			test.result = test.getResult();
		});
		if(tests.length !== this.tests().length) {
			output.warn(`Only running ${tests.length} of ${this.tests().length} tests.`);
		}

		const failed = this.testsFailed();
		const numFailed = failed.length;
		if(numFailed === 0) {
			output.log("%cAll tests passed!", "color: rgb(0, 192, 64)");
		}
		else if(numFailed === 1) {
			const [test] = failed;
			output.log(`%c1 test failed%c: ${test.unitName} - ${test.name} (${test.error})`, "color: red;", "");
		}
		else {
			let result = `%c${numFailed} tests failed%c:`;
			for(const test of failed) {
				result += `\n- ${test.unitName} - ${test.name} (${test.error})`;
			}
			output.log(result, "color: red;", "");
		}
	}
	testUnit(unitName, output = console) {
		this.resetTests();

		const unit = this.units.find(u => u.unitName === unitName);
		if(!unit) {
			throw new Error(`Cannot find unit ${unitName}`);
		}
		const tests = unit.tests;
		tests.forEach(test => {
			test.result = test.getResult();
		});

		const failed = this.testsFailed();
		const numFailed = failed.length;
		if(numFailed === 0) {
			output.log(`%cAll tests passed%c in unit ${unitName}`, "color: rgb(0, 192, 64)", "");
		}
		else if(numFailed === 1) {
			const [test] = failed;
			output.log(`%c1 test failed%c in unit ${unitName}: ${test.name} (${test.error})`, "color: red", "");
		}
		else {
			let result = `%c${numFailed} tests failed%c in unit ${unitName}:`;
			for(const test of failed) {
				result += `\n- ${test.name} (${test.error})`;
			}
			output.log(result, "color: red;", "");
		}
	}
	runTest(test, output = console) {
		test.functionToRun();

		const text = `%cTest passed: %c${test.unitName} - ${test.name}`;
		output.log(text, "color: rgb(0, 192, 64)", "");
	}
	runTestByName(testName, output = console) {
		const tests = this.tests();
		let test = tests.find(t => t.name === testName);
		if(test) {
			this.runTest(test, output);
		}
		else {
			test = tests.find(t => `${t.unitName} - ${t.name}` === testName);
			if(test) {
				this.runTest(test, output);
			}
			else {
				throw new Error(`No test found matching name '${testName}'.`);
			}
		}
	}
	run(input, output = console) {
		if(input instanceof Test) {
			this.runTest(input, output);
		}
		else if(input instanceof TestUnit) {
			this.testUnit(input.unitName, output);
		}
		else if(typeof input === "string") {
			const unit = this.units.find(u => u.unitName === input);
			const test1 = this.tests().find(t => t.name === input);
			const test2 = this.tests().find(t => `${t.unitName} - ${t.name}` === input);
			if(unit) {
				this.testUnit(unit.unitName, output);
			}
			else if(test1) {
				this.runTestByName(`${test1.unitName} - ${test1.name}`, output);
			}
			else if(test2) {
				this.runTestByName(`${test2.unitName} - ${test2.name}`, output);
			}
			else {
				throw new Error(`No results found for query '${input}'.`);
			}
		}
		else {
			this.testAll(false, output);
		}
	}

	logTests() {
		/* prints all tests to the console, with their results (pass / fail). */
		const linesOfText = [];
		const styles = [];
		this.units.forEach(unit => {
			linesOfText.push(`%c${unit.unitName}%c`);
			styles.push("font-weight: bold", "");
			unit.tests.forEach(test => {
				let resultText, resultTextColor;
				if(test.result === true) {
					resultText = "Test passed";
					resultTextColor = "rgb(0, 192, 64)";
				}
				else if(test.result === false) {
					resultText = "Test failed";
					resultTextColor = "red";
				}
				else {
					resultText = "Test not run yet";
					resultTextColor = "";
				}
				linesOfText.push(`- %c${resultText}%c: ${test.name}`);
				styles.push(`color: ${resultTextColor}`, "");
			});
		});
		console.log(linesOfText.join("\n"), ...styles);
	}

	tests() {
		return this.units.map(unit => unit.tests).flat();
	}
	testsPassed() {
		return this.tests().filter(t => t.result === true);
	}
	testsFailed() {
		return this.tests().filter(t => t.result === false);
	}

	resetTests() {
		this.assertionsRun = 0;
		this.assertionsPassed = 0;
		this.assertionsFailed = 0;
		for(const unit of this.units) {
			for(const test of unit.tests) {
				test.error = null;
				test.result = null;
			}
		}
	}


	assert(value, errorMsg) {
		this.assertionsRun ++;
		if(!value) {
			this.assertionsFailed ++;
			throw new Error(errorMsg || "Assertion failed. Expected '" + value + "' to be truthy, but it was not.");
		}
		this.assertionsPassed ++;
	}
	refute(value) {
		this.assertionsRun ++;
		if(value) {
			this.assertionsFailed ++;
			throw new Error("Assertion failed. Expected '" + value + "' to be falsy, but it was not.");
		}
		this.assertionsPassed ++;
	}
	assertEqual(value1, value2) {
		this.assertionsRun ++;
		if(value1 !== value2) {
			this.assertionsFailed ++;
			throw new Error("Assertion failed. Expected '" + value1 + "' to be equal to '" + value2 + "', but it was not.");
		}
		this.assertionsPassed ++;
	}
	assertEqualApprox(value1, value2, tolerance = 1e-12) {
		this.assertionsRun ++;
		if(Object.typeof(value1) !== "number" || Object.typeof(value2) !== "number") {
			this.assertionsFailed ++;
			throw new Error("arguments to assertEqualApprox() must be numbers. values of '" + value1 + "' or '" + value2 + "' are invalid.");
		}
		if(Math.dist(value1, value2) > tolerance) {
			this.assertionsFailed ++;
			throw new Error("assertion failed. expected " + value1 + " to be at least approximately equal to " + value2);
		}
		this.assertionsPassed ++;
	}
	assertEquivalent(value1, value2) {
		if((typeof value1 === "object" && value1 !== null) && (typeof value2 === "object" && value2 !== null) && typeof value1.equals === "function") {
			testing.assert(value1.equals(value2));
		}
		else {
			testing.assert(value1 === value2);
		}
	}
	assertThrows(callback, expectedMsg) {
		this.assertionsRun ++;
		let error;
		try {
			callback();
		}
		catch(e) {
			error = e;
		}
		if(!error) {
			this.assertionsFailed ++;
			throw new Error(`Assertion failed. Expected ${callback.name} to throw an error, but it did not`);
		}
		if(typeof expectedMsg === "string" && expectedMsg.length !== 0) {
			if(typeof error.message !== "string") {
				this.assertionsFailed ++;
				throw new Error(`Expected ${callback.name} to throw an error with a message of '${expectedMsg}', but the resulting error had no message.`);
			}
			else if(expectedMsg !== error.message) {
				this.assertionsFailed ++;
				throw new Error(`Expected ${callback.name} to throw an error with a message of '${expectedMsg}', but the error message was ${error.message} instead.`);
			}
		}
		else if(expectedMsg instanceof RegExp) {
			if(typeof error.message !== "string") {
				this.assertionsFailed ++;
				throw new Error(`Expected ${callback.name} to throw an error with a message matching '${expectedMsg}', but the resulting error had no message.`);
			}
			else if(!expectedMsg.test(error.message)) {
				this.assertionsFailed ++;
				throw new Error(`Expected ${callback.name} to throw an error with a message matching '${expectedMsg}', but the error message was ${error.message} instead.`);
			}
		}
		this.assertionsPassed ++;
	}
}

const testing = new Testing();

Function.prototype.method = function() {
	if(arguments[0] instanceof String && arguments[1] instanceof Function) {
		const [name, func] = arguments;
		this.prototype[name] = func;
	}
	else if(arguments[0] instanceof Function) {
		const [func] = arguments;
		this.prototype[func.name] = func;
	}
	return this;
};
Function.method(function memoize(stringifyKeys = false, cloneOutput = false) {
	/*
	`stringifyKeys` lets you specify an additional optimization. If set to true, the arguments will be stringified before being set into the map, allowing for constant lookup times.
	However, not all arguments can be stringified without information loss (think of all the "[object Object]"s! Oh no!). If your arguments are like this, then do not use this feature.
	*/
	const map = new Map();
	Function.prototype.memoize.maps.push(map);
	const func = this;
	const name = `${this.name || "(anonymous)"} (memoized)`;
	if(stringifyKeys) {
		return {
			[name]: function() {
				const stringified = [...arguments].toString();
				if(map.has(stringified)) {
					const result = map.get(stringified);
					return cloneOutput ? ((typeof result === "object" && result != null) ? result.clone() : result) : result;
				}

				const result = func.apply(this, arguments);
				map.set(stringified, result);
				return result;
			}
		}[name];
	}
	else {
		return {
			[name]: function() {
				for(let [key, value] of map.entries()) {
					if([...key].every((val, i) => val === arguments[i])) {
						return cloneOutput ? ((typeof value === "object" && value != null) ? value.clone() : value) : value;;
					}
				}
				const result = func.apply(this, arguments);
				map.set(arguments, result);
				return result;
			}
		}[name];
	}
});
Function.prototype.memoize.maps = [];
Function.prototype.memoize.clear = function() {
	/* clears the cached results in ALL memoized functions. */
	for(const map of Function.prototype.memoize.maps) {
		map.clear();
	}
};

Object.method(function clone(history = [], baseObject) {
	if(this == null) { return null; }
	if(
		this instanceof Number ||
		this instanceof String ||
		this instanceof Boolean
	) { return this.valueOf(); }
	let clone;
	if(baseObject) {
		clone = baseObject;
	}
	else if(Array.isArray(this)) {
		clone = [];
	}
	else {
		clone = Object.create(this.__proto__);
	}
	for(let i in this) {
		if(this.hasOwnProperty(i)) {
			const historyItem = history.find(v => v.selfItem === this[i]);
			if(historyItem) {
				clone[i] = historyItem.otherItem;
			}
			else if(typeof this[i] === "object" && this[i] !== null) {
				const newBaseObject = Array.isArray(this[i]) ? [] : Object.create(this[i].__proto__);
				clone[i] = this[i].clone(
					[...history, { selfItem: this[i], otherItem: newBaseObject }],
					newBaseObject
				);
			}
			else {
				clone[i] = this[i];
			}
		}
	}
	return clone;
});
Object.method(function equals(obj, history = []) {
	if(this === obj) { return true; }
	if(
		(this.valueOf() !== this) ||
		(typeof obj !== "object" || obj === null)
	) {
		return (
			this.valueOf() === obj?.valueOf() ||
			(Number.isNaN(this.valueOf()) && Number.isNaN(obj.valueOf()))
		);
	}
	if(this.__proto__ !== obj.__proto__) {
		return false;
	}
	if(Object.keys(this).length !== Object.keys(obj).length) {
		return false;
	}
	for(var i in this) {
		var prop1 = this[i];
		var prop2 = obj[i];
		var type1 = Object.typeof(prop1);
		var type2 = Object.typeof(prop2);
		if(type1 !== type2) {
			return false;
		}
		else if(type1 === "object" || type1 === "array" || type1 === "instance") {
			var historyItem = history.find(v => v.selfItem === prop1);
			if(historyItem) {
				return historyItem.otherItem === prop2;
			}
			else {
				var newHistory = [
					...history,
					{ selfItem: prop1, otherItem: prop2 }
				];
				if(!prop1.equals(prop2, newHistory)) {
					return false;
				}
			}
		}
		else if(prop1 !== prop2) {
			return false;
		}
	}
	return true;
});
Object.method(function set(key, value) {
	this[key] = value;
	return this;
});
Object.method(function watch(key, callback) {
	const getter = this.__lookupGetter__(key);
	const setter = this.__lookupSetter__(key);
	let value = this[key];
	Object.defineProperty(this, key, {
		get: () => {
			if(typeof getter === "function") { getter(); }
			return value;
		},
		set: (newValue) => {
			callback(this, key, newValue);
			if(typeof setter === "function") {
				setter();
			}
			else { value = newValue; }
		}
	});
});
Object.typeof = function(value) {
	/*
	This function serves to determine the type of a variable better than the default "typeof" operator, which returns strange values for some inputs (see special cases below).
	*/
	if(value !== value) {
		return "NaN"; // fix for (typeof NaN === "number")
	}
	else if(value === null) {
		return "null"; // fix for (typeof null === "object")
	}
	else if(Array.isArray(value)) {
		return "array"; // fix for (typeof [] === "object")
	}
	else if(typeof value === "object" && Object.getPrototypeOf(value) !== Object.prototype) {
		return "instance"; // return "instance" for instances of a custom class
	}
	else {
		return typeof value;
	}
};

Array.method(function repeat(numTimes) {
	let result = this;
	for(let i = 0; i < numTimes - 1; i ++) {
		result = result.concat(this);
	}
	return result;
});

Array.method(function subArrays() {
	const result = new Set([
		[]
	]);
	for(let start = 0; start < this.length; start ++) {
		for(let end = start + 1; end <= this.length; end ++) {
			result.add(this.slice(start, end));
		}
	}
	return result;
});
Array.method(function partitions() {
	/* returns the set of all partitionings of this array. */
	const partitions = new Set([]);
	for(const partition of this.partitionGenerator()) {
		partitions.add(partition);
	}
	return partitions;
});
Array.method(function* partitionGenerator() {
	if(this.length === 1) {
		yield [[this[0]]];
		return;
	}
	for(const partition of this.slice(1).partitionGenerator()) {
		yield [
			[this[0]],
			...partition
		];
		yield [
			[this[0], ...partition[0]],
			...partition.slice(1)
		];
	}
});

Array.method(function sum(func, thisArg) {
	if(typeof func === "function") { return this.map(func, thisArg).sum(); }
	let sum = 0;
	for(let number of this) {
		if(typeof number === "bigint") { sum = BigInt(sum); }
		if(typeof sum === "bigint") { number = BigInt(number); }
		sum += number;
	}
	return sum;
});
Array.method(function product(func, thisArg) {
	if(typeof func === "function") { return this.map(func).product(); }

	let product = 1;
	for(let number of this) {
		if(typeof number === "bigint") { product = BigInt(product); }
		if(typeof product === "bigint") { number = BigInt(number); }
		product *= number;
	}
	return product;
});

Array.method(function min(func, thisArg, resultType = "object") {
	if(typeof func === "function") {
		let lowestIndex = 0;
		let lowestValue = Infinity;
		this.forEach((item, index, array) => {
			let value = func.call(thisArg, item, index, array);
			if(value < lowestValue) {
				lowestValue = value;
				lowestIndex = index;
			}
		});

		if(resultType === "object") {
			return this[lowestIndex];
		}
		else if(resultType === "index") {
			return lowestIndex;
		}
		else if(resultType === "value") {
			return lowestValue;
		}
		else if(resultType === "all") {
			return [this[lowestIndex], lowestIndex, lowestValue];
		}
	}
	else {
		return this.min(num => num, thisArg, resultType);
	}
});
Array.method(function max(func, thisArg, resultType = "object") {
	if(typeof func === "function") {
		let highestIndex = 0;
		let highestValue = -Infinity;
		this.forEach((item, index, array) => {
			let value = func.call(thisArg, item, index, array);
			if(value > highestValue) {
				highestValue = value;
				highestIndex = index;
			}
		});

		if(resultType === "object") {
			return this[highestIndex];
		}
		else if(resultType === "index") {
			return highestIndex;
		}
		else if(resultType === "value") {
			return highestValue;
		}
		else if(resultType === "all") {
			return [this[highestIndex], highestIndex, highestValue];
		}
	}
	else {
		return this.max(num => num, thisArg, resultType);
	}
});

Array.method(function count() {
	if(arguments[0] instanceof Function) {
		const [callback] = arguments;
		return this.filter(callback).length;
	}
	else {
		const [searchTarget] = arguments;
		return this.filter(v => v === searchTarget).length;
	}
});

Array.method(function permutations() {
	if(this.length === 1) {
		return new Set([
			[this[0]]
		]);
	}

	const permutations = new Set();
	new Set(this).forEach(value => {
		const index = this.indexOf(value);
		const others = this.filter((v, i) => i !== index);
		const permutationsOfOthers = others.permutations();
		for(const otherPermutation of permutationsOfOthers) {
			permutations.add([value, ...otherPermutation]);
		}
	});
	
	return permutations;
});

Array.method(function isSorted(callback) {
	if(typeof callback === "function") {
		for(let i = 0; i < this.length - 1; i ++) {
			if(callback(this[i], this[i + 1]) > 0) { return false; }
		}
		return true;
	}
	else {
		if(this.some(v => typeof v !== "number")) {
			throw new Error("No callback provided; expected the array to contain only numbers.");
		}
		for(let i = 0; i < this.length - 1; i ++) {
			if(this[i] > this[i + 1]) { return false; }
		}
		return true;
	}
});
Array.SORT_ASCENDING = (a, b) => a - b;
Array.SORT_DESCENDING = (a, b) => b - a;

Array.method(function deduplicate() {
	return [...new Set(this)];
});

Array.method(function group(...callbacks) {
	const groups = new Array(callbacks.length + 1).fill().map(v => []);
	for(const [index, value] of this.entries()) {
		let addedToGroup = false;
		for(const [callbackIndex, callback] of callbacks.entries()) {
			if(callback(value, index, this)) {
				groups[callbackIndex].push(value);
				addedToGroup = true;
				break;
			}
		}
		if(!addedToGroup) {
			groups[groups.length - 1].push(value);
		}
	}
	return [].concat(...groups);
});

Number.method(function digits() {
	const number = Math.abs(this);
	if(number % 1 !== 0) {
		throw new Error("Cannot get the digits of a non-integer.");
	}
	const numDigits = `${number}`.length;
	const digits = [];
	for(let i = 0; i < numDigits; i ++) {
		digits.push(Math.floor(number / (10 ** (numDigits - i - 1))) % 10);
	}
	return digits;
});

Set.method(function equals(set) {
	if(this.size !== set.size) {
		return false;
	}
	for(const item of this.values()) {
		if(![...set].some(value => value === item || ((typeof value === "object" && value != null) && value.equals(item)))) {
			return false;
		}
	}
	return true;
});
Set.method(function clone() {
	let clone = new Set([]);
	this.forEach(item => {
		if(typeof item === "object" && item != null) {
			clone.add(item.clone());
		}
		else {
			clone.add(item);
		}
	});
	return clone;
});


Set.method(function intersection(set) {
	/* returns the set of items that are in both sets. */
	const result = new Set();
	this.forEach(value => {
		if(set.has(value)) {
			result.add(value);
		}
	});
	return result;
});
Set.method(function union(set) {
	const result = new Set();
	this.forEach(value => {
		result.add(value);
	});
	set.forEach(value => {
		result.add(value);
	});
	return result;
});
Set.method(function difference(set) {
	/* returns the set of items that are in this set but not in the other set. */
	const result = new Set();
	this.forEach(value => {
		if(!set.has(value)) {
			result.add(value);
		}
	});
	return result;
});
Set.method(function subsets() {
	/* returns the power set: the set of every subset of this set. */
	if(this.size === 0) {
		return new Set([
			new Set([])
		]);
	}
	if(this.size === 1) {
		return new Set([
			new Set([]),
			new Set(this)
		]);
	}
	const elementsArray = [...this];
	const arbitraryElement = [...this][0];
	const otherElements = elementsArray.slice(1);
	const subsetsOfOthers = new Set(otherElements).subsets();
	return new Set([
		...subsetsOfOthers,
		...subsetsOfOthers.map(subset => new Set([arbitraryElement, ...subset]))
	]);
});
Set.cartesianProduct = function(...sets) {
	const firstSet = sets[0];
	if(sets.length === 1) {
		return new Set(firstSet.map(value => [value]));
	}
	const laterSets = sets.slice(1);
	const productOfOthers = Set.cartesianProduct(...laterSets);
	let result = new Set();
	firstSet.forEach(item => {
		productOfOthers.forEach(subproduct => {
			result.add([item, ...subproduct]);
		});
	});
	return result;
};
Set.cartesianProductGenerator = function*(...sets) {
	if(sets.length === 1) {
		for(const element of sets[0]) {
			yield [element];
		}
		return;
	}
	else {
		const firstSet = sets[0];
		const otherSets = sets.slice(1);
		for(const element of firstSet) {
			for(const product of Set.cartesianProductGenerator(...otherSets)) {
				yield [element, ...product];
			}
		}
	}
};
Set.method(function cartesianPower(power) {
	return Set.cartesianProduct(...[this].repeat(power));
});


Set.method(function map(callback) {
	return new Set([...this].map(callback));
});
Set.method(function every(callback) {
	return new Set([...this].every(callback));
});
Set.method(function some(callback) {
	return [...this].some(callback);
});
Set.method(function filter(callback) {
	return new Set([...this].filter(callback));
});
Set.method(function find(callback) {
	return [...this].find(callback);
});
Set.method(function onlyItem() {
	if(this.size !== 1) {
		throw new Error(`Expected the set to have exactly 1 item, but instead it had ${this.size}.`);
	}
	return [...this][0];
});

Math.logBase = function(base, number) {
	const result = Math.log(number) / Math.log(base);
	if(base % 1 === 0 && number % 1 === 0 && base ** Math.round(result) === number) {
		return Math.round(result); // return exact results for integer inputs + outputs
	}
	return result;
};
Math.divisors = function(number) {
	/*
	Returns the divisors of the number, in an array in ascending order.
	Runs in O(sqrt(n)) time.
	*/
	const divisorsBelowSqrt = [];
	const divisorsAboveSqrt = [];
	for(let i = 1; i * i <= number; i ++) {
		if(number % i === 0) {
			divisorsBelowSqrt.push(i);
			if(i * i !== number) { divisorsAboveSqrt.push(number / i); }
		}
	}
	return [...divisorsBelowSqrt, ...divisorsAboveSqrt.reverse()];
};
Math.factorize = function(number, mode = "factors-list") {
	let result;
	if(mode === "factors-list" || mode === "exponents-list") { result = []; }
	else if(mode === "prime-exponents") { result = {}; }

	number = BigInt(number);
	for(let [prime, i] of Sequence.PRIMES.entries()) {
		prime = BigInt(prime);
		if(mode === "exponents-list") {
			result[i] = 0;
		}
		while(number % prime === 0n) {
			number /= prime;
			if(mode === "factors-list") { result.push(Number(prime)); }
			else if(mode === "prime-exponents") {
				result[prime] ??= 0;
				result[prime] ++;
			}
			else if(mode === "exponents-list") {
				result[i] ++;
			}
		}
		if(number == 1) { break; }
	}
	if(number != 1) {
		if(mode === "factors-list") { result.push(Number(number)); }
		else if(mode === "prime-exponents") {
			result[number] ??= 0;
			result[number] ++;
		}
		else if(mode === "exponents-list") {
			const index = Sequence.PRIMES.indexOf(number);
			result[index] ??= 0;
			result[index] ++;
		}
	}
	return result;
};
Math.isPrime = function(number) {
	if(number === 1) { return false; }
	if(number % 2 === 0 && number !== 2) { return false; }
	for(let i = 3; i * i <= number; i += 2) {
		if(number % i === 0) { return false; }
	}
	return true;
};
Math.gcd = function(...numbers) {
	numbers = numbers.map(v => v < 0 ? -v : v); // Math.abs doesn't work for BigInts
	if(numbers.length === 1) {
		return numbers[0];
	}
	else if(numbers.length === 2) {
		let [a, b] = numbers;
		const bigIntInput = (typeof a === "bigint" || typeof b === "bigint");
		a = BigInt(a);
		b = BigInt(b);
		while(a !== b) {
			if(a > b) {
				a = (a % b == 0) ? b : a % b;
			}
			else {
				b = (b % a == 0) ? a : b % a;
			}
		}
		return bigIntInput ? a : Number(a);
	}
	else {
		let gcd = Math.gcd(numbers[0], numbers[1]);
		for(let i = 2; i < numbers.length; i ++) {
			gcd = Math.gcd(gcd, numbers[i]);
		}
		return gcd;
	}
}
Math.areCoprime = function(a, b) {
	return Math.gcd(a, b) === 1;
};
Math.map = function(val, min1, max1, min2, max2) {
	return (val - min1) / (max1 - min1) * (max2 - min2) + min2;
};
Math.dist = function(...args) {
	if(args.length === 2) {
		const [a, b] = args;
		return Math.abs(a - b);
	}
	else if(args.length === 4) {
		const [x1, y1, x2, y2] = args;
		return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
	}
	else {
		throw new Error("Invalid usage. Math.dist expects either two numbers or four numbers.");
	}
};
Math.rotate = function(x, y, degrees) {
	const radians = degrees * Math.PI / 180;
	return new Vector(
		x * Math.cos(radians) - y * Math.sin(radians),
		x * Math.sin(radians) + y * Math.cos(radians)
	);
};

Map.method(function equals(map) {
	if(this.size !== map.size) { return false; }

	const areEqual = (a, b) => (
		a === b ||
		(typeof a === "object" && a != null) && a.equals(b)
	);
	loop1: for(const [key, value] of this) {
		loop2: for(const [otherKey, otherValue] of map) {
			if(areEqual(key, otherKey) && areEqual(value, otherValue)) {
				continue loop1;
			}
		}
		return false;
	}
	return true;
});
Map.method(function clone() {
	const clone = new Map();
	for(const [key, value] of this.entries()) {
		const newKey = (key != null) ? key.clone() : key;
		const newValue = (value != null) ? value.clone() : value;
		clone.set(newKey, newValue);
	}
	return clone;
});

CanvasRenderingContext2D.method(function polygon() {
	if(arguments[0] instanceof Array) {
		const [vertices] = arguments;
		this.polygon(...vertices);
	}
	else if([...arguments].every(v => typeof v === "number") && arguments.length % 2 === 0) {
		this.moveTo(arguments[0], arguments[1]);
		for(let i = 2; i < arguments.length - 1; i += 2) {
			this.lineTo(arguments[i], arguments[i + 1]);
		}
		this.lineTo(arguments[0], arguments[1]);
	}
	else if([...arguments].every(v => typeof v.x === "number" && typeof v.y === "number")) {
		this.moveTo(arguments[0].x, arguments[0].y);
		for(const vertex of [...arguments].slice(1)) {
			this.lineTo(vertex.x, vertex.y);
		}
		this.lineTo(arguments[0].x, arguments[0].y);
	}
});
CanvasRenderingContext2D.method(function fillPoly() {
	this.beginPath();
	this.polygon(...arguments);
	this.fill();
});
CanvasRenderingContext2D.method(function strokePoly() {
	this.beginPath();
	this.polygon(...arguments);
	this.stroke();
});
CanvasRenderingContext2D.method(function fillCircle(x, y, r) {
	this.beginPath();
	this.arc(x, y, r, 0, 2 * Math.PI);
	this.fill();
});
CanvasRenderingContext2D.method(function strokeCircle(x, y, r) {
	this.beginPath();
	this.arc(x, y, r, 0, 2 * Math.PI);
	this.stroke();
});
CanvasRenderingContext2D.method(function fillCanvas(color = this.fillStyle) {
	this.save();
	this.setTransform(1, 0, 0, 1, 0, 0); // reset transformations
	this.fillStyle = color;
	this.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.restore();
});
CanvasRenderingContext2D.method(function strokeLine() {
	if([...arguments].every(v => typeof v === "number")) {
		const [x1, y1, x2, y2] = arguments;
		this.beginPath();
		this.moveTo(x1, y1);
		this.lineTo(x2, y2);
		this.stroke();
	}
	else if(
		typeof arguments[0].x === "number" && typeof arguments[0].y === "number" &&
		typeof arguments[1].x === "number" && typeof arguments[1].y === "number"
	) {
		const [p1, p2] = arguments;
		this.beginPath();
		this.moveTo(p1.x, p1.y);
		this.lineTo(p2.x, p2.y);
		this.stroke();
	}
});

class Grid {
	constructor() {
		this.rows = [];
		if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [width, height, defaultValue] = arguments;
			this.rows = new Array(height).fill().map(row => new Array(width).fill(defaultValue));
		}
		else if(Array.isArray(arguments[0]) && arguments[0].every(row => row.length === arguments[0][0].length)) {
			const [rows] = arguments;
			this.rows = rows;
		}
		else if(typeof arguments[0] === "string") {
			const [multilineString] = arguments;
			const lines = multilineString.split("\n");
			this.rows = lines.map(row => [...row]);
		}
		else {
			throw new Error("Invalid usage.");
		}
	}

	get() {
		if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [x, y] = arguments;
			return this.rows[y][x];
		}
		else if((typeof arguments[0] === "object" && arguments[0] != null) && typeof arguments[0].x === "number" && typeof arguments[0].y === "number") {
			const [position] = arguments;
			return this.rows[position.y][position.x];
		}
		else {
			throw new Error("Invalid usage.");
		}
	}
	set() {
		if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [x, y, value] = arguments;
			this.rows[y][x] = value;
		}
		else if((typeof arguments[0] === "object" && arguments[0] != null) && typeof arguments[0].x === "number" && typeof arguments[0].y === "number") {
			const [position, value] = arguments;
			this.rows[position.y][position.x] = value;
		}
		else {
			throw new Error("Invalid usage.");
		}
	}

	width() {
		return Math.max(...this.rows.map(r => r.length));
	}
	height() {
		return this.rows.length;
	}

	rotate(angle = 90) {
		while(angle < 0) { angle += 360; }
		while(angle >= 360) { angle -= 360; }
		if(angle === 0) {
			return this;
		}
		else if(angle === 90) {
			const result = new Grid(this.height(), this.width());
			this.forEach((value, x, y) => {
				const rotatedX = result.width() - y - 1;
				const rotatedY = x;
				result.rows[rotatedY][rotatedX] = value;
			});
			return result;
		}
		else if(angle === 180) {
			const result = new Grid(this.width(), this.height());
			this.forEach((value, x, y) => {
				const rotatedX = result.width() - x - 1;
				const rotatedY = result.height() - y - 1;
				result.rows[rotatedY][rotatedX] = value;
			});
			return result;
		}
		else if(angle === 270) {
			const result = new Grid(this.height(), this.width());
			this.forEach((value, x, y) => {
				const rotatedX = y;
				const rotatedY = result.height() - x - 1;
				result.rows[rotatedY][rotatedX] = value;
			});
			return result;
		}
		else {
			throw new Error("When rotating grids, angle must be a multiple of 90 degrees.");
		}
	}
	columns() {
		const columns = [];
		for(let x = 0; x < this.width(); x ++) {
			columns.push([]);
			for(let y = 0; y < this.height(); y ++) {
				const value = this.get(x, y);
				columns[columns.length - 1].push(value);
			}
		}
		return columns;
	}

	containsGrid(grid) {
		for(let gridX = 0; gridX <= this.width() - grid.width(); gridX ++) {
			loop2: for(let gridY = 0; gridY <= this.height() - grid.height(); gridY ++) {
				for(let x = 0; x < grid.width(); x ++) {
					for(let y = 0; y < grid.height(); y ++) {
						if(this.get(gridX + x, gridY + y) !== grid.get(x, y)) {
							continue loop2;
						}
					}
				}
				return true;
			}
		}
		return false;
	}

	removeRow(rowIndex) {
		const newRows = this.rows.map(row => row.map(v => v));
		newRows.splice(rowIndex, 1);
		return new Grid(newRows);
	}
	removeColumn(columnIndex) {
		const newRows = this.rows.map(row => row.map(v => v));
		newRows.forEach(row => {
			row.splice(columnIndex, 1);
		});
		return new Grid(newRows);
	}

	forEach(callback) {
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				callback(value, x, y, this);
			}
		}
	}
	some(callback) {
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) { return true; }
			}
		}
		return false;
	}
	every(callback) {
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(!callback(value, x, y, this)) { return false; }
			}
		}
		return true;
	}
	find(callback) {
		/* returns the first (when searching left-to-right, then top-down) object that meets the criteria. */
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) {
					return value;
				}
			}
		}
		return undefined;
	}
	findPosition(callback) {
		/* returns the position of the first (when searching left-to-right, then top-down) object that meets the criteria. */
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) {
					return window.Vector ? new Vector(x, y) : { x: x, y: y };
				}
			}
		}
		return undefined;
	}
	findPositions(callback) {
		/* returns the positions of all elements that satisfy the provided criteria. */
		const positions = [];
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) {
					positions.push(window.Vector ? new Vector(x, y) : { x: x, y: y });
				}
			}
		}
		return positions;
	}
	includes(object) {
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(value === object) { return true; }
			}
		}
		return false;
	}
	map(callback) {
		const result = new Grid(this.width(), this.height());
		this.forEach((value, x, y) => {
			result.set(x, y, callback(value, x, y));
		});
		return result;
	}
}

class Tree {
	static *iterate(root, getChildren, leavesOnly, algorithm = "dfs") {
		const GeneratorFunction = (function*() {}).constructor;
		if(!(getChildren instanceof GeneratorFunction)) {
			const generatorFunc = function*(value) {
				for(const nextChild of getChildren(value)) { yield nextChild; }
			};
			for(const value of Tree.iterate(root, generatorFunc, leavesOnly, algorithm)) {
				yield value;
			}
			return;
		}
		if(algorithm === "dfs") {
			const stack = [];
			stack.push({
				value: root,
				generator: getChildren(root),
				numChildren: 0
			});
			if(!leavesOnly) { yield root; }
			while(stack.length !== 0) {
				const lastItem = stack[stack.length - 1];
				const next = lastItem.generator.next();
				if(next.done) {
					if(leavesOnly && lastItem.numChildren === 0) {
						yield lastItem.value;
					}
					stack.pop();
					continue;
				}
				lastItem.numChildren ++;
				const value = next.value;
				stack.push({
					value: value,
					generator: getChildren(value),
					numChildren: 0
				});
				if(!leavesOnly) { yield value; }
			}
		}
		else {
			let currentLevel = [root];
			let nextLevel = [];
			while(currentLevel.length !== 0) {
				for(const value of currentLevel) {
					let hasChildren = false;
					for(const child of getChildren(value)) {
						hasChildren = true;
						nextLevel.push(child);
					}
					if(!hasChildren || !leavesOnly) {
						yield value;
					}
				}
				currentLevel = nextLevel;
				nextLevel = [];
			}
		}
	}

	constructor(root, getChildren) {

	}
}

class Sequence {
	constructor(func, properties = {}) {
		const GeneratorFunction = Object.getPrototypeOf(function*() {}).constructor;
		const isGeneratorFunc = (func instanceof GeneratorFunction);
		const self = this;
		if(isGeneratorFunc) {
			this.generatorFunction = func;
		}
		else {
			this.nthTerm = (termIndex) => {
				const term = func(termIndex);
				this.cachedTerms[termIndex] = term;
				return term;
			};
			this.generatorFunction = function*() {
				for(let index = 0; index < Infinity; index ++) {
					const term = func(index);
					self.cachedTerms[index] = term;
					yield term;
				}
			};
		}
		this.generator = this.generatorFunction();
		this[Symbol.iterator] = function*() {
			for(let index = 0; index < Infinity; index ++) {
				if(index < this.numCachedTerms) {
					yield this.cachedTerms[index];
				}
				else {
					const term = this.generator.next().value;
					this.cachedTerms[index] = term;
					this.numCachedTerms ++;
					yield term;
				}
			}
		};
		this.cachedTerms = [];
		this.numCachedTerms = 0;

		this.isMonotonic = properties.isMonotonic ?? null;
	}

	nthTerm(termIndex) {
		/* returns the term at the given zero-based index. */
		if(typeof this.cachedTerms[termIndex] === "number") {
			return this.cachedTerms[termIndex];
		}
		if(this.hasOwnProperty("nthTerm")) {
			return this.nthTerm(termIndex);
		}

		for(let i = this.numCachedTerms; i <= termIndex; i ++) {
			this.cachedTerms[i] = this.generator.next().value;
		}
		this.numCachedTerms = termIndex + 1;
		return this.cachedTerms[termIndex];
	}
	nextTerm(term) {
		return this.nthTerm(this.indexOf(term) + 1);
	}
	indexOf(searchTarget) {
		/*
		returns the index of the first occurence, or -1 if it is not present.
		Note that this will loop infinitely if searching for a nonexistent item in a non-monotonic sequence.
		*/
		if(this.isMonotonic) {
			const isIncreasing = this.nthTerm(1) > this.nthTerm(0);
			let index = 0;
			for(const term of this) {
				if(
					(term > searchTarget && isIncreasing) ||
					(term < searchTarget && !isIncreasing)
				) {
					return -1;
				}
				if(term === searchTarget) { return index; }
				index ++;
			}
		}
		else {
			let index = 0;
			for(const term of this) {
				if(term === searchTarget) { return index; }
				index ++;
			}
		}
	}
	find(callback) {
		for(const [term, index] of this.entries()) {
			if(callback(term, index, this)) {
				return term;
			}
		}
	}
	filter(callback) {
		const originalSequence = this;
		return new Sequence(
			function*() {
				let iterations = 0;
				for(const value of originalSequence) {
					if(callback(value, iterations, originalSequence)) {
						yield value;
					}
					iterations ++;
				}
			}
		);
	}
	map(callback) {
		const originalSequence = this;
		return new Sequence(
			function*() {
				let iterations = 0;
				for(const value of originalSequence) {
					yield callback(value, iterations, originalSequence);
					iterations ++;
				}
			}
		);
	}

	static union(...sequences) {
		for(const s of sequences) {
			if(!s.isMonotonic) {
				throw new Error("Cannot calculuate a union of non-monotonic sequences.");
			}
		}
		let increasing = sequences[0].isIncreasing();
		for(const s of sequences) {
			if(s.isIncreasing() !== increasing) {
				throw new Error("Sequences must be either all increasing or all decreasing.");
			}
		}

		return new Sequence(
			function*() {
				let generators = sequences.map(s => s[Symbol.iterator]());
				let values = generators.map(s => s.next().value);
				while(true) {
					const nextVal = increasing ? values.min() : values.max();
					yield nextVal;
					values.forEach((val, i) => {
						while(values[i] === nextVal) {
							values[i] = generators[i].next().value;
						}
					});
				}
			},
			{ isMonotonic: true }
		);
	}

	isIncreasing() {
		if(this.isMonotonic == null) { return null; }
		if(!this.isMonotonic) { return false; }
		let firstTerm = null;
		for(const term of this) {
			firstTerm ??= term;
			if(term !== firstTerm) {
				this.isIncreasing = () => term > firstTerm;
				return term > firstTerm;
			}
		}
	}
	isDecreasing() {
		if(this.isMonotonic == null) { return null; }
		return !this.isIncreasing();
	}

	slice(minIndex, maxIndex = Infinity) {
		/*
		Returns an array if `minIndex` and `maxIndex` are provided, and a Sequence if `maxIndex` is not provided.
		`minIndex` is inclusive, and `maxIndex` is exclusive.
		*/
		if(maxIndex === Infinity) {
			if(this.hasOwnProperty("nthTerm")) {
				return new Sequence(
					index => this.nthTerm(index + minIndex),
					{ isMonotonic: this.isMonotonic }
				);
			}
			else {
				const originalSequence = this;
				return new Sequence(
					function*() {
						let iterations = 0;
						for(const number of originalSequence) {
							if(iterations >= minIndex) { yield number; }
							iterations ++;
						}
					},
					{ isMonotonic: this.isMonotonic }
				);
			}
		}
		else {
			if(this.hasOwnProperty("nthTerm")) {
				const terms = [];
				for(let i = minIndex; i < maxIndex; i ++) {
					if(typeof this.cachedTerms[i] === "number") {
						terms.push(this.cachedTerms[i]);
					}
					else {
						terms.push(this.nthTerm(i));
					}
				}
				return terms;
			}
			else {
				if(minIndex === maxIndex) { return []; }
				const terms = [];
				let iterations = 0;
				for(const term of this) {
					if(iterations >= minIndex) {
						terms.push(term);
					}
					iterations ++;
					if(iterations >= maxIndex) { break; }
				}
				return terms;
			}
		}
	}
	termsBelow(maximum, inclusive) {
		if(!this.isIncreasing()) {
			throw new Error("Cannot calculate the terms below a maximum for a non-increasing sequence.");
		}
		let terms = [];
		for(const term of this) {
			if(term > maximum || (term >= maximum && !inclusive)) {
				return terms;
			}
			terms.push(term);
		}
	}
	*entries() {
		let index = 0;
		for(const term of this) {
			yield [term, index];
			index ++;
		}
	}

	static POSITIVE_INTEGERS = new Sequence(
		function*() {
			for(let i = 1; i < Infinity; i ++) {
				yield i;
			}
		},
		{ isMonotonic: true }
	);
	static INTEGERS = new Sequence(
		function*() {
			yield 0;
			for(let i = 1; i < Infinity; i ++) {
				yield i;
				yield -i;
			}
		},
		{ isMonotonic: false }
	);
	static PRIMES = new Sequence(
		function*() {
			const factorsMap = new Map();
			for(let possiblePrime = 2; possiblePrime < Infinity; possiblePrime ++) {
				const factors = factorsMap.get(possiblePrime) ?? [];
				if(factors.length === 0) {
					yield possiblePrime;
					factorsMap.set(possiblePrime ** 2, [possiblePrime]);
				}
				else {
					for(const factor of factors) {
						const nextNumber = possiblePrime + factor;
						if(!factorsMap.has(nextNumber)) {
							factorsMap.set(nextNumber, []);
						}
						factorsMap.get(nextNumber).push(factor);
					}
					factorsMap.delete(possiblePrime);
				}
			}
		},
		{ isMonotonic: true }
	);
	static powersOf(num) {
		return new Sequence(
			index => num ** index,
			{ isMonotonic: num >= 0 }
		);
	}
	static fibonacci(start1 = 1, start2 = 1) {
		return new Sequence(
			function*() {
				yield start1;
				yield start2;
				let v1 = start1, v2 = start2;
				while(true) {
					const next = v1 + v2;
					yield next;
					v1 = v2, v2 = next;
				}
			}
		)
	}
}

class Graph {
	constructor() {
		if(arguments.length === 0) {
			this.nodes = new Map();
		}
		else if(
			Array.isArray(arguments[0]) &&
			arguments[0].every(Array.isArray) &&
			arguments[0].every(a => a.length === 2)
		) {
			const [nodes] = arguments;
			this.nodes = new Map();
			for(const [value] of nodes) {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot create Graph: input nodes contain duplicate value '${value}'.`);
				}
				this.nodes.set(value, { value });
			}
			for(const [value, connections] of nodes) {
				for(const connection of connections) {
					if(!this.nodes.has(connection)) {
						throw new Error(`Cannot connect '${value}' to '${connection}' as '${connection}' is not in the graph.`);
					}
					if(!nodes.find(v => v[0] === connection)[1].includes(value)) {
						throw new Error(`Nodes must be connected symmetrically: cannot connect '${value}' to '${connection}' without also connecting '${connection}' to '${value}'.`);
					}
				}
				this.nodes.get(value).connections = new Set(connections.map(c => this.nodes.get(c)));
			}
		}
		else if(Array.isArray(arguments[0])) {
			const [values] = arguments;
			this.nodes = new Map();
			for(const value of values) {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot create Graph: input nodes contain duplicate value '${value}'.`);
				}
				const node = { value: value, connections: new Set() };
				this.nodes.set(value, node);
			}
		}
		else if(arguments[0] instanceof Graph) {
			const [graph] = arguments;
			this.nodes = new Map();
			for(const value of graph.values()) {
				this.add(value);
			}
			for(const [value, node] of graph.nodes) {
				for(const connectedNode of node.connections) {
					this.connect(value, connectedNode.value);
				}
			}
		}
		else if(arguments[0] instanceof Grid) {
			const [grid] = arguments;
			this.nodes = new Map();
			grid.forEach(value => {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot construct a graph from a grid containing duplicate values.`);
				}
				this.nodes.set(value, { value: value, connections: new Set() });
			});
			grid.forEach((value, x, y) => {
				if(x !== 0) {
					this.connect(value, grid.get(x - 1, y));
				}
				if(x !== grid.width() - 1) {
					this.connect(value, grid.get(x + 1, y));
				}
				if(y !== 0) {
					this.connect(value, grid.get(x, y - 1));
				}
				if(y !== grid.height() - 1) {
					this.connect(value, grid.get(x, y + 1));
				}
			});
		}
	}
	*[Symbol.iterator]() {
		for(const node of this.nodes.values()) {
			yield node.value;
		}
	}

	has(value) {
		return this.nodes.has(value);
	}
	add(value) {
		if(!this.nodes.has(value)) {
			const node = { value: value, connections: new Set() };
			this.nodes.set(value, node);
		}
	}
	remove(value) {
		if(this.nodes.has(value)) {
			const node = this.nodes.get(value);
			for(const connectedNode of node.connections) {
				connectedNode.connections.delete(node);
			}
			this.nodes.delete(value);
		}
	}
	areConnected(value1, value2) {
		if(!this.nodes.has(value1)) {
			throw new Error(`Expected the graph to contain '${value1}.'`);
		}
		if(!this.nodes.has(value2)) {
			throw new Error(`Expected the graph to contain '${value2}.'`);
		}
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		return node1.connections.has(node2);
	}
	connect(value1, value2) {
		if(!this.nodes.has(value1)) {
			throw new Error(`Expected the graph to contain '${value1}.'`);
		}
		if(!this.nodes.has(value2)) {
			throw new Error(`Expected the graph to contain '${value2}.'`);
		}
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		node1.connections.add(node2);
		node2.connections.add(node1);
	}
	disconnect(value1, value2) {
		if(!this.nodes.has(value1)) {
			throw new Error(`Expected the graph to contain '${value1}.'`);
		}
		if(!this.nodes.has(value2)) {
			throw new Error(`Expected the graph to contain '${value2}.'`);
		}
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		node1.connections.delete(node2);
		node2.connections.delete(node1);
	}

	size() {
		return this.nodes.size;
	}
	values() {
		return [...this.nodes.values()].map(node => node.value);
	}
	connections() {
		const result = [];
		for(const node of this.nodes.values()) {
			for(const connection of node.connections) {
				if(!result.some(c => (
					(c[0] === node.value && c[1] === connection.value)) ||
					(c[1] === node.value && c[0] === connection.value)
				)) { result.push([node.value, connection.value]); }
			}
		}
		return result;
	}

	setConnection(value1, value2, connected) {
		if(connected) {
			this.connect(value1, value2);
		}
		else {
			this.disconnect(value1, value2);
		}
	}
	setConnections(callback) {
		const pairsChecked = new Set();
		for(const [value1] of this.nodes) {
			for(const [value2] of this.nodes) {
				if(!pairsChecked.some(([v1, v2]) => value1 === v1 && value2 === v2)) {
					this.setConnection(value1, value2, callback(value1, value2, this));
					pairsChecked.add([value2, value1]);
				}
			}
		}
	}
	toggleConnection(value1, value2) {
		if(this.areConnected(value1, value2)) {
			this.disconnect(value1, value2);
		}
		else {
			this.connect(value1, value2);
		}
	}
}

class DirectedGraph {
	constructor() {
		if(arguments.length === 0) {
			this.nodes = new Map();
		}
		else if(
			Array.isArray(arguments[0]) &&
			arguments[0].every(Array.isArray) &&
			arguments[0].every(a => a.length === 2)
		) {
			const [nodes] = arguments;
			this.nodes = new Map();
			for(const [value] of nodes) {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot create Graph: input nodes contain duplicate value '${value}'.`);
				}
				this.nodes.set(value, { value, nodesBefore: new Set(), nodesAfter: new Set() });
			}
			for(const [value, connections] of nodes) {
				this.nodes.get(value).nodesAfter = new Set(connections.map(c => this.nodes.get(c)));
				for(const connection of connections) {
					if(!this.nodes.has(connection)) {
						throw new Error(`Cannot connect '${value}' to '${connection}' as '${connection}' is not in the graph.`);
					}
					const node = this.nodes.get(connection);
					node.nodesBefore.add(this.nodes.get(value));
				}
			}
		}
		else if(Array.isArray(arguments[0])) {
			const [values] = arguments;
			this.nodes = new Map();
			for(const value of values) {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot create Graph: input nodes contain duplicate value '${value}'.`);
				}
				const node = { value: value, nodesBefore: new Set(), nodesAfter: new Set() };
				this.nodes.set(value, node);
			}
		}
		else if(arguments[0] instanceof Graph) {
			const [graph] = arguments;
			this.nodes = new Map();
			for(const value of graph.values()) {
				this.add(value);
			}
			for(const [value, node] of graph.nodes) {
				for(const connectedNode of node.connections) {
					this.connect(value, connectedNode.value);
				}
			}
		}
		else if(arguments[0] instanceof DirectedGraph) {
			const [graph] = arguments;
			this.nodes = new Map();
			for(const value of graph.values()) {
				this.add(value);
			}
			for(const [value, node] of graph.nodes) {
				for(const connected of node.nodesAfter) {
					this.nodes.get(value).nodesAfter.add(this.nodes.get(connected.value));
				}
				for(const connected of node.nodesBefore) {
					this.nodes.get(value).nodesBefore.add(this.nodes.get(connected.value));
				}
			}
		}
		else if(arguments[0] instanceof Grid) {
			const [grid] = arguments;
			this.nodes = new Map();
			grid.forEach(value => {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot construct a graph from a grid containing duplicate values.`);
				}
				this.nodes.set(value, { value: value, nodesBefore: new Set(), nodesAfter: new Set() });
			});
			grid.forEach((value, x, y) => {
				if(x !== 0) {
					this.connect(value, grid.get(x - 1, y));
				}
				if(x !== grid.width() - 1) {
					this.connect(value, grid.get(x + 1, y));
				}
				if(y !== 0) {
					this.connect(value, grid.get(x, y - 1));
				}
				if(y !== grid.height() - 1) {
					this.connect(value, grid.get(x, y + 1));
				}
			});
		}
	}
	*[Symbol.iterator]() {
		for(const node of this.nodes.values()) {
			yield node.value;
		}
	}

	size() { return this.nodes.size; }
	values() {
		return [...this.nodes.values()].map(node => node.value);
	}
	connections() {
		const result = [];
		for(const node of this.nodes.values()) {
			for(const connection of node.nodesAfter) {
				result.push([node.value, connection.value]);
			}
		}
		return result;
	}

	has(value) {
		return this.nodes.has(value);
	}
	add(value) {
		if(!this.nodes.has(value)) {
			const node = { value: value, nodesBefore: new Set(), nodesAfter: new Set() };
			this.nodes.set(value, node);
		}
	}
	remove(value) {
		if(this.nodes.has(value)) {
			const node = this.nodes.get(value);
			for(const connectedNode of node.nodesBefore) {
				connectedNode.nodesAfter.delete(node);
			}
			for(const connectedNode of node.nodesAfter) {
				connectedNode.nodesBefore.delete(node);
			}
			this.nodes.delete(value);
		}
	}
	areConnected(value1, value2) {
		if(!this.nodes.has(value1)) {
			throw new Error(`Expected the graph to contain '${value1}.'`);
		}
		if(!this.nodes.has(value2)) {
			throw new Error(`Expected the graph to contain '${value2}.'`);
		}
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		return node1.nodesAfter.has(node2);
	}
	connect(value1, value2) {
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		node1.nodesAfter.add(node2);
		node2.nodesBefore.add(node1);
	}
	disconnect(value1, value2) {
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		node1.nodesAfter.delete(node2);
		node2.nodesBefore.delete(node1);
	}

	setConnection(value1, value2, connected) {
		if(connected) {
			this.connect(value1, value2);
		}
		else {
			this.disconnect(value1, value2);
		}
	}
	setConnections(callback) {
		for(const node1 of this.nodes.values()) {
			for(const node2 of this.nodes.values()) {
				this.setConnection(
					node1.value,
					node2.value,
					callback(node1.value, node2.value, this)
				);
			}
		}
	}
	toggleConnection(value1, value2) {
		if(this.areConnected(value1, value2)) {
			this.disconnect(value1, value2);
		}
		else {
			this.connect(value1, value2);
		}
	}

	paths(starts, ends, length) {
		let paths = starts.map(startValue => [startValue]);
		for(let i = 0; i < length; i ++) {
			const newPaths = [];
			for(const path of paths) {
				const lastStep = path[path.length - 1];
				const node = this.nodes.get(lastStep);
				for(const connection of node.nodesAfter) {
					newPaths.push([...path, connection.value]);
				}
			}
			paths = newPaths;
			if(paths.length === 0) { return new Set(); }
		}
		return new Set(paths.filter(p => ends.includes(p[p.length - 1])));
	}
	pathExists(starts, ends, length) {
		let reachables = new Set(starts.map(s => this.nodes.get(s)));
		const nodes = [...this.nodes.values()];
		nodes.forEach((node, index) => {
			// assign each node an ID (this will be deleted when the algorithm finishes)
			node.id = index;
		});
		const pastStates = new Map();
		for(let i = 0; i < length; i ++) {
			if(reachables.size === 0) { return false; }
			const newReachables = new Set();
			for(const reachable of reachables) {
				for(const newReachable of reachable.nodesAfter) {
					newReachables.add(newReachable);
				}
			}
			reachables = newReachables;
			const stateString = [...reachables].map(n => n.id).sort((a, b) => a - b).join(",");
			if(pastStates.has(stateString)) {
				const lastTime = pastStates.get(stateString);
				i += (i - lastTime) * Math.floor((length - i) / (i - lastTime));
			}
			pastStates.set(stateString, i);
		}
		for(const node of nodes) { delete node.id; }
		const reachableValues = reachables.map(r => r.value);
		return ends.some(e => reachableValues.has(e));
	}
	numPaths(starts, ends, length) {
		starts = new Set(starts);
		ends = [...ends];
		let paths = new Map();
		for(const [_, node] of this.nodes) {
			paths.set(node, starts.has(node.value) ? 1 : 0);
		}
		for(let i = 0; i < length; i ++) {
			const newPaths = new Map();
			for(const [node, numPaths] of paths) {
				for(const connectedNode of node.nodesAfter) {
					if(!newPaths.has(connectedNode)) {
						newPaths.set(connectedNode, numPaths);
					}
					else {
						newPaths.set(connectedNode, newPaths.get(connectedNode) + numPaths);
					}
				}
			}
			paths = newPaths;
		}
		return ends.sum(e => paths.get(this.nodes.get(e)));
	}
}

class Vector {
	constructor() {
		if(!arguments.length) {
			this.x = 0;
			this.y = 0;
		}
		else if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [x, y] = arguments;
			this.x = x;
			this.y = y;
		}
		else if(typeof arguments[0].x === "number" && typeof arguments[0].y === "number") {
			const [{ x, y }] = arguments;
			this.x = x;
			this.y = y;
		}
		else if(typeof arguments[0].angle === "number" && typeof arguments[0].magnitude === "number") {
			const TO_RADIANS = Math.PI / 180;
			const [{ angle, magnitude }] = arguments;
			this.x = magnitude * Math.cos(angle * TO_RADIANS);
			this.y = magnitude * -Math.sin(angle * TO_RADIANS);
		}
		else if(typeof arguments[0][0] === "number" && typeof arguments[0][1] === "number") {
			const [[x, y]] = arguments;
			this.x = x;
			this.y = y;
		}
		else if(typeof arguments[0] === "string") {
			const [string] = arguments;
			if(string === "left") { this.x = -1, this.y = 0; }
			else if(string === "right") { this.x = 1, this.y = 0; }
			else if(string === "up") { this.x = 0, this.y = -1; }
			else if(string === "down") { this.x = 0, this.y = 1; }
			else {
				const PARSER = /^\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)$/;
				if(!PARSER.test(string)) {
					throw new Error("Cannot parse Vector; invalid format.");
				}
				const [str, num1, num2] = string.match(PARSER);
				this.x = Number.parseFloat(num1);
				this.y = Number.parseFloat(num2);
			}
		}
	}

	toString() {
		return `(${this.x}, ${this.y})`;
	}

	get angle() {
		/* angles are in degrees, counterclockwise from the positive x-axis, where positive y = down and positive x = right. */
		const TO_DEGREES = 180 / Math.PI;
		return Math.atan2(-this.y, this.x) * TO_DEGREES;
	}
	set angle(newAngle) {
		const TO_RADIANS = Math.PI / 180;
		const magnitude = this.magnitude;
		this.x = magnitude * Math.cos(TO_RADIANS * newAngle);
		this.y = magnitude * -Math.sin(TO_RADIANS * newAngle);
	}
	get magnitude() {
		return Math.sqrt((this.x ** 2) + (this.y ** 2));
	}
	set magnitude(newMagnitude) {
		const multiplier = newMagnitude / this.magnitude;
		this.x *= multiplier;
		this.y *= multiplier;
	}

	add() {
		if(arguments[0] instanceof Vector) {
			const [vector] = arguments;
			return new Vector(this.x + vector.x, this.y + vector.y);
		}
		else {
			const vector = new Vector(...arguments);
			return new Vector(this.x + vector.x, this.y + vector.y);
		}
	}
	subtract() {
		if(arguments[0] instanceof Vector) {
			const [vector] = arguments;
			return new Vector(this.x - vector.x, this.y - vector.y);
		}
		else {
			const vector = new Vector(...arguments);
			return new Vector(this.x - vector.x, this.y - vector.y);
		}
	}
	multiply(multiplier) {
		const result = new Vector(this);
		result.x *= multiplier;
		result.y *= multiplier;
		return result;
	}
	divide(divisor) {
		const result = new Vector(this);
		result.x /= divisor;
		result.y /= divisor;
		return result;
	}

	dotProduct(vector) {
		return (this.x * vector.x) + (this.y * vector.y);
	}

	normalize() {
		const result = new Vector(this);
		result.magnitude = 1;
		return result;
	}
	projection(vector) {
		const magnitude = this.dotProduct(vector.normalize());
		return vector.normalize().multiply(magnitude);
	}
	scalarProjection(vector) {
		return this.dotProduct(vector.normalize());
	}

	rotateAbout() {
		if(arguments[0] instanceof Vector && typeof arguments[1] === "number") {
			const [point, angle] = arguments;
			let result = new Vector(this);
			result = result.subtract(point);
			result.angle += angle;
			result = result.add(point);
			return result;
		}
		else if([...arguments].every(v => typeof v === "number")) {
			const [x, y, angle] = arguments;
			return this.rotateAbout(new Vector(x, y), angle);
		}
	}

	distanceFrom() {
		if(arguments[0] instanceof Vector) {
			const [vector] = arguments;
			return this.subtract(vector).magnitude;
		}
		else {
			return this.subtract(new Vector(...arguments)).magnitude;
		}
	}
}

window.utils ??= {};
utils.createElement = (elementString) => {
	const TOKENIZE = /(?:\.|#|)\w+/g;
	const tokens = elementString.match(TOKENIZE);
	const element = document.createElement(tokens.find(t => t[0] !== "#" && t[0] !== "."));
	for(const token of tokens) {
		if(token.startsWith(".")) {
			element.classList.add(token.slice(1));
		}
		else if(token.startsWith("#")) {
			element.id = token.slice(1);
		}
	}
	return element;
};

class CanvasIO {
	constructor(canvasID = "", canvasType = "fill-parent", parentElement = document.body) {
		this.canvas = document.createElement("canvas");
		this.canvas.id = canvasID;
		this.ctx = this.canvas.getContext("2d");
		this.canvasType = canvasType;
		this.parentElement = parentElement;

		this.keys = {};
		this.mouse = new Vector();
	}

	activate() {
		if(this.canvasType === "fill-parent") {
			/* add the canvas to fill its parent element, and update the internal width / height of the canvas so that 1 canvas pixel = 1 on-screen pixel*/
			this.parentElement.appendChild(this.canvas);
			this.canvas.style.width = "100%";
			this.canvas.style.height = "100%";
			if(this.parentElement === document.body) {
				this.parentElement.style.margin = "0px";
				this.parentElement.style.overflow = "hidden";

				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
				window.addEventListener("resize", () => {
					this.canvas.width = window.innerWidth;
					this.canvas.height = window.innerHeight;
				});
			}
		}

		this.parentElement.addEventListener("keydown", (event) => {
			this.keys[event.code] = true;
		});
		this.parentElement.addEventListener("keyup", (event) => {
			this.keys[event.code] = false;
		});
		this.canvas.addEventListener("mousedown", (event) => {
			this.mouse.pressed = true;
			this.mouse.button = (event.which === 3) ? "right" : "left";
		});
		this.canvas.addEventListener("mouseup", (event) => {
			this.mouse.pressed = false;
			this.mouse.button = null;
		});
		this.canvas.addEventListener("mousemove", (event) => {
			const canvasRect = this.canvas.getBoundingClientRect();
			this.mouse.x = (event.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * this.canvas.width
			this.mouse.y = (event.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * this.canvas.height;
		});
		this.canvas.addEventListener("contextmenu", (event) => {
			event.preventDefault();
		});
	}
}

window.utils ??= {};
utils.binarySearch = (min, max, callback, whichOne = "first") => {
	if(typeof min === "bigint" || typeof max === "bigint") {
		min = BigInt(min); max = BigInt(max);
	}
	while(max - min > 1) {
		const mid = (typeof min === "bigint") ? (min + max) / 2n : Math.floor((min + max) / 2);
		const result = callback(mid);
		if(result < 0) {
			/* guess was too low */
			min = mid;
		}
		else if(result > 0) {
			/* guess was too high */
			max = mid;
		}
		else {
			if(whichOne === "first") { max = mid; }
			else if(whichOne === "last") { min = mid; }
			else { min = max = mid; break; }
		}
	}
	if(BigInt(max) === BigInt(min) + 1n) {
		if(BigInt(callback(min)) === 0n && BigInt(callback(max)) !== 0n) {
			return min;
		}
		if(BigInt(callback(min)) !== 0n && BigInt(callback(max)) === 0n) {
			return max;
		}
		return whichOne === "first" ? min : max;
	}
	/* min === max */
	return min;
};
utils.toString = (obj, maxLength = Infinity) => {
	/*
	This method converts objects to strings, with some special cases:
	- Arrays:
		- By default, return the elements (with a recursive call to utils.toString), surrounded by brackets and separated by commas / spaces
		- If too long, return the element's types (e.g. "[object ObjectType]"), but only when that shortens the string for that object
		- If still too long, return "[object Array]" if "[object Array]" is shorter than the others; otherwise, return the shortest of the first 2 forms.
	- Sets: same as arrays, but with curly braces instead of square braces.
	- Strings: return the string WITH QUOTES, or "[object String]" if too long and "[object String]" is shorter
	- Other objects: call default toString; return "[object ObjectType]" if default is too long and if "[object ObjectType]" is shorter
	*/
	if(obj === undefined || obj === null) {
		return `${obj}`;
	}
	else if(obj instanceof Array || obj instanceof Set) {
		const result = [...obj].map(v => utils.toString(v)).join(", ");
		if(result.length + 2 <= maxLength) {
			return obj instanceof Array ? `[${result}]` : `{${result}}`;
		}
		else {
			const shorterResult = [...obj].map(v => {
				const string1 = utils.toString(v);
				const string2 = (v == null) ? `${v}` : `[object ${v.constructor.name}]`;
				return string1.length <= string2.length ? string1 : string2;
			}).join(", ");
			if(shorterResult.length + 2 <= maxLength) {
				return obj instanceof Array ? `[${shorterResult}]` : `{${shorterResult}}`;
			}
			else {
				const shortestResult = `[object ${obj.constructor.name}]`;
				if(shortestResult.length < shorterResult.length) {
					return shortestResult;
				}
				else {
					return obj instanceof Array ? `[${shorterResult}]` : `{${shorterResult}}`;
				}
			}
		}
	}
	else if(typeof obj === "string") {
		const result = `"${obj}"`;
		if(result.length <= maxLength || result.length <= "[object String]".length) {
			return result;
		}
		else {
			return "[object String]";
		}
	}
	else {
		const result1 = `${obj}`;
		const result2 = `[object ${obj.constructor.name}]`;
		if(result1.length <= maxLength || result.length <= result2.length) {
			return result1;
		}
		else {
			return result2;
		}
	}
};
