class Graph {
	constructor() {
		if(arguments.length === 0) {
			this.nodes = new Map();
		}
		else if(Array.isArray(arguments[0]) && arguments[0].every(Array.isArray)) {
			const [nodes] = arguments;
			this.nodes = new Map();
			for(const [value] of nodes) { this.nodes.set(value, { value }); }
			for(const [value, connections] of nodes) {
				this.nodes.get(value).connections = new Set(connections.map(c => this.nodes.get(c)));
			}
		}
	}

	has(value) {
		return this.nodes.has(value);
	}
	add(value) {
		if(!this.nodes.has(value)) {
			const node = { value: value, connections: [] };
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
}
