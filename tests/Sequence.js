testing.addUnit("Sequence constructor", {
	"can create a sequence from a generator function": () => {
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i += 10) {
				yield i;
			}
		});
		const terms = [];
		for(const number of sequence.generator()) {
			terms.push(number);
			if(terms.length >= 5) { break; }
		}
		expect(terms).toEqual([0, 10, 20, 30, 40]);
	},
	"can create a sequence from an nth-term formula": () => {
		const sequence = new Sequence(n => n * 10);
		const terms = [];
		for(const number of sequence.generator()) {
			terms.push(number);
			if(terms.length >= 5) { break; }
		}
		expect(terms).toEqual([0, 10, 20, 30, 40]);
	}
});
testing.addUnit("Sequence iteration", [
	() => {
		const positiveIntegers = new Sequence(function*() {
			for(let i = 1; i < Infinity; i ++) { yield i; }
		});
		const sequenceItems = [];
		for(const number of positiveIntegers) {
			sequenceItems.push(number);
			if(sequenceItems.length >= 5) { break; }
		}
		expect(sequenceItems).toEqual([1, 2, 3, 4, 5]);
	}
]);
testing.addUnit("Sequence.slice()", {
	"works for finite subsequences with nth-term formulas": () => {
		const sequence = new Sequence(n => n * 10); // {0, 10, 20, 30, ...}
		const sliced = sequence.slice(0, 5);
		expect(sliced).toEqual([0, 10, 20, 30, 40]);
	},
	"works for infinite subsequences with nth-term formulas": () => {
		const sequence = new Sequence(n => n * 10); // {0, 10, 20, 30, ...}
		const sliced = sequence.slice(5, Infinity);
		const terms = [];
		for(const term of sliced) {
			terms.push(term);
			if(terms.length >= 5) { break; }
		}
		expect(terms).toEqual([50, 60, 70, 80, 90]);
	},
	"works for finite subsequences without nth-term formulas": () => {
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i += 10) { yield i; }
		}); // {0, 10, 20, 30, ...}
		const sliced = sequence.slice(0, 5);
		expect(sliced).toEqual([0, 10, 20, 30, 40]);
	},
	"works for infinite sequences without nth-term formulas": () => {
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i += 10) { yield i; }
		}); // {0, 10, 20, 30, ...}
		const sliced = sequence.slice(5, Infinity);
		const terms = [];
		for(const term of sliced) {
			terms.push(term);
			if(terms.length >= 5) { break; }
		}
		expect(terms).toEqual([50, 60, 70, 80, 90]);
	}
});

testing.addUnit("Sequence.POSITIVE_INTEGERS", [
	() => {
		const integers = [];
		for(const integer of Sequence.POSITIVE_INTEGERS) {
			integers.push(integer);
			if(integers.length >= 9) { break; }
		}
		expect(integers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	}
]);
testing.addUnit("Sequence.INTEGERS", [
	() => {
		const integers = [];
		for(const integer of Sequence.INTEGERS) {
			integers.push(integer);
			if(integers.length >= 9) { break; }
		}
		expect(integers).toEqual([0, 1, -1, 2, -2, 3, -3, 4, -4]);
	}
]);
testing.addUnit("Sequence.PRIMES", [
	() => {
		const primes = [];
		for(const prime of Sequence.PRIMES) {
			primes.push(prime);
			if(primes.length >= 10) { break; }
		}
		expect(primes).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
	}
]);
