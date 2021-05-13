testing.addUnit("Graph constructor", {
	"can create an empty graph when the constructor is called without arguments": () => {
		const graph = new Graph();
		expect(graph.nodes).toEqual(new Map());
	},
	"can create a graph from a list of nodes with their connections": () => {
		const graph = new Graph([
			["A", ["B", "C"]], // A is connected to B and C
			["B", ["A"]], // B is connected to A
			["C", ["A"]], // C is connected to A
			["D", []] // D is not connected to anything
		]);
		expect(graph.nodes.size).toEqual(4);
		const node1 = graph.nodes.get("A");
		const node2 = graph.nodes.get("B");
		const node3 = graph.nodes.get("C");
		const node4 = graph.nodes.get("D");
		expect(node1).toEqual({ value: "A", connections: new Set([node2, node3]) });
		expect(node2).toEqual({ value: "B", connections: new Set([node1]) });
		expect(node3).toEqual({ value: "C", connections: new Set([node1]) });
		expect(node4).toEqual({ value: "D", connections: new Set([]) });
	}
});
