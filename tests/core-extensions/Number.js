testing.addUnit("Number.digits()", {
	"correctly returns the digits of the number": () => {
		expect((1232).digits()).toEqual([1, 2, 3, 2]);
	},
	"works for negative numbers": () => {
		expect((-1232).digits()).toEqual([1, 2, 3, 2]);
	},
	"throws an error when called on a non-integer": () => {
		expect(() => (1.23).digits()).toThrow();
	}
});
