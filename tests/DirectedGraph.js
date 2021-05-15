testing.addUnit("DirectedGraph constructor", {
	"can create an empty graph when the constructor is called without arguments": () => {
		const graph = new DirectedGraph();
		expect(graph.size()).toEqual(0);
		expect(graph.values()).toEqual([]);
	},
	"can create a graph from a list of nodes and their connections": () => {
		const graph = new DirectedGraph([
			["A", ["B", "C"]], // A is connected to B and C
			["B", ["A"]], // B is connected to A
			["C", ["A"]], // C is connected to A
			["D", []] // D is not connected to anything
		]);
		expect(graph.values()).toEqual(["A", "B", "C", "D"]);
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("A", "C")).toEqual(true);
		expect(graph.areConnected("A", "D")).toEqual(false);
		expect(graph.areConnected("B", "C")).toEqual(false);
		expect(graph.areConnected("B", "D")).toEqual(false);
		expect(graph.areConnected("C", "D")).toEqual(false);
	},
	"allows nodes to be asymmetrically connected": () => {
		const graph = new DirectedGraph([
			["A", ["B"]],
			["B", []]
		]);
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("B", "A")).toEqual(false);
	},
	"throws an error when nodes are connected to nodes not in the graph": () => {
		testing.assertThrows(() => {
			const graph = new DirectedGraph([
				["A", ["B"]], // A is connected to B, but B is not in the graph
			]);
		})
	},
	"throws an error if the array of nodes / connections contains duplicates": () => {
		testing.assertThrows(() => new DirectedGraph([
			["A", []],
			["B", []],
			["A", []]
		]));
	},
	"can create a graph from a list of nodes": () => {
		const graph = new DirectedGraph(["A", "B", "C"]);
		expect(graph.values()).toEqual(["A", "B", "C"]);
		expect(graph.areConnected("A", "B")).toEqual(false);
		expect(graph.areConnected("B", "A")).toEqual(false);
		expect(graph.areConnected("B", "C")).toEqual(false);
		expect(graph.areConnected("C", "B")).toEqual(false);
		expect(graph.areConnected("C", "A")).toEqual(false);
		expect(graph.areConnected("A", "C")).toEqual(false);
	},
	"throws an error if the list of nodes contains duplicates": () => {
		testing.assertThrows(() => new DirectedGraph(["A", "B", "A"]));
	},
	"can create a directed graph from another directed graph": () => {
		const graph1 = new DirectedGraph([
			["A", ["B"]], // A is connected to B and C
			["B", ["A"]], // B is connected to A
			["C", ["B"]]
		]);
		const graph2 = new DirectedGraph(graph1);
		expect(graph2).toNotStrictlyEqual(graph1);
		expect(graph2.values()).toEqual(["A", "B", "C"]);
		expect(graph2.areConnected("A", "B")).toEqual(true);
		expect(graph2.areConnected("A", "B")).toEqual(true);
		expect(graph2.areConnected("B", "C")).toEqual(false);
		expect(graph2.areConnected("C", "B")).toEqual(true);
		expect(graph2.areConnected("A", "C")).toEqual(false);
		expect(graph2.areConnected("C", "A")).toEqual(false);
	},
	"can create a directed graph from an undirected graph": () => {
		const graph = new Graph([
			["A", ["B"]],
			["B", ["A"]]
		]);
		const directedGraph = new DirectedGraph(graph);
		expect(directedGraph.values()).toEqual(["A", "B"]);
		expect(directedGraph.areConnected("A", "B")).toEqual(true);
		expect(directedGraph.areConnected("B", "A")).toEqual(true);
	},
	"can create a graph from a Grid object": () => {
		const grid = new Grid([
			["A", "B"],
			["C", "D"]
		]);
		const graph = new DirectedGraph(grid);
		expect(new Set(graph.values())).toEqual(new Set(["A", "B", "C", "D"]));
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("B", "A")).toEqual(true);
		expect(graph.areConnected("A", "C")).toEqual(true);
		expect(graph.areConnected("C", "A")).toEqual(true);
		expect(graph.areConnected("A", "D")).toEqual(false);
		expect(graph.areConnected("D", "A")).toEqual(false);
		expect(graph.areConnected("B", "C")).toEqual(false);
		expect(graph.areConnected("C", "B")).toEqual(false);
		expect(graph.areConnected("B", "D")).toEqual(true);
		expect(graph.areConnected("D", "B")).toEqual(true);
		expect(graph.areConnected("C", "D")).toEqual(true);
		expect(graph.areConnected("D", "C")).toEqual(true);
	},
	"throws an error when creating a graph from a Grid containing duplicate values": () => {
		const grid = new Grid([
			["A", "B"],
			["C", "A"]
		]);
		testing.assertThrows(() => new DirectedGraph(grid));
	}
});
testing.addUnit("DirectedGraph.has()", {
	"returns true when the value is in the graph": () => {
		const graph = new DirectedGraph(["A"]);
		expect(graph.has("A")).toEqual(true);
	},
	"returns false when the value is not in the graph": () => {
		const graph = new DirectedGraph(["A"]);
		expect(graph.has("B")).toEqual(false);
	}
});
testing.addUnit("DirectedGraph.add()", {
	"can add a value to the graph": () => {
		const graph = new DirectedGraph();
		graph.add("A");
		expect(graph.has("A")).toEqual(true);
	},
	"fails silently when the value is already in the graph": () => {
		const graph = new DirectedGraph([
			["A", []]
		]);
		graph.add("A");
		expect(graph.has("A")).toEqual(true);
	}
});
testing.addUnit("DirectedGraph.remove()", {
	"can remove a value from the graph": () => {
		const graph = new DirectedGraph([
			["A", []]
		]);
		graph.remove("A");
		expect(graph.has("A")).toEqual(false);
	},
	"fails silently when the value to remove is not in the graph": () => {
		const graph = new DirectedGraph();
		graph.remove("A");
		expect(graph.has("A")).toEqual(false);
	}
});
testing.addUnit("DirectedGraph.areConnected()", {
	"returns true when the nodes are connected": () => {
		const graph = new DirectedGraph([
			["A", ["B"]],
			["B", ["A"]]
		]);
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("B", "A")).toEqual(true);
	},
	"returns false when the nodes are not connected": () => {
		const graph = new DirectedGraph([
			["A", []],
			["B", []]
		]);
		expect(graph.areConnected("A", "B")).toEqual(false);
	},
	"returns the correct results for one-way connections": () => {
		const graph = new DirectedGraph([
			["A", ["B"]],
			["B", []]
		]);
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("B", "A")).toEqual(false);
	},
	"throws an error when either node is not in the graph": () => {
		const graph = new DirectedGraph([
			["A", []]
		]);
		testing.assertThrows(() => graph.areConnected("A", 123));
		testing.assertThrows(() => graph.areConnected(123, "A"));
	}
});
testing.addUnit("DirectedGraph.connect()", {
	"can connect two values in a graph": () => {
		const graph = new DirectedGraph(["A", "B"]);
		graph.connect("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("B", "A")).toEqual(false);
	},
	"fails silently when the values are already connected": () => {
		const graph = new DirectedGraph([
			["A", ["B"]],
			["B", ["A"]]
		]);
		graph.connect("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(true);
	},
	"throws an error when either node is not in the graph": () => {
		const graph = new DirectedGraph([
			["A", []]
		]);
		testing.assertThrows(() => graph.connect("A", 123));
		testing.assertThrows(() => graph.connect(123, "A"));
	}
});
testing.addUnit("DirectedGraph.disconnect()", {
	"can disconnect two nodes in a graph": () => {
		const graph = new DirectedGraph([
			["A", ["B"]],
			["B", ["A"]]
		]);
		graph.disconnect("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(false);
		expect(graph.areConnected("B", "A")).toEqual(true);
	},
	"fails silently when the values are already not connected": () => {
		const graph = new DirectedGraph([
			["A", []],
			["B", []]
		]);
		graph.disconnect("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(false);
		expect(graph.areConnected("B", "A")).toEqual(false);
	},
	"throws an error when either node is not in the graph": () => {
		const graph = new DirectedGraph([
			["A", []]
		]);
		testing.assertThrows(() => graph.disconnect("A", 123));
		testing.assertThrows(() => graph.disconnect(123, "A"));
	}
});

testing.addUnit("DirectedGraph.setConnection()", {
	"can connect two nodes in a graph": () => {
		const graph = new DirectedGraph(["A", "B"]);
		graph.setConnection("A", "B", true);
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("B", "A")).toEqual(false);
	},
	"can disconnect two nodes in a graph": () => {
		const graph = new DirectedGraph([["A", ["B"]], ["B", ["A"]]]);
		graph.setConnection("A", "B", false);
		expect(graph.areConnected("A", "B")).toEqual(false);
		expect(graph.areConnected("B", "A")).toEqual(true);
	},
	"fails silently when attempting to connect two already-connected nodes": () => {
		const graph = new DirectedGraph([["A", ["B"]], ["B", ["A"]]]);
		graph.setConnection("A", "B", true);
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("B", "A")).toEqual(true);
	},
	"fails silently when attempting to disconnect two already-disconnected nodes": () => {
		const graph = new DirectedGraph(["A", "B"]);
		graph.setConnection("A", "B", false);
		expect(graph.areConnected("A", "B")).toEqual(false);
		expect(graph.areConnected("B", "A")).toEqual(false);
	},
	"throws an error when attempting to connect nodes not in the graph": () => {
		const graph = new DirectedGraph(["A"]);
		testing.assertThrows(() => graph.setConnection("A", "B", true));
		testing.assertThrows(() => graph.setConnection("B", "A", true));
	},
	"throws an error when attempting to disconnect nodes not in the graph": () => {
		const graph = new DirectedGraph(["A", []]);
		testing.assertThrows(() => graph.setConnection("A", "B", false));
		testing.assertThrows(() => graph.setConnection("B", "A", false));
	},
});
testing.addUnit("DirectedGraph.toggleConnection()", {
	"can toggle a connection between two connected nodes": () => {
		const graph = new DirectedGraph([["A", ["B"]], ["B", ["A"]]]);
		graph.toggleConnection("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(false);
		expect(graph.areConnected("B", "A")).toEqual(true);
	},
	"can toggle a connection between two disconnected nodes": () => {
		const graph = new DirectedGraph(["A", "B"]);
		graph.toggleConnection("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("B", "A")).toEqual(false);
	},
	"throws an error when attempting to toggle connections between nonexistent nodes": () => {
		const graph = new DirectedGraph(["A"]);
		testing.assertThrows(() => graph.toggleConnection("A", "B"));
		testing.assertThrows(() => graph.toggleConnection("B", "A"));
	}
});
