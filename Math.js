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
	return result;
};
