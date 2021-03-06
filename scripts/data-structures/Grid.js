class Grid {
	constructor() {
		this.rows = [];
		if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [width, height, defaultValue] = arguments;
			this.rows = new Array(height).fill().map(row => new Array(width).fill(defaultValue));
		}
		else if(Array.isArray(arguments[0]) && arguments[0].every(row => row.length === arguments[0][0].length)) {
			const [rows] = arguments;
			this.rows = rows;
		}
		else if(typeof arguments[0] === "string") {
			const [multilineString] = arguments;
			const lines = multilineString.split("\n");
			this.rows = lines.map(row => [...row]);
		}
		else {
			throw new Error("Invalid usage.");
		}
	}

	get() {
		if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [x, y] = arguments;
			return this.rows[y][x];
		}
		else if((typeof arguments[0] === "object" && arguments[0] != null) && typeof arguments[0].x === "number" && typeof arguments[0].y === "number") {
			const [position] = arguments;
			return this.rows[position.y][position.x];
		}
		else {
			throw new Error("Invalid usage.");
		}
	}
	set() {
		if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [x, y, value] = arguments;
			this.rows[y][x] = value;
		}
		else if((typeof arguments[0] === "object" && arguments[0] != null) && typeof arguments[0].x === "number" && typeof arguments[0].y === "number") {
			const [position, value] = arguments;
			this.rows[position.y][position.x] = value;
		}
		else {
			throw new Error("Invalid usage.");
		}
	}

	width() {
		return Math.max(...this.rows.map(r => r.length));
	}
	height() {
		return this.rows.length;
	}

	rotate(angle = 90) {
		while(angle < 0) { angle += 360; }
		while(angle >= 360) { angle -= 360; }
		if(angle === 0) {
			return this;
		}
		else if(angle === 90) {
			const result = new Grid(this.height(), this.width());
			this.forEach((value, x, y) => {
				const rotatedX = result.width() - y - 1;
				const rotatedY = x;
				result.rows[rotatedY][rotatedX] = value;
			});
			return result;
		}
		else if(angle === 180) {
			const result = new Grid(this.width(), this.height());
			this.forEach((value, x, y) => {
				const rotatedX = result.width() - x - 1;
				const rotatedY = result.height() - y - 1;
				result.rows[rotatedY][rotatedX] = value;
			});
			return result;
		}
		else if(angle === 270) {
			const result = new Grid(this.height(), this.width());
			this.forEach((value, x, y) => {
				const rotatedX = y;
				const rotatedY = result.height() - x - 1;
				result.rows[rotatedY][rotatedX] = value;
			});
			return result;
		}
		else {
			throw new Error("When rotating grids, angle must be a multiple of 90 degrees.");
		}
	}
	columns() {
		const columns = [];
		for(let x = 0; x < this.width(); x ++) {
			columns.push([]);
			for(let y = 0; y < this.height(); y ++) {
				const value = this.get(x, y);
				columns[columns.length - 1].push(value);
			}
		}
		return columns;
	}

	containsGrid(grid) {
		for(let gridX = 0; gridX <= this.width() - grid.width(); gridX ++) {
			loop2: for(let gridY = 0; gridY <= this.height() - grid.height(); gridY ++) {
				for(let x = 0; x < grid.width(); x ++) {
					for(let y = 0; y < grid.height(); y ++) {
						if(this.get(gridX + x, gridY + y) !== grid.get(x, y)) {
							continue loop2;
						}
					}
				}
				return true;
			}
		}
		return false;
	}

	removeRow(rowIndex) {
		const newRows = this.rows.map(row => row.map(v => v));
		newRows.splice(rowIndex, 1);
		return new Grid(newRows);
	}
	removeColumn(columnIndex) {
		const newRows = this.rows.map(row => row.map(v => v));
		newRows.forEach(row => {
			row.splice(columnIndex, 1);
		});
		return new Grid(newRows);
	}

	*entries() {
		for(let y = 0; y < this.height(); y ++) {
			for(let x = 0; x < this.width(); x ++) {
				const value = this.rows[y][x];
				yield [value, new Vector(x, y)];
			}
		}
	}
	forEach(callback) {
		for(let y = 0; y < this.height(); y ++) {
			for(let x = 0; x < this.width(); x ++) {
				const value = this.rows[y][x];
				callback(value, x, y, this);
			}
		}
	}
	some(callback) {
		for(let y = 0; y < this.height(); y ++) {
			for(let x = 0; x < this.width(); x ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) { return true; }
			}
		}
		return false;
	}
	every(callback) {
		for(let y = 0; y < this.height(); y ++) {
			for(let x = 0; x < this.width(); x ++) {
				const value = this.rows[y][x];
				if(!callback(value, x, y, this)) { return false; }
			}
		}
		return true;
	}
	find(callback) {
		/* returns the first (when searching left-to-right, then top-down) object that meets the criteria. */
		for(let y = 0; y < this.height(); y ++) {
			for(let x = 0; x < this.width(); x ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) {
					return value;
				}
			}
		}
		return undefined;
	}
	findPosition(callback) {
		/* returns the position of the first (when searching left-to-right, then top-down) object that meets the criteria. */
		for(let y = 0; y < this.height(); y ++) {
			for(let x = 0; x < this.width(); x ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) {
					return new Vector(x, y);
				}
			}
		}
		return undefined;
	}
	findPositions(callback) {
		/* returns the positions of all elements that satisfy the provided criteria. */
		const positions = [];
		for(let y = 0; y < this.height(); y ++) {
			for(let x = 0; x < this.width(); x ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) {
					positions.push(new Vector(x, y));
				}
			}
		}
		return positions;
	}
	includes(object) {
		for(let y = 0; y < this.height(); y ++) {
			for(let x = 0; x < this.width(); x ++) {
				const value = this.rows[y][x];
				if(value === object) { return true; }
			}
		}
		return false;
	}
	map(callback) {
		const result = new Grid(this.width(), this.height());
		this.forEach((value, x, y) => {
			result.set(x, y, callback(value, x, y));
		});
		return result;
	}
}
