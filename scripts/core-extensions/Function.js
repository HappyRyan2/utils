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
	const func = this;
	const name = `${this.name || "(anonymous)"} (memoized)`;
	if(stringifyKeys) {
		return {
			[name]: function() {
				const stringified = [...arguments].toString();
				if(map.has(stringified)) {
					const result = map.get(stringified);
					return cloneOutput ? ((typeof result === "object" && result != null) ? result.clone() : result) : result;
				}

				const result = func.apply(this, arguments);
				map.set(stringified, result);
				return result;
			}
		}[name];
	}
	else {
		return {
			[name]: function() {
				for(let [key, value] of map.entries()) {
					if([...key].every((val, i) => val === arguments[i])) {
						return cloneOutput ? ((typeof value === "object" && value != null) ? value.clone() : value) : value;;
					}
				}
				const result = func.apply(this, arguments);
				map.set(arguments, result);
				return result;
			}
		}[name];
	}
});
