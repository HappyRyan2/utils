testing.addUnit("Math.logBase()", {
	"basic functionality - test case 1": () => {
		const result = Math.logBase(10, 1000);
		expect(result).toApproximatelyEqual(3);
	},
	"basic functionality - test case 2": () => {
		const result = Math.logBase(2, 128);
		expect(result).toApproximatelyEqual(7);
	},
	"works for non-integer results": () => {
		const result = Math.logBase(2, 10);
		expect(result).toApproximatelyEqual(Math.log2(10));
	}
});
testing.addUnit("Math.factorize()", {
	"can return a list of factors - test case 1": () => {
		const result = Math.factorize(300);
		expect(result).toEqual([2, 2, 3, 5, 5]);
	},
	"can return a list of factors - test case 2": () => {
		const result = Math.factorize(1188);
		expect(result).toEqual([2, 2, 3, 3, 3, 11]);
	},
	"can return an object containing the exponent on each prime": () => {
		const result = Math.factorize(300, "prime-exponents");
		expect(result).toEqual({ 2: 2, 3: 1, 5: 2 });
	}
});
testing.addUnit("Math.isPrime()", Math.isPrime, [
	[1, false],
	[2, true],
	[3, true],
	[4, false],
	[5, true],
	[6, false],
	[7, true],
	[8, false],
	[9, false],
	[10, false]
]);
