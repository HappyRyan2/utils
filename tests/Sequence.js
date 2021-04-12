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
testing.addUnit("Sequence.nthTerm()", [
	() => {
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i += 10) { yield i; }
		}); // {0, 10, 20, 30, ...}
		const term = sequence.nthTerm(3);
		expect(term).toEqual(30);
	}
]);
testing.addUnit("Sequence.indexOf()", {
	"works when the term is in the sequence - test case 1": () => {
		const index = Sequence.POSITIVE_INTEGERS.indexOf(29);
		expect(index).toEqual(28);
	},
	"works when the term is in the sequence - test case 2": () => {
		const index = Sequence.INTEGERS.indexOf(3);
		expect(index).toEqual(5); // 0, 1, -1, 2, -2, 3 --> 3 is at index 5
	},
	"returns -1 when the term is not in the sequence": () => {
		const index = Sequence.POSITIVE_INTEGERS.indexOf(-347);
		expect(index).toEqual(-1);
	}
});
testing.addUnit("Sequence.filter()", [
	() => {
		const evenNumbers = Sequence.POSITIVE_INTEGERS.filter(v => v % 2 === 0);
		const terms = evenNumbers.slice(0, 5);
		expect(terms).toEqual([2, 4, 6, 8, 10]);
	}
]);
testing.addUnit("Sequence.map()", [
	() => {
		const evenNumbers = Sequence.POSITIVE_INTEGERS.map(n => n * 2);
		const terms = evenNumbers.slice(0, 5);
		expect(terms).toEqual([2, 4, 6, 8, 10]);
	}
]);
testing.addUnit("Sequence.entries()", [
	() => {
		const results = [];
		for(const [value, index] of Sequence.POSITIVE_INTEGERS.entries()) {
			results.push([value, index]);
			if(results.length >= 5) { break; }
		}
		expect(results).toEqual([
			[1, 0],
			[2, 1],
			[3, 2],
			[4, 3],
			[5, 4]
		]);
	}
]);

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
testing.addUnit("Sequence.powersOf", [
	() => {
		const terms = Sequence.powersOf(2).slice(0, 5);
		expect(terms).toEqual([1, 2, 4, 8, 16]);
	},
	() => {
		const terms = Sequence.powersOf(3).slice(0, 5);
		expect(terms).toEqual([1, 3, 9, 27, 81]);
	}
]);
testing.addUnit("Sequence.fibonacci", {
	"correctly generates the sequence from default starting values": () => {
		const terms = Sequence.fibonacci().slice(0, 10);
		expect(terms).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
	},
	"correctly generates the sequence from custom starting values": () => {
		const terms = Sequence.fibonacci(2, 1).slice(0, 10);
		expect(terms).toEqual([2, 1, 3, 4, 7, 11, 18, 29, 47, 76]);
	}
});
