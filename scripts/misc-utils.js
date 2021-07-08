window.utils ??= {};
window.utils.binarySearch = (min, max, callback, whichOne = "first") => {
	while(max - min > 1) {
		const mid = Math.floor((min + max) / 2);
		const result = callback(mid);
		if(result < 0) {
			/* guess was too low */
			min = mid;
		}
		else if(result > 0) {
			/* guess was too high */
			max = mid;
		}
		else {
			if(whichOne === "first") { max = mid; }
			else if(whichOne === "last") { min = mid; }
			else { min = max = mid; break; }
		}
	}
	if(max === min + 1) {
		if(callback(min) === 0 && callback(max) !== 0) { return min; }
		if(callback(min) !== 0 && callback(max) === 0) { return max; }
		return whichOne === "first" ? min : max;
	}
	/* min === max */
	return min;
};
