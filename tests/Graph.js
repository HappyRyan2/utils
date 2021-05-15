testing.addUnit("Graph constructor", {
	"can create an empty graph when the constructor is called without arguments": () => {
		const graph = new Graph();
		expect(graph.size()).toEqual(0);
		expect(graph.values()).toEqual([]);
	},
	"can create a graph from a list of nodes with their connections": () => {
		const graph = new Graph([
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
	"throws an error when nodes are connected to nodes not in the graph": () => {
		testing.assertThrows(() => {
			const graph = new Graph([
				["A", ["B"]], // A is connected to B, but B is not in the graph
			]);
		})
	},
	"throws an error when nodes are not symmetrically connected": () => {
		testing.assertThrows(() => new Graph([
			["A", ["B"]], // A is connected to B...
			["B", []] // ... but B is not connected to A! Oh no!
		]));
	},
	"throws an error if the array of nodes / connections contains duplicates": () => {
		testing.assertThrows(() => new Graph([
			["A", []],
			["B", []],
			["A", []]
		]));
	},
	"can create a graph from a list of nodes": () => {
		const graph = new Graph(["A", "B", "C"]);
		expect(graph.values()).toEqual(["A", "B", "C"]);
		expect(graph.areConnected("A", "B")).toEqual(false);
		expect(graph.areConnected("B", "C")).toEqual(false);
		expect(graph.areConnected("C", "A")).toEqual(false);
	},
	"throws an error if the list of nodes contains duplicates": () => {
		testing.assertThrows(() => new Graph(["A", "B", "A"]));
	},
	"can create a graph from another graph": () => {
		const graph1 = new Graph([
			["A", ["B", "C"]], // A is connected to B and C
			["B", ["A"]], // B is connected to A
			["C", ["A"]], // C is connected to A
			["D", []] // D is not connected to anything
		]);
		const graph2 = new Graph(graph1);
		expect(graph1).toNotStrictlyEqual(graph2);
		expect(graph1.values()).toEqual(["A", "B", "C", "D"]);
		expect(graph1.areConnected("A", "B")).toEqual(true);
		expect(graph1.areConnected("A", "C")).toEqual(true);
		expect(graph1.areConnected("A", "D")).toEqual(false);
		expect(graph1.areConnected("B", "C")).toEqual(false);
		expect(graph1.areConnected("B", "D")).toEqual(false);
		expect(graph1.areConnected("C", "D")).toEqual(false);
	},
	"can create a graph from a Grid object": () => {
		const grid = new Grid([
			["A", "B"],
			["C", "D"]
		]);
		const graph = new Graph(grid);
		expect(new Set(graph.values())).toEqual(new Set(["A", "B", "C", "D"]));
		expect(graph.areConnected("A", "B")).toEqual(true);
		expect(graph.areConnected("A", "C")).toEqual(true);
		expect(graph.areConnected("A", "D")).toEqual(false);
		expect(graph.areConnected("B", "C")).toEqual(false);
		expect(graph.areConnected("B", "D")).toEqual(true);
		expect(graph.areConnected("C", "D")).toEqual(true);
	},
	"throws an error when creating a graph from a Grid containing duplicate values": () => {
		const grid = new Grid([
			["A", "B"],
			["C", "A"]
		]);
		testing.assertThrows(() => new Graph(grid));
	}
});
testing.addUnit("Graph.has()", {
	"returns true when the value is in the graph": () => {
		const graph = new Graph([
			["A", []],
		]);
		expect(graph.has("A")).toEqual(true);
	},
	"returns false when the value is not in the graph": () => {
		const graph = new Graph([
			["A", []],
		]);
		expect(graph.has("B")).toEqual(false);
	}
});
testing.addUnit("Graph.add()", {
	"can add a value to the graph": () => {
		const graph = new Graph();
		graph.add("A");
		expect(graph.has("A")).toEqual(true);
	},
	"value added by Graph.add() can be connected to other values": () => {
		// regression test
		const graph = new Graph(["A"]);
		graph.add("B");
		graph.connect("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(true);
	},
	"fails silently when the value is already in the graph": () => {
		const graph = new Graph([
			["A", []]
		]);
		graph.add("A");
		expect(graph.has("A")).toEqual(true);
	}
});
testing.addUnit("Graph.remove()", {
	"can remove a value from the graph": () => {
		const graph = new Graph([
			["A", []]
		]);
		graph.remove("A");
		expect(graph.has("A")).toEqual(false);
	},
	// TODO: this should fail silently
	"fails silently when the value to remove is not in the graph": () => {
		const graph = new Graph();
		graph.remove("A");
		expect(graph.has("A")).toEqual(false);
	}
});
testing.addUnit("Graph.areConnected()", {
	"returns true when the nodes are connected": () => {
		const graph = new Graph([
			["A", ["B"]],
			["B", ["A"]]
		]);
		expect(graph.areConnected("A", "B")).toEqual(true);
	},
	"returns false when the nodes are not connected": () => {
		const graph = new Graph([
			["A", []],
			["B", []]
		]);
		expect(graph.areConnected("A", "B")).toEqual(false);
	},
	"throws an error when either node is not in the graph": () => {
		const graph = new Graph([
			["A", []]
		]);
		testing.assertThrows(() => graph.areConnected("A", 123));
		testing.assertThrows(() => graph.areConnected(123, "A"));
	}
});
testing.addUnit("Graph.connect()", {
	"can connect two values in a graph": () => {
		const graph = new Graph([
			["A", []],
			["B", []]
		]);
		graph.connect("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(true);
	},
	"fails silently when the values are already connected": () => {
		const graph = new Graph([
			["A", ["B"]],
			["B", ["A"]]
		]);
		graph.connect("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(true);
	},
	"throws an error when either node is not in the graph": () => {
		const graph = new Graph([
			["A", []]
		]);
		testing.assertThrows(() => graph.connect("A", 123));
		testing.assertThrows(() => graph.connect(123, "A"));
	}
});
testing.addUnit("Graph.disconnect()", {
	"can disconnect two nodes in a graph": () => {
		const graph = new Graph([
			["A", ["B"]],
			["B", ["A"]]
		]);
		graph.disconnect("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(false);
	},
	"fails silently when the values are already not connected": () => {
		const graph = new Graph([
			["A", []],
			["B", []]
		]);
		graph.disconnect("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(false);
	},
	"throws an error when either node is not in the graph": () => {
		const graph = new Graph([
			["A", []]
		]);
		testing.assertThrows(() => graph.disconnect("A", 123));
		testing.assertThrows(() => graph.disconnect(123, "A"));
	}
});

testing.addUnit("Graph.setConnection()", {
	"can connect two nodes in a graph": () => {
		const graph = new Graph([["A", []], ["B", []]]);
		expect(graph.areConnected("A", "B")).toEqual(false);
		graph.setConnection("A", "B", true);
		expect(graph.areConnected("A", "B")).toEqual(true);
	},
	"can disconnect two nodes in a graph": () => {
		const graph = new Graph([["A", ["B"]], ["B", ["A"]]]);
		expect(graph.areConnected("A", "B")).toEqual(true);
		graph.setConnection("A", "B", false);
		expect(graph.areConnected("A", "B")).toEqual(false);
	},
	"fails silently when attempting to connect two already-connected nodes": () => {
		const graph = new Graph([["A", ["B"]], ["B", ["A"]]]);
		expect(graph.areConnected("A", "B")).toEqual(true);
		graph.setConnection("A", "B", true);
		expect(graph.areConnected("A", "B")).toEqual(true);
	},
	"fails silently when attempting to disconnect two already-disconnected nodes": () => {
		const graph = new Graph([["A", []], ["B", []]]);
		expect(graph.areConnected("A", "B")).toEqual(false);
		graph.setConnection("A", "B", false);
		expect(graph.areConnected("A", "B")).toEqual(false);
	},
	"throws an error when attempting to connect nodes not in the graph": () => {
		const graph = new Graph(["A", []]);
		testing.assertThrows(() => graph.setConnection("A", "B", true));
		testing.assertThrows(() => graph.setConnection("B", "A", true));
	},
	"throws an error when attempting to disconnect nodes not in the graph": () => {
		const graph = new Graph(["A", []]);
		testing.assertThrows(() => graph.setConnection("A", "B", false));
		testing.assertThrows(() => graph.setConnection("B", "A", false));
	},
});
testing.addUnit("Graph.toggleConnection()", {
	"can toggle a connection between two connected nodes": () => {
		const graph = new Graph([["A", ["B"]], ["B", ["A"]]]);
		expect(graph.areConnected("A", "B")).toEqual(true);
		graph.toggleConnection("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(false);
	},
	"can toggle a connection between two disconnected nodes": () => {
		const graph = new Graph([["A", []], ["B", []]]);
		expect(graph.areConnected("A", "B")).toEqual(false);
		graph.toggleConnection("A", "B");
		expect(graph.areConnected("A", "B")).toEqual(true);
	},
	"throws an error when attempting to toggle connections between nonexistent nodes": () => {
		const graph = new Graph([["A", []]]);
		testing.assertThrows(() => graph.toggleConnection("A", "B"));
		testing.assertThrows(() => graph.toggleConnection("B", "A"));
	}
});

testing.addUnit("Graph.size()", {
	"returns the number of nodes in the graph": () => {
		const graph = new Graph([["A", []], ["B", []], ["C", []]]);
		expect(graph.size()).toEqual(3);
	}
});

testing.addUnit("Graph.values()", {
	"returns a list of the values in the graph": () => {
		const graph = new Graph([["A", []], ["B", []], ["C", []]]);
		expect(graph.values()).toEqual(["A", "B", "C"]);
	}
});
