window.utils ??= {};
window.utils.binarySearch = (min, max, callback, whichOne = "first") => {
	if(typeof min === "bigint" || typeof max === "bigint") {
		min = BigInt(min); max = BigInt(max);
	}
	while(max - min > 1) {
		const mid = (typeof min === "bigint") ? (min + max) / 2n : Math.floor((min + max) / 2);
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
	if(BigInt(max) === BigInt(min) + 1n) {
		if(BigInt(callback(min)) === 0n && BigInt(callback(max)) !== 0n) {
			return min;
		}
		if(BigInt(callback(min)) !== 0n && BigInt(callback(max)) === 0n) {
			return max;
		}
		return whichOne === "first" ? min : max;
	}
	/* min === max */
	return min;
};
