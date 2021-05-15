class Graph {
	constructor() {
		if(arguments.length === 0) {
			this.nodes = new Map();
		}
		else if(
			Array.isArray(arguments[0]) &&
			arguments[0].every(Array.isArray) &&
			arguments[0].every(a => a.length === 2)
		) {
			const [nodes] = arguments;
			this.nodes = new Map();
			for(const [value] of nodes) { this.nodes.set(value, { value }); }
			for(const [value, connections] of nodes) {
				for(const connection of connections) {
					if(!this.nodes.has(connection)) {
						throw new Error(`Cannot connect '${value}' to '${connection}' as '${connection}' is not in the graph.`);
					}
				}
				this.nodes.get(value).connections = new Set(connections.map(c => this.nodes.get(c)));
			}
		}
		else if(Array.isArray(arguments[0])) {
			const [values] = arguments;
			this.nodes = new Map();
			for(const value of values) {
				const node = { value: value, connections: new Set() };
				this.nodes.set(value, node);
			}
		}
		else if(arguments[0] instanceof Grid) {
			const [grid] = arguments;
			this.nodes = new Map();
			grid.forEach(value => {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot construct a graph from a grid containing duplicate values.`);
				}
				this.nodes.set(value, { value: value, connections: new Set() });
			});
			grid.forEach((value, x, y) => {
				if(x !== 0) {
					this.connect(value, grid.get(x - 1, y));
				}
				if(x !== grid.width() - 1) {
					this.connect(value, grid.get(x + 1, y));
				}
				if(y !== 0) {
					this.connect(value, grid.get(x, y - 1));
				}
				if(y !== grid.height() - 1) {
					this.connect(value, grid.get(x, y + 1));
				}
			});
		}
	}

	has(value) {
		return this.nodes.has(value);
	}
	add(value) {
		if(!this.nodes.has(value)) {
			const node = { value: value, connections: new Set() };
			this.nodes.set(value, node);
		}
	}
	remove(value) {
		if(this.nodes.has(value)) {
			const node = this.nodes.get(value);
			for(const connectedNode of node.connections) {
				connectedNode.connections.delete(node);
			}
			this.nodes.delete(value);
		}
	}
	areConnected(value1, value2) {
		if(!this.nodes.has(value1)) {
			throw new Error(`Expected the graph to contain '${value1}.'`);
		}
		if(!this.nodes.has(value2)) {
			throw new Error(`Expected the graph to contain '${value2}.'`);
		}
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		return node1.connections.has(node2);
	}
	connect(value1, value2) {
		if(!this.nodes.has(value1)) {
			throw new Error(`Expected the graph to contain '${value1}.'`);
		}
		if(!this.nodes.has(value2)) {
			throw new Error(`Expected the graph to contain '${value2}.'`);
		}
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		node1.connections.add(node2);
		node2.connections.add(node1);
	}
	disconnect(value1, value2) {
		if(!this.nodes.has(value1)) {
			throw new Error(`Expected the graph to contain '${value1}.'`);
		}
		if(!this.nodes.has(value2)) {
			throw new Error(`Expected the graph to contain '${value2}.'`);
		}
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		node1.connections.delete(node2);
		node2.connections.delete(node1);
	}

	size() {
		return this.nodes.size;
	}

	values() {
		return [...this.nodes.values()].map(node => node.value);
	}

	setConnection(value1, value2, connected) {
		if(connected) {
			this.connect(value1, value2);
		}
		else {
			this.disconnect(value1, value2);
		}
	}
	toggleConnection(value1, value2) {
		if(this.areConnected(value1, value2)) {
			this.disconnect(value1, value2);
		}
		else {
			this.connect(value1, value2);
		}
	}
}
