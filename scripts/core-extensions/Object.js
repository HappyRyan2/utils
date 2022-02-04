Object.method(function clone(history = []) {
	if(this == null) { return null; }
	if(
		this instanceof Number ||
		this instanceof String ||
		this instanceof Boolean
	) { return this.valueOf(); }
	let clone;
	if(Array.isArray(this)) {
		clone = [];
	}
	else {
		clone = Object.create(this.__proto__);
	}
	for(let i in this) {
		if(this.hasOwnProperty(i)) {
			const historyItem = history.find(v => v.selfItem === this[i]);
			if(historyItem) {
				clone[i] = historyItem.otherItem;
			}
			else if(typeof this[i] === "object" && this[i] !== null) {
				clone[i] = this[i].clone([...history, { selfItem: this[i], otherItem: clone }]);
			}
			else {
				clone[i] = this[i];
			}
		}
	}
	return clone;
});
Object.method(function equals(obj, history = []) {
	if(this === obj) { return true; }
	if(
		(this.valueOf() !== this) ||
		(typeof obj !== "object" || obj === null)
	) {
		return (
			this.valueOf() === obj?.valueOf() ||
			(Number.isNaN(this.valueOf()) && Number.isNaN(obj.valueOf()))
		);
	}
	if(this.__proto__ !== obj.__proto__) {
		return false;
	}
	if(Object.keys(this).length !== Object.keys(obj).length) {
		return false;
	}
	for(var i in this) {
		var prop1 = this[i];
		var prop2 = obj[i];
		var type1 = Object.typeof(prop1);
		var type2 = Object.typeof(prop2);
		if(type1 !== type2) {
			return false;
		}
		else if(type1 === "object" || type1 === "array" || type1 === "instance") {
			var historyItem = history.find(v => v.selfItem === prop1);
			if(historyItem) {
				return historyItem.otherItem === prop2;
			}
			else {
				var newHistory = [
					...history,
					{ selfItem: prop1, otherItem: prop2 }
				];
				if(!prop1.equals(prop2, newHistory)) {
					return false;
				}
			}
		}
		else if(prop1 !== prop2) {
			return false;
		}
	}
	return true;
});
Object.method(function set(key, value) {
	this[key] = value;
	return this;
});
Object.method(function watch(key, callback) {
	const getter = this.__lookupGetter__(key);
	const setter = this.__lookupSetter__(key);
	let value = this[key];
	Object.defineProperty(this, key, {
		get: () => {
			if(typeof getter === "function") { getter(); }
			return value;
		},
		set: (newValue) => {
			callback(this, key, newValue);
			if(typeof setter === "function") {
				setter();
			}
			else { value = newValue; }
		}
	});
});
Object.typeof = function(value) {
	/*
	This function serves to determine the type of a variable better than the default "typeof" operator, which returns strange values for some inputs (see special cases below).
	*/
	if(value !== value) {
		return "NaN"; // fix for (typeof NaN === "number")
	}
	else if(value === null) {
		return "null"; // fix for (typeof null === "object")
	}
	else if(Array.isArray(value)) {
		return "array"; // fix for (typeof [] === "object")
	}
	else if(typeof value === "object" && Object.getPrototypeOf(value) !== Object.prototype) {
		return "instance"; // return "instance" for instances of a custom class
	}
	else {
		return typeof value;
	}
};
