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
testing.addUnit("Sequence.union()", {
	"works for increasing monotonic sequences": () => {
		const s1 = new Sequence(
			i => i * 2, // sequence of even numbers
			{ isMonotonic: true }
		);
		const s2 = new Sequence(
			i => i * 3, // sequence of numbers divisible by 3
			{ isMonotonic: true }
		);
		const union = Sequence.union(s1, s2); // numbers divisible by 2 or 3
		expect(union.slice(0, 14)).toEqual([
			0, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20
		]);
	},
	"works for decreasing monotonic sequences": () => {
		const s1 = new Sequence(
			i => -i * 2, // sequence of negative even numbers
			{ isMonotonic: true }
		);
		const s2 = new Sequence(
			i => -i * 3, // sequence of negative numbers divisible by 3
			{ isMonotonic: true }
		);
		const union = Sequence.union(s1, s2); // numbers divisible by 2 or 3
		expect(union.slice(0, 14)).toEqual([
			-0, -2, -3, -4, -6, -8, -9, -10, -12, -14, -15, -16, -18, -20
		]);
	},
	"works for sequences that contain duplicates": () => {
		const s1 = new Sequence(function*() {
			yield 0;
			for(let i = 10; i < Infinity; i += 10) { yield i; yield i; }
		}, { isMonotonic: true }); // s1 = [0, 10, 10, 20, 20, 30, 30, ...]
		const s2 = new Sequence(
			n => n * 4,
			{ isMonotonic: true }
		); // s2 = [0, 4, 8, 12, 16, ...]
		const union = Sequence.union(s1, s2);
		expect(union.slice(0, 10)).toEqual([
			0, 4, 8, 10, 12, 16, 20, 24, 28, 30
		]);
	},
	"works for sequences where the first few terms are equal": () => {
		const s1 = new Sequence(
			n => Math.floor(n / 5), // 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, ...
			{ isMonotonic: true }
		);
		const s2 = new Sequence(
			n => 2 * (n + 1), // 0, 1, 2, 3, 4,
			{ isMonotonic: true }
		);
		const union = Sequence.union(s1, s2);
		expect(union.slice(0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
	},
	"throws an error for non-monotonic sequences": () => {
		const s1 = new Sequence(function*() {
			yield 2; yield 3; yield 1;
		}, { isMonotonic: false });
		const s2 = new Sequence(function*() {
			yield 10; yield 100; yield 3;
		}, { isMonotonic: false });
		testing.assertThrows(() => {
			Sequence.union(s1, s2);
		});
	}
});
testing.addUnit("Sequence.isIncreasing()", {
	"returns null (unknown) when it is not known whether the sequence is monotonic": () => {
		const sequence = new Sequence(n => n + 1);
		/* the sequence is clearly monotonic and increasing, but its
		`isMonotonic` property is null (unknown) */
		expect(sequence.isIncreasing()).toEqual(null);
	},
	"returns true for increasing sequences": () => {
		const sequence = new Sequence(n => n + 1, { isMonotonic: true });
		expect(sequence.isIncreasing()).toEqual(true);
	},
	"returns false for non-increasing sequences": () => {
		const sequence = new Sequence(n => -n, { isMonotonic: true });
		expect(sequence.isIncreasing()).toEqual(false);
	},
	"works for sequences where the first few terms are constant": () => {
		const sequence = new Sequence(
			n => Math.floor(n / 5), // 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, ...
			{ isMonotonic: true }
		);
		expect(sequence.isIncreasing()).toEqual(true);
	},
	"works for sequences where the first few terms are constant": () => {
		const sequence = new Sequence(
			n => Math.floor(n / 5), // 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, ...
			{ isMonotonic: true }
		);
		expect(sequence.isIncreasing()).toEqual(true);
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
			if(primes.length >= 40) { break; }
		}
		expect(primes).toEqual([
			2,
			3,
			5,
			7,
			11,
			13,
			17,
			19,
			23,
			29,
			31,
			37,
			41,
			43,
			47,
			53,
			59,
			61,
			67,
			71,
			73,
			79,
			83,
			89,
			97,
			101,
			103,
			107,
			109,
			113,
			127,
			131,
			137,
			139,
			149,
			151,
			157,
			163,
			167,
			173
		]);
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
