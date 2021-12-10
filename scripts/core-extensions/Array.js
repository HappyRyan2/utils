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
