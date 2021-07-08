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
