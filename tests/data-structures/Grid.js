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
testing.addUnit("Grid.containsGrid()", {
	"returns true if the grid contains the other grid - test case 1": () => {
		const grid1 = new Grid([
			[1, 2],
			[3, 4]
		]);
		const grid2 = new Grid([
			[1],
			[3]
		]);
		expect(grid1.containsGrid(grid2)).toEqual(true);
	},
	"returns true if the grid contains the other grid - test case 2": () => {
		const grid1 = new Grid([
			[1, 2],
			[3, 4]
		]);
		const grid2 = new Grid([
			[3, 4]
		]);
		expect(grid1.containsGrid(grid2)).toEqual(true);
	},
	"returns false if the grid does not contain the other grid": () => {
		const grid1 = new Grid([
			[1, 2],
			[3, 4]
		]);
		const grid2 = new Grid([
			[1],
			[4]
		]);
		expect(grid1.containsGrid(grid2)).toEqual(false);
	}
});
testing.addUnit("Grid.columns()", {
	"can return a list of the columns of the grid, as a 2D array": () => {
		const grid = new Grid([
			[1, 2],
			[3, 4]
		]);
		const columns = grid.columns();
		expect(columns).toEqual([
			[1, 3],
			[2, 4]
		]);
	}
});
testing.addUnit("Grid.map()", {
	"can map elements of one Grid to another": () => {
		const grid = new Grid([ [1, 2], [3, 4] ]);
		const mapped = grid.map((v, x, y) => v + x + y);
		expect(mapped).toEqual(new Grid([
			[1, 3],
			[4, 6]
		]));
	}
});
testing.addUnit("Grid.removeRow()", {
	"can remove a row from the grid": () => {
		const grid = new Grid([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);
		const result = grid.removeRow(1);
		expect(result).toEqual(new Grid([
			[1, 2, 3],
			[7, 8, 9]
		]))
	}
});
testing.addUnit("Grid.removeColumn()", {
	"can remove a column from the grid": () => {
		const grid = new Grid([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);
		const result = grid.removeColumn(1);
		expect(result).toEqual(new Grid([
			[1, 3],
			[4, 6],
			[7, 9]
		]))
	}
});
