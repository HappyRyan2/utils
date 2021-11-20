testing.addUnit("CanvasRenderingContext2D.polygon()", {
	"can draw a polygon when given the coordinates of the vertices as numbers": () => {
		const results = [];
		const proxy = {
			polygon: (...args) => CanvasRenderingContext2D.prototype.polygon.call(proxy, ...args),
			moveTo: (...args) => results.push(["moveTo", ...args]),
			lineTo: (...args) => results.push(["lineTo", ...args])
		};
		CanvasRenderingContext2D.prototype.polygon.call(proxy, 1, 2, 3, 4, 5, 6);
		expect(results).toEqual([
			["moveTo", 1, 2],
			["lineTo", 3, 4],
			["lineTo", 5, 6],
			["lineTo", 1, 2]
		]);
	},
	"can draw a polygon when given an array containing the coordinates of the vertices as numbers": () => {
		const results = [];
		const proxy = {
			polygon: (...args) => CanvasRenderingContext2D.prototype.polygon.call(proxy, ...args),
			moveTo: (...args) => results.push(["moveTo", ...args]),
			lineTo: (...args) => results.push(["lineTo", ...args])
		};
		CanvasRenderingContext2D.prototype.polygon.call(proxy, [1, 2, 3, 4, 5, 6]);
		expect(results).toEqual([
			["moveTo", 1, 2],
			["lineTo", 3, 4],
			["lineTo", 5, 6],
			["lineTo", 1, 2]
		]);
	},
	"can draw a polygon when the coordinates of the vertices": () => {
		const results = [];
		const proxy = {
			polygon: (...args) => CanvasRenderingContext2D.prototype.polygon.call(proxy, ...args),
			moveTo: (...args) => results.push(["moveTo", ...args]),
			lineTo: (...args) => results.push(["lineTo", ...args])
		};
		CanvasRenderingContext2D.prototype.polygon.call(
			proxy,
			{ x: 1, y: 2 },
			{ x: 3, y: 4 },
			{ x: 5, y: 6 }
		);
		expect(results).toEqual([
			["moveTo", 1, 2],
			["lineTo", 3, 4],
			["lineTo", 5, 6],
			["lineTo", 1, 2]
		]);
	},
	"can draw a polygon when given an array containing the coordinates of the vertices": () => {
		const results = [];
		const proxy = {
			polygon: (...args) => CanvasRenderingContext2D.prototype.polygon.call(proxy, ...args),
			moveTo: (...args) => results.push(["moveTo", ...args]),
			lineTo: (...args) => results.push(["lineTo", ...args])
		};
		CanvasRenderingContext2D.prototype.polygon.call(
			proxy,
			[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 } ]
		);
		expect(results).toEqual([
			["moveTo", 1, 2],
			["lineTo", 3, 4],
			["lineTo", 5, 6],
			["lineTo", 1, 2]
		]);
	}
});
