Array.method(function repeat(numTimes) {
	let result = this;
	for(let i = 0; i < numTimes - 1; i ++) {
		result = result.concat(this);
	}
	return result;
});
Array.method(function partitions() {
	/* returns the set of all partitionings of this array. */
	if(this.length === 1) {
		return new Set([[this.map(v => v)]]);
	}
	const partitionsOfOthers = this.slice(1).partitions();
	return new Set([
		...partitionsOfOthers.map(partition => [[this[0]], ...partition]),
		...partitionsOfOthers.map(partition => [[this[0], ...partition[0]], ...partition.slice(1)])
	]);
});
