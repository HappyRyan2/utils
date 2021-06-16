testing.addUnit("Vector constructor", {
	"can create a Vector from x and y coordinates": () => {
		const vector = new Vector(123, 456);
		expect(vector.x).toEqual(123);
		expect(vector.y).toEqual(456);
	},
	"can create a vector from an object with properties x and y": () => {
		const obj = { x: 123, y: 456 };
		const vector = new Vector(obj);
		expect(vector.x).toEqual(123);
		expect(vector.y).toEqual(456);
	},
	"can create a vector from a direction string": () => {
		const v1 = new Vector("left");
		expect(v1.x).toEqual(-1);
		expect(v1.y).toEqual(0);
		const v2 = new Vector("right");
		expect(v2.x).toEqual(1);
		expect(v2.y).toEqual(0);
		const v3 = new Vector("up");
		expect(v3.x).toEqual(0);
		expect(v3.y).toEqual(-1);
		const v4 = new Vector("down");
		expect(v4.x).toEqual(0);
		expect(v4.y).toEqual(1);
	},
	"can create a vector from an array containing two numbers": () => {
		const vector = new Vector([123, 456]);
		expect(vector.x).toEqual(123);
		expect(vector.y).toEqual(456);
	},
	"can create a vector from an object with properties angle and magnitude": () => {
		const obj = { angle: 90, magnitude: 123 };
		const vector = new Vector(obj);
		expect(vector.x).toApproximatelyEqual(0, 1e-10);
		expect(vector.y).toApproximatelyEqual(-123, 1e-10);
	},
	"sets the vector's position to (0, 0) when no arguments are passed in": () => {
		const vector = new Vector();
		expect(vector.x).toEqual(0);
		expect(vector.y).toEqual(0);
	}
});
