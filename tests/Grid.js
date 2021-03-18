testing.addUnit("Grid constructor", {
	"can generate a grid from dimensions and a default value": () => {
		const grid = new Grid(3, 4, "default value for items in grid");
		expect(grid.width()).toEqual(3);
		expect(grid.height()).toEqual(4);
		for(let x = 0; x < 3; x ++) {
			for(let y = 0; y < 4; y ++) {
				const value = grid.get(x, y);
				expect(value).toEqual("default value for items in grid");
			}
		}
	},
	"can generate a grid from a multiline string": () => {
		const grid = new Grid("abc\ndef");
		expect(grid.width()).toEqual(3);
		expect(grid.height()).toEqual(2);
		expect(grid.rows).toEqual([["a", "b", "c"], ["d", "e", "f"]])
	}
});
testing.addUnit("Grid.rotate()", [
	(grid, degrees) => grid.rotate(degrees),
	[
		new Grid([
			[1, 2],
			[3, 4]
		]),
		90,
		new Grid([
			[3, 1],
			[4, 2]
		])
	],
	[
		new Grid([
			[1, 2],
			[3, 4]
		]),
		180,
		new Grid([
			[4, 3],
			[2, 1]
		])
	],
	[
		new Grid([
			[1, 2],
			[3, 4]
		]),
		270,
		new Grid([
			[2, 4],
			[1, 3]
		])
	]
]);
testing.runTestByName("Grid.rotate() - test case 2");
testing.testAll();
