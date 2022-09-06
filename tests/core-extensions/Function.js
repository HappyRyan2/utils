testing.addUnit("Function.memoize()", {
	"works for arguments that can be stringified": () => {
		let timesRun = 0;
		const increment = (num => {
			timesRun ++;
			return num + 1;
		}).memoize(true);

		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(timesRun).toEqual(1);

		expect(increment(2)).toEqual(3);
		expect(increment(2)).toEqual(3);
		expect(increment(2)).toEqual(3);
		expect(timesRun).toEqual(2);
	},
	"works for arguments that cannot be stringified without information loss": () => {
		let timesRun = 0;
		const myFunction = (argument => {
			timesRun ++;
			return argument.foo;
		}).memoize(false);
		let myObject1 = { foo: "bar" };
		let myObject2 = { foo: "qux" };

		expect(myFunction(myObject1)).toEqual("bar");
		expect(myFunction(myObject1)).toEqual("bar");
		expect(myFunction(myObject1)).toEqual("bar");
		expect(timesRun).toEqual(1);

		expect(myFunction(myObject2)).toEqual("qux");
		expect(myFunction(myObject2)).toEqual("qux");
		expect(myFunction(myObject2)).toEqual("qux");
		expect(timesRun).toEqual(2);
	},
	"can return a clone of the output": () => {
		let timesRun = 0;
		const myFunction = (argument => {
			timesRun ++;
			return [argument, argument + 1];
		}).memoize(true, true);

		const result1 = myFunction(1);
		expect(result1).toEqual([1, 2]);
		const result2 = myFunction(1);
		expect(result2).toEqual([1, 2]);
		const result3 = myFunction(1);
		expect(result2).toEqual([1, 2]);
		expect(timesRun).toEqual(1);
		expect(result1).toNotStrictlyEqual(result2);
		expect(result2).toNotStrictlyEqual(result3);
	},
	"sets the name to be myFunction (memoized)": () => {
		const myFunction = (argument) => { };
		const result = myFunction.memoize();
		expect(result.name).toEqual(`${myFunction.name} (memoized)`);
	},
	"can clear the caches of all memoized functions": () => {
		let timesRun = 0;
		const increment = (num => {
			timesRun ++;
			return num + 1;
		}).memoize(true);

		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(timesRun).toEqual(1);

		Function.prototype.memoize.clear();

		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(timesRun).toEqual(2);
	},
	"correctly records the number of times the function was called with/without distinct arguments when the function is stringifying keys": () => {
		const func = function() {};
		const memoized = func.memoize(false);
		const data = memoized.memoizationData;
		memoized(1);
		expect(data).toEqual({ numDistinctArgs: 1, timesCalled: 1 });
		memoized(2);
		memoized(2);
		memoized(2);
		expect(data).toEqual({ numDistinctArgs: 2, timesCalled: 4 });
	},
	"correctly records the number of times the function was called with/without distinct arguments when the function is not stringifying keys": () => {
		const func = function() {};
		const memoized = func.memoize(true);
		const data = memoized.memoizationData;
		memoized(1);
		expect(data).toEqual({ numDistinctArgs: 1, timesCalled: 1 });
		memoized(2);
		memoized(2);
		memoized(2);
		expect(data).toEqual({ numDistinctArgs: 2, timesCalled: 4 });
	},
	"throws an error when the stringified result is [object Object]": () => {
		const func = (() => {}).memoize(true);
		testing.assertThrows(() => func({}));
	}
});
