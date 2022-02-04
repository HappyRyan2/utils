Map.method(function equals(map, history = new Map()) {
	if(this.size !== map.size) { return false; }

	const areEqual = (a, b) => (
		a === b ||
		(typeof a === "object" && a != null) && a.equals(b, history)
	);
	loop1: for(const [key, value] of this) {
		loop2: for(const [otherKey, otherValue] of map) {
			if(areEqual(key, otherKey) && areEqual(value, otherValue)) {
				continue loop1;
			}
		}
		return false;
	}
	return true;
});
Map.method(function clone(history = new Map()) {
	const clone = new Map();
	for(const [key, value] of this.entries()) {
		const newKey = (key != null) ? key.clone(history) : key;
		const newValue = (value != null) ? value.clone(history) : value;
		clone.set(newKey, newValue);
	}
	return clone;
});
