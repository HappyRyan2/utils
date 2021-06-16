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
}
