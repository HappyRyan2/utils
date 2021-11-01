window.utils ??= {};
utils.binarySearch = (min, max, callback, whichOne = "first") => {
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
utils.toString = (obj, maxLength = Infinity) => {
	/*
	This method converts objects to strings, with some special cases:
	- Arrays:
		- By default, return the elements (with a recursive call to utils.toString), surrounded by brackets and separated by commas / spaces
		- If too long, return the element's types (e.g. "[object ObjectType]"), but only when that shortens the string for that object
		- If still too long, return "[object Array]" if "[object Array]" is shorter than the others; otherwise, return the shortest of the first 2 forms.
	- Sets: same as arrays, but with curly braces instead of square braces.
	- Strings: return the string WITH QUOTES, or "[object String]" if too long and "[object String]" is shorter
	- Other objects: call default toString; return "[object ObjectType]" if default is too long and if "[object ObjectType]" is shorter
	*/
	if(obj === undefined || obj === null) {
		return `${obj}`;
	}
	else if(obj instanceof Array || obj instanceof Set) {
		const result = [...obj].map(v => utils.toString(v)).join(", ");
		if(result.length + 2 <= maxLength) {
			return obj instanceof Array ? `[${result}]` : `{${result}}`;
		}
		else {
			const shorterResult = [...obj].map(v => {
				const string1 = utils.toString(v);
				const string2 = (v == null) ? `${v}` : `[object ${v.constructor.name}]`;
				return string1.length <= string2.length ? string1 : string2;
			}).join(", ");
			if(shorterResult.length + 2 <= maxLength) {
				return obj instanceof Array ? `[${shorterResult}]` : `{${shorterResult}}`;
			}
			else {
				const shortestResult = `[object ${obj.constructor.name}]`;
				if(shortestResult.length < shorterResult.length) {
					return shortestResult;
				}
				else {
					return obj instanceof Array ? `[${shorterResult}]` : `{${shorterResult}}`;
				}
			}
		}
	}
	else if(typeof obj === "string") {
		const result = `"${obj}"`;
		if(result.length <= maxLength || result.length <= "[object String]".length) {
			return result;
		}
		else {
			return "[object String]";
		}
	}
	else {
		const result1 = `${obj}`;
		const result2 = `[object ${obj.constructor.name}]`;
		if(result1.length <= maxLength || result.length <= result2.length) {
			return result1;
		}
		else {
			return result2;
		}
	}
};
