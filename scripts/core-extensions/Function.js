Function.prototype.method = function() {
	if(arguments[0] instanceof String && arguments[1] instanceof Function) {
		const [name, func] = arguments;
		this.prototype[name] = func;
	}
	else if(arguments[0] instanceof Function) {
		const [func] = arguments;
		this.prototype[func.name] = func;
	}
	return this;
};
Function.method(function memoize(stringifyKeys = false, cloneOutput = false) {
	/*
	`stringifyKeys` lets you specify an additional optimization. If set to true, the arguments will be stringified before being set into the map, allowing for constant lookup times.
	However, not all arguments can be stringified without information loss (think of all the "[object Object]"s! Oh no!). If your arguments are like this, then do not use this feature.
	*/
	const map = new Map();
	Function.prototype.memoize.maps.push(map);
	const func = this;
	const name = `${this.name || "(anonymous)"} (memoized)`;
	const memoizationData = {
		numDistinctArgs: 0,
		timesCalled: 0
	};
	if(stringifyKeys) {
		const memoized = {
			[name]: function() {
				memoizationData.timesCalled ++;
				const stringified = [...arguments].toString();
				if(stringified === "[object Object]") {
					throw new Error(`Expected cache key to be unique, but instead got [object Object].`);
				}
				if(map.has(stringified)) {
					const result = map.get(stringified);
					return cloneOutput ? ((typeof result === "object" && result != null) ? result.clone() : result) : result;
				}

				memoizationData.numDistinctArgs ++;
				const result = func.apply(this, arguments);
				map.set(stringified, result);
				return result;
			}
		}[name];
		memoized.memoizationData = memoizationData;
		return memoized;
	}
	else {
		const memoized = {
			[name]: function() {
				memoizationData.timesCalled ++;
				for(let [key, value] of map.entries()) {
					if([...key].every((val, i) => val === arguments[i])) {
						return cloneOutput ? ((typeof value === "object" && value != null) ? value.clone() : value) : value;;
					}
				}

				memoizationData.numDistinctArgs ++;
				const result = func.apply(this, arguments);
				map.set(arguments, result);
				return result;
			}
		}[name];
		memoized.memoizationData = memoizationData;
		return memoized;
	}
});
Function.prototype.memoize.maps = [];
Function.prototype.memoize.clear = function() {
	/* clears the cached results in ALL memoized functions. */
	for(const map of Function.prototype.memoize.maps) {
		map.clear();
	}
};
