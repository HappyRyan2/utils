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

		this.isMonotonic = properties.isMonotonic ?? null;
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
	static PRIMES = new Sequence(
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
}
