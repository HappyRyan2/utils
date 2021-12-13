Math.logBase = function(base, number) {
	const result = Math.log(number) / Math.log(base);
	if(base % 1 === 0 && number % 1 === 0 && base ** Math.round(result) === number) {
		return Math.round(result); // return exact results for integer inputs + outputs
	}
	return result;
};
Math.divisors = function(number) {
	/*
	Returns the divisors of the number, in an array in ascending order.
	Runs in O(sqrt(n)) time.
	*/
	const divisorsBelowSqrt = [];
	const divisorsAboveSqrt = [];
	for(let i = 1; i * i <= number; i ++) {
		if(number % i === 0) {
			divisorsBelowSqrt.push(i);
			if(i * i !== number) { divisorsAboveSqrt.push(number / i); }
		}
	}
	return [...divisorsBelowSqrt, ...divisorsAboveSqrt.reverse()];
};
Math.factorize = function(number, mode = "factors-list") {
	let result;
	if(mode === "factors-list" || mode === "exponents-list") { result = []; }
	else if(mode === "prime-exponents") { result = {}; }

	number = BigInt(number);
	for(let [prime, i] of Sequence.PRIMES.entries()) {
		prime = BigInt(prime);
		if(mode === "exponents-list") {
			result[i] = 0;
		}
		while(number % prime === 0n) {
			number /= prime;
			if(mode === "factors-list") { result.push(Number(prime)); }
			else if(mode === "prime-exponents") {
				result[prime] ??= 0;
				result[prime] ++;
			}
			else if(mode === "exponents-list") {
				result[i] ++;
			}
		}
		if(number == 1) { break; }
	}
	if(number != 1) {
		if(mode === "factors-list") { result.push(Number(number)); }
		else if(mode === "prime-exponents") {
			result[number] ??= 0;
			result[number] ++;
		}
		else if(mode === "exponents-list") {
			const index = Sequence.PRIMES.indexOf(number);
			result[index] ??= 0;
			result[index] ++;
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
	numbers = numbers.map(v => v < 0 ? -v : v); // Math.abs doesn't work for BigInts
	if(numbers.length === 1) {
		return numbers[0];
	}
	else if(numbers.length === 2) {
		let [a, b] = numbers;
		const bigIntInput = (typeof a === "bigint" || typeof b === "bigint");
		a = BigInt(a);
		b = BigInt(b);
		while(a !== b) {
			if(a > b) {
				a = (a % b == 0) ? b : a % b;
			}
			else {
				b = (b % a == 0) ? a : b % a;
			}
		}
		return bigIntInput ? a : Number(a);
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
Math.map = function(val, min1, max1, min2, max2) {
	return (val - min1) / (max1 - min1) * (max2 - min2) + min2;
};
Math.dist = function(...args) {
	if(args.length === 2) {
		const [a, b] = args;
		return Math.abs(a - b);
	}
	else if(args.length === 4) {
		const [x1, y1, x2, y2] = args;
		return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
	}
	else {
		throw new Error("Invalid usage. Math.dist expects either two numbers or four numbers.");
	}
};
Math.rotate = function(x, y, degrees) {
	const radians = degrees * Math.PI / 180;
	return new Vector(
		x * Math.cos(radians) - y * Math.sin(radians),
		x * Math.sin(radians) + y * Math.cos(radians)
	);
};
