testing.addUnit("Set.equals()", [
	(a, b) => new Set(a).equals(new Set(b)),
	[[1, 2, 3], [1, 2, 3], true],
	[[3, 1, 2], [2, 1, 3], true],
	[[1, 2, 3], [4, 5, 6], false],
	[[1, 2, 3], [1], false],
	[[1], [1, 2, 3], false],
	[[new Set(), new Set()], [new Set(), new Set()], true],
	[new Set([{}]), new Set([null]), false],
]);
testing.addUnit("Set.union()", [
	(a, b) => new Set(a).union(new Set(b)),
	[[1, 2, 3], [3, 4, 5], new Set([1, 2, 3, 4, 5])],
	[[1, 2], [3, 4], new Set([1, 2, 3, 4])]
]);
testing.addUnit("Set.intersection()", [
	(a, b) => new Set(a).intersection(new Set(b)),
	[[1, 2, 3], [3, 4, 5], new Set([3])],
	[[1, 2], [3, 4], new Set([])]
]);
testing.addUnit("Set.difference()", [
	(a, b) => new Set(a).difference(new Set(b)),
	[[1, 2, 3], [3, 4, 5], new Set([1, 2])],
	[[1, 2], [3, 4], new Set([1, 2])]
]);
testing.addUnit("Set.subsets()", [
	(set) => set.subsets(),
	[
		new Set([]),
		new Set([
			new Set([])
		])
	],
	[
		new Set(["A"]),
		new Set([
			new Set([]),
			new Set(["A"])
		])
	],
	[
		new Set([1, 2]),
		new Set([
			new Set([]),
			new Set([1]),
			new Set([2]),
			new Set([1, 2])
		])
	]
]);
testing.addUnit("Set.cartesianProduct()", Set.cartesianProduct, [
	[
		new Set(["foo", "bar"]),

		new Set([
			["foo"],
			["bar"]
		])
	],
	[
		new Set([1, 2]),
		new Set(["a", "b"]),

		new Set([
			[1, "a"],
			[1, "b"],
			[2, "a"],
			[2, "b"]
		])
	],
	[
		new Set([1, 2]),
		new Set(["a", "b"]),
		new Set([true, false]),

		new Set([
			[1, "a", true],
			[1, "a", false],
			[1, "b", true],
			[1, "b", false],
			[2, "a", true],
			[2, "a", false],
			[2, "b", true],
			[2, "b", false],
		])
	],
	[
		new Set(["foo", "bar"]),
		new Set([1, 2, 3, 4]),
		new Set([true, false]),

		new Set([
			["foo", 1, true],
			["foo", 1, false],
			["foo", 2, true],
			["foo", 2, false],
			["foo", 3, true],
			["foo", 3, false],
			["foo", 4, true],
			["foo", 4, false],
			["bar", 1, true],
			["bar", 1, false],
			["bar", 2, true],
			["bar", 2, false],
			["bar", 3, true],
			["bar", 3, false],
			["bar", 4, true],
			["bar", 4, false],
		])
	]
]);
testing.addUnit("Set.cartesianProductGenerator()", [
	() => {
		const set1 = new Set(["a", "b"]);
		const set2 = new Set(["c", "d"]);
		const product = new Set([]);
		for(const combination of Set.cartesianProductGenerator(set1, set2)) {
			product.add(combination);
		}
		expect(product).toEqual(Set.cartesianProduct(set1, set2));
	},
	() => {
		const set1 = new Set(["a", "b"]);
		const product = new Set([]);
		for(const combination of Set.cartesianProductGenerator(set1)) {
			product.add(combination);
		}
		expect(product).toEqual(Set.cartesianProduct(set1));
	}
]);
