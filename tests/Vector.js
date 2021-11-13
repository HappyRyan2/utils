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
testing.addUnit("Vector angle getter / setters", {
	"getting the angle returns the angle of the vector": () => {
		const vector = new Vector(1, -1);
		expect(vector.angle).toEqual(45);
	},
	"setting the angle correctly modifies the x and y properties": () => {
		const vector = new Vector(1, 0);
		vector.angle = 45;
		expect(vector.x).toApproximatelyEqual(1 / Math.SQRT2);
		expect(vector.y).toApproximatelyEqual(-1 / Math.SQRT2);
	}
});
testing.addUnit("Vector magnitude getters / setters", {
	"getting the magnitude returns the magnitude of the vector": () => {
		const vector = new Vector(3, 4);
		expect(vector.magnitude).toEqual(5);
	},
	"setting the magnitude correctly modifies the x and y properties": () => {
		const vector = new Vector(3, 4);
		vector.magnitude *= 2;
		expect(vector.x).toEqual(6);
		expect(vector.y).toEqual(8);
	}
});
testing.addUnit("Vector.toString()", {
	"can return a string representation of the Vector": () => {
		const vector = new Vector(123, 456);
		const stringified = vector.toString();
		expect(stringified).toEqual("(123, 456)");
	}
});

testing.addUnit("Vector.add()", {
	"can add two Vectors": () => {
		const v1 = new Vector(1, 2);
		const v2 = new Vector(3, 4);
		const sum = v1.add(v2);
		expect(sum).toEqual(new Vector(1 + 3, 2 + 4));
	},
	"can add a Vector and any other form of input supported in the constructor": () => {
		const vector = new Vector(1, 2);
		const sum = vector.add(3, 4);
		expect(sum).toEqual(new Vector(1 + 3, 2 + 4));
	},
	"does not modify either of the Vectors": () => {
		const v1 = new Vector(1, 2);
		const v2 = new Vector(3, 4);
		const sum = v1.add(v2);
		expect(v1).toEqual(new Vector(1, 2));
		expect(v2).toEqual(new Vector(3, 4));
	}
});
testing.addUnit("Vector.subtract()", {
	"can subtract two Vectors": () => {
		const v1 = new Vector(1, 2);
		const v2 = new Vector(3, 4);
		const difference = v1.subtract(v2);
		expect(difference).toEqual(new Vector(1 - 3, 2 - 4));
	},
	"can subtract a Vector and any other form of input supported in the constructor": () => {
		const vector = new Vector(1, 2);
		const difference = vector.subtract(3, 4);
		expect(difference).toEqual(new Vector(1 - 3, 2 - 4));
	},
	"does not modify either of the Vectors": () => {
		const v1 = new Vector(1, 2);
		const v2 = new Vector(3, 4);
		const difference = v1.subtract(v2);
		expect(v1).toEqual(new Vector(1, 2));
		expect(v2).toEqual(new Vector(3, 4));
	}
});
