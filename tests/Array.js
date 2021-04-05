testing.addUnit("Array.repeat()", [
	() => {
		const result = [1, 2].repeat(3);
		expect(result).toEqual([1, 2, 1, 2, 1, 2]);
	}
]);
testing.addUnit("Array.partitions()", [
	() => {
		const result = [1].partitions();
		expect(result).toEqual(new Set([
			[[1]]
		]));
	},
	() => {
		const result = [1, 2, 3].partitions();
		expect(result).toEqual(new Set([
			[[1, 2, 3]],
			[[1, 2], [3]],
			[[1], [2, 3]],
			[[1], [2], [3]]
		]));
	}
]);
testing.addUnit("Array.sum()", {
	"basic usage": () => {
		const result = [1, 2, 3, 4].sum();
		expect(result).toEqual(1 + 2 + 3 + 4);
	},
	"works when a callback is provided": () => {
		const result = [1, 2, 3, 4].sum(v => v * v);
		expect(result).toEqual(1 + 4 + 9 + 16);
	}
});
testing.addUnit("Array.product()", {
	"basic usage": () => {
		const result = [1, 2, 3, 4].product();
		expect(result).toEqual(1 * 2 * 3 * 4);
	},
	"works when a callback is provided": () => {
		const result = [1, 2, 3, 4].product(v => v + 10);
		expect(result).toEqual(11 * 12 * 13 * 14);
	}
});
