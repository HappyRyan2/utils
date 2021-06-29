Number.method(function digits() {
	const number = Math.abs(this);
	if(number % 1 !== 0) {
		throw new Error("Cannot get the digits of a non-integer.");
	}
	const numDigits = `${number}`.length;
	const digits = [];
	for(let i = 0; i < numDigits; i ++) {
		digits.push(Math.floor(number / (10 ** (numDigits - i - 1))) % 10);
	}
	return digits;
});
