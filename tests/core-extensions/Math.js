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
	},
	"returns exact results when the input and output are integers": () => {
		const result = Math.logBase(3, 9);
		expect(result).toEqual(2); // 2, not 2.0000000000000004
	}
});
testing.addUnit("Math.divisors()", {
	"returns the correct result for n=1": () => {
		expect(Math.divisors(1)).toEqual([1]);
	},
	"returns the correct result for n=12": () => {
		expect(Math.divisors(12)).toEqual([1, 2, 3, 4, 6, 12]);
	},
	"returns the correct result for n=19 (a prime)": () => {
		expect(Math.divisors(19)).toEqual([1, 19]);
	},
	"returns the correct result for n=36 (a perfect square)": () => {
		expect(Math.divisors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18, 36]);
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
	},
	"can return a list of factors when the input is a BigInt": () => {
		const result = Math.factorize(300n);
		expect(result).toEqual([2, 2, 3, 5, 5]);
	},
	"can return an object containing the exponent on each prime when the input is a BigInt": () => {
		const result = Math.factorize(300, "prime-exponents");
		expect(result).toEqual({ 2: 2, 3: 1, 5: 2 });
	}
});
testing.addUnit("Math.gcd()", {
	"correctly returns the GCD of 2 numbers": () => {
		const result = Math.gcd(100, 70);
		expect(result).toEqual(10);
	},
	"correctly returns the GCD of 3 or more numbers": () => {
		const result = Math.gcd(95, 115, 155);
		expect(result).toEqual(5);
	}
});
testing.addUnit("Math.areCoprime()", {
	"returns true for coprime integers": () => {
		expect(Math.areCoprime(15, 77)).toEqual(true);
	},
	"returns false for non-coprime integers": () => {
		expect(Math.areCoprime(14, 35)).toEqual(false);
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
testing.addUnit("Math.map()", {
	"correctly maps a number from one range to another": () => {
		const result = Math.map(
			16,
			10, 20,
			3000, 4000
		);
		expect(result).toEqual(3600);
	}
})
testing.addUnit("Math.dist()", {
	"can return the distance between two points": () => {
		const distance = Math.dist(10, 10, 13, 14);
		expect(distance).toEqual(5);
	},
	"can return the distance between two numbers": () => {
		const distance = Math.dist(-3, 4);
		expect(distance).toEqual(7);
	}
});
