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
	"can create a vector by parsing a coordinate string": () => {
		const vector = new Vector("(1, 2)");
		expect(vector.x).toEqual(1);
		expect(vector.y).toEqual(2);
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
testing.addUnit("Vector.multiply()", {
	"can multiply a Vector and a number": () => {
		const vector = new Vector(1, 2);
		const multiplied = vector.multiply(10);
		expect(multiplied).toEqual(new Vector(10, 20));
	},
	"does not modify the original Vector": () => {
		const vector = new Vector(1, 2);
		const multiplied = vector.multiply(10);
		expect(vector).toEqual(new Vector(1, 2));
	}
});
testing.addUnit("Vector.divide()", {
	"can divide a Vector by a number": () => {
		const vector = new Vector(10, 20);
		const divided = vector.divide(10);
		expect(divided).toEqual(new Vector(1, 2));
	},
	"does not modify the original Vector": () => {
		const vector = new Vector(10, 20);
		const divided = vector.divide(10);
		expect(vector).toEqual(new Vector(10, 20));
	}
});

testing.addUnit("Vector.dotProduct()", {
	"correctly returns the dot product": () => {
		const vector1 = new Vector(1, 3);
		const vector2 = new Vector(4, -2);
		const dotProduct = vector1.dotProduct(vector2);
		expect(dotProduct).toEqual(-2); // (1)(4) + (3)(-2)
	}
});

testing.addUnit("Vector.projection", {
	"correctly returns the projection of one vector onto another": () => {
		const vector1 = new Vector(5, 0);
		const vector2 = new Vector(1, 1);
		const projection = vector1.projection(vector2);
		expect(projection.x).toApproximatelyEqual(2.5);
		expect(projection.y).toApproximatelyEqual(2.5);
	},
	"correctly returns the projection of one vector onto another - test case 2": () => {
		const vector1 = new Vector(1, 1);
		const vector2 = new Vector(0, -2);
		const projection = vector1.projection(vector2);
		expect(projection.x).toEqual(0);
		expect(projection.y).toEqual(1);
	}
});
testing.addUnit("Vector.scalarProjection", {
	"returns the magnitude of the vector projection when the vectors overlap": () => {
		const v1 = new Vector(1, 1);
		const v2 = new Vector(1, 0);
		const projection = v1.scalarProjection(v2);
		expect(projection).toEqual(1);
	},
	"returns the opposite of the magnitude of the vector projection when the vectors do not overlap": () => {
		const v1 = new Vector(-1, 1);
		const v2 = new Vector(1, 0);
		const projection = v1.scalarProjection(v2);
		expect(projection).toEqual(-1);
	},
});

testing.addUnit("Vector.rotateAbout()", {
	"can rotate about a given Vector": () => {
		const vector = new Vector(5, 5);
		const rotated = vector.rotateAbout(new Vector(5, 3), 90);
		expect(rotated).toEqual(new Vector(7, 3));
	},
	"does not modify the original vector": () => {
		const vector = new Vector(5, 5);
		const rotated = vector.rotateAbout(new Vector(5, 3), 90);
		expect(vector).toEqual(new Vector(5, 5));
	},
	"can rotate about a point given by its x and y coordinates": () => {
		const vector = new Vector(5, 5);
		const rotated = vector.rotateAbout(5, 3, 90);
		expect(rotated).toEqual(new Vector(7, 3));
	}
});
testing.addUnit("Vector.distanceFrom()", {
	"can calculate the distance between the vectors": () => {
		const v1 = new Vector(10, 10);
		const v2 = new Vector(13, 14);
		const distance = v1.distanceFrom(v2);
		expect(distance).toEqual(5);
	},
	"can calculate the distance between the vector and a point given by its x and y coordinates": () => {
		const v1 = new Vector(10, 10);
		const distance = v1.distanceFrom(13, 14);
		expect(distance).toEqual(5);
	}
});
