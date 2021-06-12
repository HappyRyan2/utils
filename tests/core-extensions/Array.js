testing.addUnit("Array.repeat()", [
	() => {
		const result = [1, 2].repeat(3);
		expect(result).toEqual([1, 2, 1, 2, 1, 2]);
	}
]);
testing.addUnit("Array.subArrays()", [
	() => {
		const result = [1, 2, 3].subArrays();
		expect(result).toEqual(new Set([
			[],
			[1],
			[2],
			[3],
			[1, 2],
			[2, 3],
			[1, 2, 3]
		]));
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
		expect(typeof result).toEqual("number");
		expect(result).toEqual(1 * 2 * 3 * 4);
	},
	"works when a callback is provided": () => {
		const result = [1, 2, 3, 4].product(v => v + 10);
		expect(typeof result).toEqual("number");
		expect(result).toEqual(11 * 12 * 13 * 14);
	},
	"returns a BigInt when the array is entirely BigInts": () => {
		const result = [1n, 2n, 3n].product();
		expect(typeof result).toEqual("bigint");
		expect(result).toEqual(6n);
	},
	"returns a BigInt when the array contains a mix of BigInts and regular numbers": () => {
		const result = [1n, 2, 3n, 4].product();
		expect(typeof result).toEqual("bigint");
		expect(result).toEqual(24n);
	},
	"returns a BigInt when the callback returns only BigInts": () => {
		const result = [1n, 2n, 3n, 4n].product(v => v + 10n);
		expect(typeof result).toEqual("bigint");
		expect(result).toEqual(11n * 12n * 13n * 14n);
	},
	"returns a BigInt when the callback returns a mix of BigInts and regular numbers": () => {
		const result = [1, 2n, 3].product(v => v);
		expect(typeof result).toEqual("bigint");
		expect(result).toEqual(6n);
	}
});
testing.addUnit("Array.min()", {
	"can find the minimum of an array of numbers": () => {
		const result = [1, 2, 3, 2, 1].min();
		expect(result).toEqual(1);
	},
	"works when a callback is passed in": () => {
		const result = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.min(v => v.x)
		);
		expect(result).toEqual({x: 1});
	},
	"can return the minimum output of the callback": () => {
		const minOutput = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.min(v => v.x, null, "value")
		);
		expect(minOutput).toEqual(1);
	},
	"can return the index of the minimum item": () => {
		const index = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.min(v => v.x, null, "index")
		);
		expect(index).toEqual(0);
	},
	"can return the item, the minimum value, and the index": () => {
		const [object, index, value] = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.min(v => v.x, null, "all")
		);
		expect(object).toEqual({x: 1});
		expect(index).toEqual(0);
		expect(value).toEqual(1);
	}
});
testing.addUnit("Array.max()", {
	"can find the maximum of an array of numbers": () => {
		const result = [1, 2, 3, 2, 1].max();
		expect(result).toEqual(3);
	},
	"works when a callback is passed in": () => {
		const result = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.max(v => v.x)
		);
		expect(result).toEqual({x: 3});
	},
	"can return the maximum output of the callback": () => {
		const minOutput = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.max(v => v.x, null, "value")
		);
		expect(minOutput).toEqual(3);
	},
	"can return the index of the maximum item": () => {
		const index = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.max(v => v.x, null, "index")
		);
		expect(index).toEqual(2);
	},
	"can return the item, the maximum value, and the index": () => {
		const [object, index, value] = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.max(v => v.x, null, "all")
		);
		expect(object).toEqual({x: 3});
		expect(index).toEqual(2);
		expect(value).toEqual(3);
	}
});
testing.addUnit("Array.permutations()", {
	"basic functionality works": () => {
		const permutations = [1, 2, 3].permutations();
		expect(permutations).toEqual(new Set([
			[1, 2, 3],
			[1, 3, 2],
			[2, 1, 3],
			[2, 3, 1],
			[3, 1, 2],
			[3, 2, 1]
		]));
	},
	"works for arrays with duplicate elements": () => {
		const permutations = [1, 2, 2].permutations();
		expect(permutations).toEqual(new Set([
			[1, 2, 2],
			[2, 1, 2],
			[2, 2, 1]
		]));
	},
	"works for arrays with multiple duplicate elements": () => {
		const permutations = [1, 1, 2, 2].permutations();
		expect(permutations).toEqual(new Set([
			[1, 1, 2, 2],
			[1, 2, 2, 1],
			[1, 2, 1, 2],
			[2, 1, 2, 1],
			[2, 1, 1, 2],
			[2, 2, 1, 1],
		]));
	}
});
