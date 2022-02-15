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
			for(const [value] of nodes) {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot create Graph: input nodes contain duplicate value '${value}'.`);
				}
				this.nodes.set(value, { value });
			}
			for(const [value, connections] of nodes) {
				for(const connection of connections) {
					if(!this.nodes.has(connection)) {
						throw new Error(`Cannot connect '${value}' to '${connection}' as '${connection}' is not in the graph.`);
					}
					if(!nodes.find(v => v[0] === connection)[1].includes(value)) {
						throw new Error(`Nodes must be connected symmetrically: cannot connect '${value}' to '${connection}' without also connecting '${connection}' to '${value}'.`);
					}
				}
				this.nodes.get(value).connections = new Set(connections.map(c => this.nodes.get(c)));
			}
		}
		else if(Array.isArray(arguments[0])) {
			const [values] = arguments;
			this.nodes = new Map();
			for(const value of values) {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot create Graph: input nodes contain duplicate value '${value}'.`);
				}
				const node = { value: value, connections: new Set() };
				this.nodes.set(value, node);
			}
			if(typeof arguments[1] === "function") {
				const [, callback] = arguments;
				for(const node1 of values) {
					for(const node2 of values) {
						if(callback(node1, node2)) {
							this.connect(node1, node2);
						}
					}
				}
			}
		}
		else if(arguments[0] instanceof Graph) {
			const [graph] = arguments;
			this.nodes = new Map();
			for(const value of graph.values()) {
				this.add(value);
			}
			for(const [value, node] of graph.nodes) {
				for(const connectedNode of node.connections) {
					this.connect(value, connectedNode.value);
				}
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
	*[Symbol.iterator]() {
		for(const node of this.nodes.values()) {
			yield node.value;
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
	connections() {
		const result = [];
		for(const node of this.nodes.values()) {
			for(const connection of node.connections) {
				if(!result.some(c => (
					(c[0] === node.value && c[1] === connection.value)) ||
					(c[1] === node.value && c[0] === connection.value)
				)) { result.push([node.value, connection.value]); }
			}
		}
		return result;
	}

	setConnection(value1, value2, connected) {
		if(connected) {
			this.connect(value1, value2);
		}
		else {
			this.disconnect(value1, value2);
		}
	}
	setConnections(callback) {
		const pairsChecked = new Set();
		for(const [value1] of this.nodes) {
			for(const [value2] of this.nodes) {
				if(!pairsChecked.some(([v1, v2]) => value1 === v1 && value2 === v2)) {
					this.setConnection(value1, value2, callback(value1, value2, this));
					pairsChecked.add([value2, value1]);
				}
			}
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

	componentContaining(node) {
		if(!this.nodes.has(node)) {
			throw new Error(`Cannot find component; expected the given value to be a node in the graph, but it was not.`);
		}
		const nodesToCheck = [this.nodes.get(node)];
		const component = new Set();
		while(nodesToCheck.length !== 0) {
			const currentNode = nodesToCheck.shift(0);
			component.add(currentNode);
			for(const neighbor of currentNode.connections) {
				if(!component.has(neighbor)) {
					nodesToCheck.push(neighbor);
				}
			}
		}
		return component.map(node => node.value);
	}
	components() {
		const alreadyChecked = new Set();
		const components = new Set();
		for(const node of this.nodes.values()) {
			if(!alreadyChecked.has(node)) {
				const component = this.componentContaining(node.value);
				components.add(component);
				for(const value of component) {
					alreadyChecked.add(this.nodes.get(value));
				}
			}
		}
		return components;
	}
}
