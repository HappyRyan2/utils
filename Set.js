Set.method(function equals(set) {
	if(this.size !== set.size) {
		return false;
	}
	for(const item of this.values()) {
		if(![...set].some(value => value === item || ((typeof value === "object" && value != null) && value.equals(item)))) {
			return false;
		}
	}
	return true;
});
Set.method(function clone() {
	let clone = new Set([]);
	this.forEach(item => {
		if(typeof item === "object" && item != null) {
			clone.add(item.clone());
		}
		else {
			clone.add(item);
		}
	});
	return clone;
});


Set.method(function intersection(set) {
	/* returns the set of items that are in both sets. */
	const result = new Set();
	this.forEach(value => {
		if(set.has(value)) {
			result.add(value);
		}
	});
	return result;
});
Set.method(function union(set) {
	const result = new Set();
	this.forEach(value => {
		result.add(value);
	});
	set.forEach(value => {
		result.add(value);
	});
	return result;
});
Set.method(function difference(set) {
	/* returns the set of items that are in this set but not in the other set. */
	const result = new Set();
	this.forEach(value => {
		if(!set.has(value)) {
			result.add(value);
		}
	});
	return result;
});
Set.method(function powerSet() {
	/* returns the power set: the set of every subset of this set. */
	const powerSet = new Set();
	const powerSetSize = 2 ** this.size;
	const itemsArray = [...this];
	for(let i = 0; i < powerSetSize; i ++) {
		const binaryString = i.toString(2).padStart(this.size, "0");
		const subset = new Set();
		[...binaryString].forEach((bit, index) => {
			if(bit === "1") {
				subset.add(itemsArray[index]);
			}
		});
		powerSet.add(subset);
	}
	return powerSet;
});
Set.cartesianProduct = function(...sets) {
	const firstSet = sets[0];
	if(sets.length === 1) {
		return new Set(firstSet.map(value => [value]));
	}
	const laterSets = sets.slice(1);
	const productOfOthers = Set.cartesianProduct(...laterSets);
	let result = new Set();
	firstSet.forEach(item => {
		productOfOthers.forEach(subproduct => {
			result.add([item, ...subproduct]);
		});
	});
	return result;
};


Set.method(function map(callback) {
	return new Set([...this].map(callback));
});
Set.method(function every(callback) {
	return new Set([...this].every(callback));
});
Set.method(function some(callback) {
	return new Set([...this].some(callback));
});
Set.method(function filter(callback) {
	return new Set([...this].filter(callback));
});
Set.method(function find(callback) {
	return [...this].find(callback);
});
Set.method(function onlyItem() {
	if(this.size !== 1) {
		throw new Error(`Expected the set to have exactly 1 item, but instead it had ${this.size}.`);
	}
	return [...this][0];
});
