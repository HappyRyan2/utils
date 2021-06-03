Math.logBase = function(base, number) {
	return Math.log(number) / Math.log(base);
};
Math.factorize = function(number, mode = "factors-list") {
	let result;
	if(mode === "factors-list") { result = []; }
	else if(mode === "prime-exponents") { result = {}; }

	for(let i = 2; i * i <= number; i ++) {
		while(number % i === 0) {
			number /= i;
			if(mode === "factors-list") { result.push(i); }
			else if(mode === "prime-exponents") {
				result[i] ??= 0;
				result[i] ++;
			}
		}
	}
	if(number !== 1) {
		if(mode === "factors-list") { result.push(number); }
		else if(mode === "prime-exponents") {
			result[number] ??= 0;
			result[number] ++;
		}
	}
	return result;
};
Math.isPrime = function(number) {
	if(number === 1) { return false; }
	if(number % 2 === 0 && number !== 2) { return false; }
	for(let i = 3; i * i <= number; i += 2) {
		if(number % i === 0) { return false; }
	}
	return true;
};
Math.gcd = function(...numbers) {
	if(numbers.length === 1) {
		return numbers[0];
	}
	else if(numbers.length === 2) {
		let [a, b] = numbers;
		while(a !== b) {
			if(a > b) {
				a = (a % b === 0) ? b : a % b;
			}
			else {
				b = (b % a === 0) ? a : b % a;
			}
		}
		return a;
	}
	else {
		let gcd = Math.gcd(numbers[0], numbers[1]);
		for(let i = 2; i < numbers.length; i ++) {
			gcd = Math.gcd(gcd, numbers[i]);
		}
		return gcd;
	}
}
Math.areCoprime = function(a, b) {
	return Math.gcd(a, b) === 1;
};
