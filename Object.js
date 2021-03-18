Object.method(function clone() {
	let clone;
	if(Array.isArray(this)) {
		clone = [];
	}
	else {
		clone = Object.create(this.__proto__);
	}
	for(let i in this) {
		if(this.hasOwnProperty(i)) {
			if(typeof this[i] === "object" && this[i] !== null) {
				clone[i] = this[i].clone();
			}
			else {
				clone[i] = this[i];
			}
		}
	}
	return clone;
});
Object.method(function equals(obj) {
	if(typeof this !== "object" || (typeof obj !== "object" || obj === null)) {
		return this === obj;
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
			if(!prop1.equals(prop2)) {
				return false;
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
