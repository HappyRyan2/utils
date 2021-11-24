class Vector {
	constructor() {
		if(!arguments.length) {
			this.x = 0;
			this.y = 0;
		}
		else if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [x, y] = arguments;
			this.x = x;
			this.y = y;
		}
		else if(typeof arguments[0].x === "number" && typeof arguments[0].y === "number") {
			const [{ x, y }] = arguments;
			this.x = x;
			this.y = y;
		}
		else if(typeof arguments[0].angle === "number" && typeof arguments[0].magnitude === "number") {
			const TO_RADIANS = Math.PI / 180;
			const [{ angle, magnitude }] = arguments;
			this.x = magnitude * Math.cos(angle * TO_RADIANS);
			this.y = magnitude * -Math.sin(angle * TO_RADIANS);
		}
		else if(typeof arguments[0][0] === "number" && typeof arguments[0][1] === "number") {
			const [[x, y]] = arguments;
			this.x = x;
			this.y = y;
		}
		else if(typeof arguments[0] === "string") {
			const [direction] = arguments;
			if(direction === "left") { this.x = -1, this.y = 0; }
			else if(direction === "right") { this.x = 1, this.y = 0; }
			if(direction === "up") { this.x = 0, this.y = -1; }
			else if(direction === "down") { this.x = 0, this.y = 1; }
		}
	}

	toString() {
		return `(${this.x}, ${this.y})`;
	}

	get angle() {
		/* angles are in degrees, counterclockwise from the positive x-axis, where positive y = down and positive x = right. */
		const TO_DEGREES = 180 / Math.PI;
		return Math.atan2(-this.y, this.x) * TO_DEGREES;
	}
	set angle(newAngle) {
		const TO_RADIANS = Math.PI / 180;
		const magnitude = this.magnitude;
		this.x = magnitude * Math.cos(TO_RADIANS * newAngle);
		this.y = magnitude * -Math.sin(TO_RADIANS * newAngle);
	}
	get magnitude() {
		return Math.sqrt((this.x ** 2) + (this.y ** 2));
	}
	set magnitude(newMagnitude) {
		const multiplier = newMagnitude / this.magnitude;
		this.x *= multiplier;
		this.y *= multiplier;
	}

	add() {
		if(arguments[0] instanceof Vector) {
			const [vector] = arguments;
			return new Vector(this.x + vector.x, this.y + vector.y);
		}
		else {
			const vector = new Vector(...arguments);
			return new Vector(this.x + vector.x, this.y + vector.y);
		}
	}
	subtract() {
		if(arguments[0] instanceof Vector) {
			const [vector] = arguments;
			return new Vector(this.x - vector.x, this.y - vector.y);
		}
		else {
			const vector = new Vector(...arguments);
			return new Vector(this.x - vector.x, this.y - vector.y);
		}
	}
	multiply(multiplier) {
		const result = new Vector(this);
		result.x *= multiplier;
		result.y *= multiplier;
		return result;
	}
	divide(divisor) {
		const result = new Vector(this);
		result.x /= divisor;
		result.y /= divisor;
		return result;
	}

	dotProduct(vector) {
		return (this.x * vector.x) + (this.y * vector.y);
	}

	normalize() {
		const result = new Vector(this);
		result.magnitude = 1;
		return result;
	}
	projection(vector) {
		const magnitude = this.dotProduct(vector.normalize());
		return vector.normalize().multiply(magnitude);
	}
	scalarProjection(vector) {
		return this.dotProduct(vector.normalize());
	}

	rotateAbout() {
		if(arguments[0] instanceof Vector && typeof arguments[1] === "number") {
			const [point, angle] = arguments;
			let result = new Vector(this);
			result = result.subtract(point);
			result.angle += angle;
			result = result.add(point);
			return result;
		}
		else if([...arguments].every(v => typeof v === "number")) {
			const [x, y, angle] = arguments;
			return this.rotateAbout(new Vector(x, y), angle);
		}
	}

	distanceFrom() {
		if(arguments[0] instanceof Vector) {
			const [vector] = arguments;
			return this.subtract(vector).magnitude;
		}
		else {
			return this.subtract(new Vector(...arguments)).magnitude;
		}
	}
}
