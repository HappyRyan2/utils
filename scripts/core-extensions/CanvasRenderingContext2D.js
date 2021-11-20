CanvasRenderingContext2D.method(function polygon() {
	if(arguments[0] instanceof Array) {
		const [vertices] = arguments;
		this.polygon(...vertices);
	}
	else if([...arguments].every(v => typeof v === "number") && arguments.length % 2 === 0) {
		this.moveTo(arguments[0], arguments[1]);
		for(let i = 2; i < arguments.length - 1; i += 2) {
			this.lineTo(arguments[i], arguments[i + 1]);
		}
		this.lineTo(arguments[0], arguments[1]);
	}
	else if([...arguments].every(v => typeof v.x === "number" && typeof v.y === "number")) {
		this.moveTo(arguments[0].x, arguments[0].y);
		for(const vertex of [...arguments].slice(1)) {
			this.lineTo(vertex.x, vertex.y);
		}
		this.lineTo(arguments[0].x, arguments[0].y);
	}
});
CanvasRenderingContext2D.method(function fillPoly() {
	this.beginPath();
	this.polygon(...arguments);
	this.fill();
});
CanvasRenderingContext2D.method(function strokePoly() {
	this.beginPath();
	this.polygon(...arguments);
	this.stroke();
});
CanvasRenderingContext2D.method(function fillCircle(x, y, r) {
	this.beginPath();
	this.arc(x, y, r, 0, 2 * Math.PI);
	this.fill();
});
CanvasRenderingContext2D.method(function strokeCircle(x, y, r) {
	this.beginPath();
	this.arc(x, y, r, 0, 2 * Math.PI);
	this.stroke();
});
