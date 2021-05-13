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
}
