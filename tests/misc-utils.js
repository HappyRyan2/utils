testing.addUnit("utils.binarySearch()", {
	"works in the general case": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 3);
		const result = utils.binarySearch(0, 8, callback);
		expect(result).toEqual(5);
	},
	"can return the first value when there are multiple values": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 2);
		const result = utils.binarySearch(0, 8, callback, "first");
		expect(result).toEqual(2);
	},
	"can return the last value when there are multiple values": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 2);
		const result = utils.binarySearch(0, 8, callback, "last");
		expect(result).toEqual(4);
	},
	"can return the value before when there are no values for which the callback returns zero": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 6);
		const result = utils.binarySearch(0, 8, callback, "first");
		expect(result).toEqual(7);
	},
	"can return the value after when there are no values for which the callback returns zero": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 6);
		const result = utils.binarySearch(0, 8, callback, "last");
		expect(result).toEqual(8);
	},
	"works when the given min or max is a BigInt": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 3);
		const result = utils.binarySearch(0n, 8n, callback);
		expect(result).toEqual(5n);
	}
});
testing.addUnit("utils.toString()", {
	"can convert a string to a string with quotes": () => {
		const result = utils.toString(`hello`);
		expect(result).toEqual(`"hello"`);
	},
	"can convert a long string to '[object String]'": () => {
		const result = utils.toString("a very long string", 5);
		expect(result).toEqual("[object String]");
	},
	"can convert an Array to a string": () => {
		const result = utils.toString([1, 2, 3]);
		expect(result).toEqual(`[1, 2, 3]`);
	},
	"can convert a Set to a string": () => {
		const result = utils.toString(new Set([1, 2, 3]));
		expect(result).toEqual(`{1, 2, 3}`);
	},
	"can convert a recursive Array structure to a string": () => {
		const result = utils.toString([1, [2, 3], new Set(["a", "b"])]);
		expect(result).toEqual(`[1, [2, 3], {"a", "b"}]`);
	},
	"can create a shorter string representation of an Array": () => {
		const result = utils.toString([1, [2, 3, 4, 5, 6, 7, 8], 9], 25);
		expect(result).toEqual("[1, [object Array], 9]");
	},
	"can create a much shorter string representation of an Array": () => {
		const result = utils.toString([1, [2, 3, 4, 5, 6, 7, 8], 9], 10);
		expect(result).toEqual("[object Array]");
	},
	"can create a shorter string representation of a Set": () => {
		const obj = new Set([1, new Set([2, 3, 4, 5, 6, 7, 8]), 9]);
		const result = utils.toString(obj, 25);
		expect(result).toEqual("{1, [object Set], 9}");
	},
	"can create a much shorter string representation of a Set": () => {
		const obj = new Set([1, new Set([2, 3, 4, 5, 6, 7, 8]), 9]);
		const result = utils.toString(obj, 10);
		expect(result).toEqual("[object Set]");
	},
	"can convert undefined to a string": () => {
		const result = utils.toString(undefined);
		expect(result).toEqual("undefined");
	},
	"can convert null to a string": () => {
		const result = utils.toString(null);
		expect(result).toEqual("null");
	},
	"can convert an Array containing null and undefined to a string": () => {
		const result = utils.toString([null, undefined, null], 5);
		expect(result).toEqual("[object Array]");
	}
});
