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
