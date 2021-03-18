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
	}
});
