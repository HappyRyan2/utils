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
			else {
				throw new Error("Invalid usage.");
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
		else if(typeof arguments[1] === "object" && Object.keys(arguments[1]).every(testName => typeof arguments[1][testName] === "function")) {
			const [unitName, tests] = arguments;
			this.unitName = unitName;
			this.tests = Object.entries(tests).map(([testName, functionToRun]) => new Test(functionToRun, testName));
		}
		else {
			throw new Error("Invalid usage.");
		}

		if(this.tests.length === 0) {
			console.warn(`Test unit ${this.name} created successfully but with no tests.`);
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
		},

		toMatch: function(regex) {
			testing.assert(
				regex.test(value),
				`Expected ${value} to match the regex ${regex}`
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

	testAll(fastOnly = false, debugFailed = true, output = console) {
		this.resetTests();

		const tests = fastOnly ? this.tests().filter(t => !t.isSlow && !this.units.find(u => u.unitName === t.unitName).isSlow) : this.tests();
		const startTime = Date.now();
		tests.forEach(test => {
			test.result = test.getResult();
		});
		const endTime = Date.now();
		if(tests.length !== this.tests().length) {
			output.warn(`Only running ${tests.length} of ${this.tests().length} tests.`);
		}

		const failed = this.testsFailed();
		const numFailed = failed.length;
		const time = endTime - startTime;
		if(numFailed === 0) {
			output.log(`%cAll tests passed%c in ${time}ms.`, "color: rgb(0, 192, 64)", "");
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
		if(debugFailed) {
			for(const test of failed) {
				testing.run(test);
			}
		}
	}
	testUnit(unitName, output = console) {
		this.resetTests();

		const unit = this.units.find(u => u.unitName === unitName);
		if(!unit) {
			throw new Error(`Cannot find unit ${unitName}`);
		}
		const tests = unit.tests;
		const startTime = Date.now();
		tests.forEach(test => {
			test.result = test.getResult();
		});
		const endTime = Date.now();

		const failed = this.testsFailed();
		const numFailed = failed.length;
		const time = endTime - startTime;
		if(numFailed === 0) {
			output.log(`%cAll tests passed%c in unit ${unitName} (${time}ms)`, "color: rgb(0, 192, 64)", "");
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
		const startTime = Date.now();
		test.functionToRun();
		const endTime = Date.now();

		const time = endTime - startTime;
		const text = `%cTest passed: %c${test.unitName} - ${test.name} (${time}ms)`;
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
			this.testAll(false, true, output);
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
