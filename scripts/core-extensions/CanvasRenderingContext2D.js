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
CanvasRenderingContext2D.method(function fillCanvas(color = this.fillStyle) {
	this.save();
	this.setTransform(1, 0, 0, 1, 0, 0); // reset transformations
	this.fillStyle = color;
	this.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.restore();
});
CanvasRenderingContext2D.method(function strokeLine() {
	if([...arguments].every(v => typeof v === "number")) {
		const [x1, y1, x2, y2] = arguments;
		this.beginPath();
		this.moveTo(x1, y1);
		this.lineTo(x2, y2);
		this.stroke();
	}
	else if(
		typeof arguments[0].x === "number" && typeof arguments[0].y === "number" &&
		typeof arguments[1].x === "number" && typeof arguments[1].y === "number"
	) {
		const [p1, p2] = arguments;
		this.beginPath();
		this.moveTo(p1.x, p1.y);
		this.lineTo(p2.x, p2.y);
		this.stroke();
	}
});
