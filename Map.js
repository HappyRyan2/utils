Map.method(function equals(map) {
	if(this.size !== map.size) { return false; }

	const areEqual = (a, b) => (
		a === b ||
		(typeof a === "object" && a != null) && a.equals(b)
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
