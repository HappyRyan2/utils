/* Represents a finite or infinite sequence of integers. */
class Sequence {
	constructor(func, properties = {}) {
		const GeneratorFunction = Object.getPrototypeOf(function*() {}).constructor;
		const isGeneratorFunc = (func instanceof GeneratorFunction);
		if(isGeneratorFunc) {
			this.generator = func;
		}
		else {
			this.nthTerm = func;
			this.generator = function*() {
				for(let index = 0; index < Infinity; index ++) {
					yield func(index);
				}
			};
		}
		this[Symbol.iterator] = this.generator;
		this.entries = function*() {
			let index = 0;
			for(const term of this) {
				yield [term, index];
				index ++;
			}
		};

		this.isMonotonic = properties.isMonotonic ?? null;
	}

	nthTerm(termIndex) {
		/* returns the term at the given zero-based index. */
		let iterations = 0;
		for(const term of this) {
			if(iterations === termIndex) { return term; }
			iterations ++;
		}
	}
	indexOf(searchTarget) {
		/*
		returns the index of the first occurence, or -1 if it is not present.
		Note that this will loop infinitely if searching for a nonexistent item in a non-monotonic sequence.
		*/
		if(this.isMonotonic) {
			const isIncreasing = this.nthTerm(1) > this.nthTerm(0);
			let index = 0;
			for(const term of this) {
				if(
					(term > searchTarget && isIncreasing) ||
					(term < searchTarget && !isIncreasing)
				) {
					return -1;
				}
				if(term === searchTarget) { return index; }
				index ++;
			}
		}
		else {
			let index = 0;
			for(const term of this) {
				if(term === searchTarget) { return index; }
				index ++;
			}
		}
	}
	filter(callback) {
		const originalSequence = this;
		return new Sequence(
			function*() {
				let iterations = 0;
				for(const value of originalSequence) {
					if(callback(value, iterations, originalSequence)) {
						yield value;
					}
					iterations ++;
				}
			}
		);
	}
	map(callback) {
		const originalSequence = this;
		return new Sequence(
			function*() {
				let iterations = 0;
				for(const value of originalSequence) {
					yield callback(value, iterations, originalSequence);
					iterations ++;
				}
			}
		);
	}

	slice(minIndex, maxIndex = Infinity) {
		/*
		Returns an array if `minIndex` and `maxIndex` are provided, and a Sequence if `maxIndex` is not provided.
		`minIndex` is inclusive, and `maxIndex` is exclusive.
		*/
		if(maxIndex === Infinity) {
			if(this.hasOwnProperty("nthTerm")) {
				return new Sequence(
					index => this.nthTerm(index + minIndex),
					{ isMonotonic: this.isMonotonic }
				);
			}
			else {
				const originalSequence = this;
				return new Sequence(
					function*() {
						let iterations = 0;
						for(const number of originalSequence) {
							if(iterations >= minIndex) { yield number; }
							iterations ++;
						}
					},
					{ isMonotonic: this.isMonotonic }
				);
			}
		}
		else {
			if(this.hasOwnProperty("nthTerm")) {
				const terms = [];
				for(let i = minIndex; i < maxIndex; i ++) {
					terms.push(this.nthTerm(i));
				}
				return terms;
			}
			else {
				const terms = [];
				let iterations = 0;
				for(const term of this) {
					if(iterations >= maxIndex) { break; }
					if(iterations >= minIndex) {
						terms.push(term);
					}
					iterations ++;
				}
				return terms;
			}
		}
	}

	static POSITIVE_INTEGERS = new Sequence(
		function*() {
			for(let i = 1; i < Infinity; i ++) {
				yield i;
			}
		},
		{ isMonotonic: true }
	);
	static INTEGERS = new Sequence(
		function*() {
			yield 0;
			for(let i = 1; i < Infinity; i ++) {
				yield i;
				yield -i;
			}
		},
		{ isMonotonic: false }
	);

	static MODIFIED_SIEVE_PRIMES = new Sequence(
		function*() {
			const nextPrimeDivisors = []; // the `i`th sub-array contains the distinct prime factors of `i`.
			for(let i = 2; i < Infinity; i ++) {
				const distinctFactors = nextPrimeDivisors[i] ?? [];
				if(distinctFactors.length === 0) {
					/* i is prime */
					yield i;
					nextPrimeDivisors[i * 2] ??= [];
					nextPrimeDivisors[i * 2].push(i);
				}
				else {
					for(const factor of distinctFactors) {
						nextPrimeDivisors[i + factor] ??= [];
						nextPrimeDivisors[i + factor].push(factor);
					}
				}
				delete nextPrimeDivisors[i];
			}
		},
		{ isMonotonic: true }
	);

	static PRIMES = new Sequence(
		function*() {
			yield 2;
			let step = 2;
			let nextStep = null;
			let primesInStep = 1;
			let offsets = [1];
			let nextOffsets = [1];
			let primes = [2]; // numbers to check divisibility for when testing for primality
			loop1: for(let i = 2; i < Infinity; i += step) {
				loop2: for(let j = 0; j < offsets.length; j ++) {
					const offset = offsets[j];
					const possibleNextPrime = i + offset;
					if(primes.every(p => possibleNextPrime % p !== 0)) {
						// `possibleNextPrime` is prime
						yield possibleNextPrime;
						primes.push(possibleNextPrime);
						if(nextStep == null) {
							primesInStep ++;
							nextStep = primes.slice(0, primesInStep).product();
						}
					}
					if(possibleNextPrime % primes[primesInStep - 1] !== 0) {
						nextOffsets.push(possibleNextPrime);
					}
					if(possibleNextPrime >= nextStep - 1) {
						const nextPossiblePrime = (j === offsets.length - 1) ? i + step + offsets[0] : i + offsets[j + 1];
						const getMultiplierAndOffsetIndex = (number, step, offsets) => {
							const multiplier = Math.floor(number / step);
							return [
								multiplier * step,
								offsets.findIndex(offset => multiplier * step + offset >= number)
							];
						};
						offsets = nextOffsets;
						nextOffsets = nextOffsets.filter(v => v !== primes[primesInStep]);
						step = nextStep;
						if(primes[primesInStep]) {
							nextStep = step * primes[primesInStep];
							primesInStep ++;
						}
						else { primesInStep = null; }
						[i, j] = getMultiplierAndOffsetIndex(nextPossiblePrime, step, offsets);
						j --;
						continue loop2;
					}
				}
			}
		},
		{ isMonotonic: true }
	);
	static powersOf(num) {
		return new Sequence(
			index => num ** index,
			{ isMonotonic: num >= 0 }
		);
	}
	static fibonacci(start1 = 1, start2 = 1) {
		return new Sequence(
			function*() {
				yield start1;
				yield start2;
				let v1 = start1, v2 = start2;
				while(true) {
					const next = v1 + v2;
					yield next;
					v1 = v2, v2 = next;
				}
			}
		)
	}
}
