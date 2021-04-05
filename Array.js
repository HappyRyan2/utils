Array.method(function repeat(numTimes) {
	let result = this;
	for(let i = 0; i < numTimes - 1; i ++) {
		result = result.concat(this);
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
	const add = (a, b) => a + b;
	if(typeof func === "function") {
		return this.map(func, thisArg).reduce(add, 0);
	}
	else {
		return this.reduce(add, 0);
	}
});
Array.method(function product(func, thisArg) {
	const multiply = (a, b) => a * b;
	if(typeof func === "function") {
		return this.map(func, thisArg).reduce(multiply, 1);
	}
	else {
		return this.reduce(multiply, 1);
	}
});
