/* Represents a finite or infinite sequence of integers. */
class Sequence {
	constructor(generator, properties = {}) {
		this.generator = generator;
		this.properties = {
			...properties,
			isMonotonic: false
		};
		this[Symbol.iterator] = generator;
	}
}
