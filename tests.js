testing.addUnit("Array.repeat()", [
	() => {
		const result = [1, 2].repeat(3);
		expect(result).toEqual([1, 2, 1, 2, 1, 2]);
	}
]);
testing.addUnit("Array.subArrays()", [
	() => {
		const result = [1, 2, 3].subArrays();
		expect(result).toEqual(new Set([
			[],
			[1],
			[2],
			[3],
			[1, 2],
			[2, 3],
			[1, 2, 3]
		]));
	}
]);
testing.addUnit("Array.partitions()", [
	() => {
		const result = [1].partitions();
		expect(result).toEqual(new Set([
			[[1]]
		]));
	},
	() => {
		const result = [1, 2, 3].partitions();
		expect(result).toEqual(new Set([
			[[1, 2, 3]],
			[[1, 2], [3]],
			[[1], [2, 3]],
			[[1], [2], [3]]
		]));
	}
]);
testing.addUnit("Array.sum()", {
	"basic usage": () => {
		const result = [1, 2, 3, 4].sum();
		expect(result).toEqual(1 + 2 + 3 + 4);
	},
	"works when a callback is provided": () => {
		const result = [1, 2, 3, 4].sum(v => v * v);
		expect(result).toEqual(1 + 4 + 9 + 16);
	}
});
testing.addUnit("Array.product()", {
	"basic usage": () => {
		const result = [1, 2, 3, 4].product();
		expect(typeof result).toEqual("number");
		expect(result).toEqual(1 * 2 * 3 * 4);
	},
	"works when a callback is provided": () => {
		const result = [1, 2, 3, 4].product(v => v + 10);
		expect(typeof result).toEqual("number");
		expect(result).toEqual(11 * 12 * 13 * 14);
	},
	"returns a BigInt when the array is entirely BigInts": () => {
		const result = [1n, 2n, 3n].product();
		expect(typeof result).toEqual("bigint");
		expect(result).toEqual(6n);
	},
	"returns a BigInt when the array contains a mix of BigInts and regular numbers": () => {
		const result = [1n, 2, 3n, 4].product();
		expect(typeof result).toEqual("bigint");
		expect(result).toEqual(24n);
	},
	"returns a BigInt when the callback returns only BigInts": () => {
		const result = [1n, 2n, 3n, 4n].product(v => v + 10n);
		expect(typeof result).toEqual("bigint");
		expect(result).toEqual(11n * 12n * 13n * 14n);
	},
	"returns a BigInt when the callback returns a mix of BigInts and regular numbers": () => {
		const result = [1, 2n, 3].product(v => v);
		expect(typeof result).toEqual("bigint");
		expect(result).toEqual(6n);
	}
});
testing.addUnit("Array.min()", {
	"can find the minimum of an array of numbers": () => {
		const result = [1, 2, 3, 2, 1].min();
		expect(result).toEqual(1);
	},
	"works when a callback is passed in": () => {
		const result = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.min(v => v.x)
		);
		expect(result).toEqual({x: 1});
	},
	"can return the minimum output of the callback": () => {
		const minOutput = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.min(v => v.x, null, "value")
		);
		expect(minOutput).toEqual(1);
	},
	"can return the index of the minimum item": () => {
		const index = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.min(v => v.x, null, "index")
		);
		expect(index).toEqual(0);
	},
	"can return the item, the minimum value, and the index": () => {
		const [object, index, value] = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.min(v => v.x, null, "all")
		);
		expect(object).toEqual({x: 1});
		expect(index).toEqual(0);
		expect(value).toEqual(1);
	}
});
testing.addUnit("Array.max()", {
	"can find the maximum of an array of numbers": () => {
		const result = [1, 2, 3, 2, 1].max();
		expect(result).toEqual(3);
	},
	"works when a callback is passed in": () => {
		const result = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.max(v => v.x)
		);
		expect(result).toEqual({x: 3});
	},
	"can return the maximum output of the callback": () => {
		const minOutput = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.max(v => v.x, null, "value")
		);
		expect(minOutput).toEqual(3);
	},
	"can return the index of the maximum item": () => {
		const index = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.max(v => v.x, null, "index")
		);
		expect(index).toEqual(2);
	},
	"can return the item, the maximum value, and the index": () => {
		const [object, index, value] = (
			[{x: 1}, {x: 2}, {x: 3}, {x: 2}, {x: 1}]
			.max(v => v.x, null, "all")
		);
		expect(object).toEqual({x: 3});
		expect(index).toEqual(2);
		expect(value).toEqual(3);
	}
});
testing.addUnit("Array.permutations()", {
	"basic functionality works": () => {
		const permutations = [1, 2, 3].permutations();
		expect(permutations).toEqual(new Set([
			[1, 2, 3],
			[1, 3, 2],
			[2, 1, 3],
			[2, 3, 1],
			[3, 1, 2],
			[3, 2, 1]
		]));
	},
	"works for arrays with duplicate elements": () => {
		const permutations = [1, 2, 2].permutations();
		expect(permutations).toEqual(new Set([
			[1, 2, 2],
			[2, 1, 2],
			[2, 2, 1]
		]));
	},
	"works for arrays with multiple duplicate elements": () => {
		const permutations = [1, 1, 2, 2].permutations();
		expect(permutations).toEqual(new Set([
			[1, 1, 2, 2],
			[1, 2, 2, 1],
			[1, 2, 1, 2],
			[2, 1, 2, 1],
			[2, 1, 1, 2],
			[2, 2, 1, 1],
		]));
	}
});

testing.addUnit("Function.memoize()", {
	"works for arguments that can be stringified": () => {
		let timesRun = 0;
		const increment = (num => {
			timesRun ++;
			return num + 1;
		}).memoize(true);

		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(timesRun).toEqual(1);

		expect(increment(2)).toEqual(3);
		expect(increment(2)).toEqual(3);
		expect(increment(2)).toEqual(3);
		expect(timesRun).toEqual(2);
	},
	"works for arguments that cannot be stringified without information loss": () => {
		let timesRun = 0;
		const myFunction = (argument => {
			timesRun ++;
			return argument.foo;
		}).memoize(false);
		let myObject1 = { foo: "bar" };
		let myObject2 = { foo: "qux" };

		expect(myFunction(myObject1)).toEqual("bar");
		expect(myFunction(myObject1)).toEqual("bar");
		expect(myFunction(myObject1)).toEqual("bar");
		expect(timesRun).toEqual(1);

		expect(myFunction(myObject2)).toEqual("qux");
		expect(myFunction(myObject2)).toEqual("qux");
		expect(myFunction(myObject2)).toEqual("qux");
		expect(timesRun).toEqual(2);
	},
	"can return a clone of the output": () => {
		let timesRun = 0;
		const myFunction = (argument => {
			timesRun ++;
			return [argument, argument + 1];
		}).memoize(true, true);

		const result1 = myFunction(1);
		expect(result1).toEqual([1, 2]);
		const result2 = myFunction(1);
		expect(result2).toEqual([1, 2]);
		const result3 = myFunction(1);
		expect(result2).toEqual([1, 2]);
		expect(timesRun).toEqual(1);
		expect(result1).toNotStrictlyEqual(result2);
		expect(result2).toNotStrictlyEqual(result3);
	}
});

testing.addUnit("Map.equals()", {
	"returns true for Map objects that are equal": () => {
		const obj1 = new Map([[1, 2], [3, 4]]);
		const obj2 = new Map([[1, 2], [3, 4]]);
		testing.assert(obj1.equals(obj2));
		testing.assert(obj2.equals(obj1));
	},
	"returns false for Map objects that are not equal": () => {
		const obj1 = new Map([[1, 2], [3, 4]]);
		const obj2 = new Map([[1, 2], [3, 5]]);
		testing.refute(obj1.equals(obj2));
		testing.refute(obj2.equals(obj1));
	}
});

testing.addUnit("Math.logBase()", {
	"basic functionality - test case 1": () => {
		const result = Math.logBase(10, 1000);
		expect(result).toApproximatelyEqual(3);
	},
	"basic functionality - test case 2": () => {
		const result = Math.logBase(2, 128);
		expect(result).toApproximatelyEqual(7);
	},
	"works for non-integer results": () => {
		const result = Math.logBase(2, 10);
		expect(result).toApproximatelyEqual(Math.log2(10));
	}
});
testing.addUnit("Math.divisors()", {
	"returns the correct result for n=1": () => {
		expect(Math.divisors(1)).toEqual([1]);
	},
	"returns the correct result for n=12": () => {
		expect(Math.divisors(12)).toEqual([1, 2, 3, 4, 6, 12]);
	},
	"returns the correct result for n=19 (a prime)": () => {
		expect(Math.divisors(19)).toEqual([1, 19]);
	},
	"returns the correct result for n=36 (a perfect square)": () => {
		expect(Math.divisors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18, 36]);
	}
});
testing.addUnit("Math.factorize()", {
	"can return a list of factors - test case 1": () => {
		const result = Math.factorize(300);
		expect(result).toEqual([2, 2, 3, 5, 5]);
	},
	"can return a list of factors - test case 2": () => {
		const result = Math.factorize(1188);
		expect(result).toEqual([2, 2, 3, 3, 3, 11]);
	},
	"can return an object containing the exponent on each prime": () => {
		const result = Math.factorize(300, "prime-exponents");
		expect(result).toEqual({ 2: 2, 3: 1, 5: 2 });
	}
});
testing.addUnit("Math.gcd()", {
	"correctly returns the GCD of 2 numbers": () => {
		const result = Math.gcd(100, 70);
		expect(result).toEqual(10);
	},
	"correctly returns the GCD of 3 or more numbers": () => {
		const result = Math.gcd(95, 115, 155);
		expect(result).toEqual(5);
	}
});
testing.addUnit("Math.areCoprime()", {
	"returns true for coprime integers": () => {
		expect(Math.areCoprime(15, 77)).toEqual(true);
	},
	"returns false for non-coprime integers": () => {
		expect(Math.areCoprime(14, 35)).toEqual(false);
	}
});
testing.addUnit("Math.isPrime()", Math.isPrime, [
	[1, false],
	[2, true],
	[3, true],
	[4, false],
	[5, true],
	[6, false],
	[7, true],
	[8, false],
	[9, false],
	[10, false]
]);

testing.addUnit("Number.digits()", {
	"correctly returns the digits of the number": () => {
		expect((1232).digits()).toEqual([1, 2, 3, 2]);
	},
	"works for negative numbers": () => {
		expect((-1232).digits()).toEqual([1, 2, 3, 2]);
	},
	"throws an error when called on a non-integer": () => {
		expect(() => (1.23).digits()).toThrow();
	}
});

testing.addUnit("Object.clone()", {
	"basic functionality works": () => {
		const myObject = { foo: "bar" };
		const cloned = myObject.clone();
		expect(Object.keys(cloned).length).toEqual(1);
		expect(cloned.foo).toEqual("bar");
	},
	"works for nested objects": () => {
		const myObject = { prop1: { prop2: "foo" } };
		const cloned = myObject.clone();

		expect(Object.keys(cloned).length).toEqual(1);
		expect(cloned.prop1).toInstantiate(Object);
		expect(Object.keys(cloned.prop1).length).toEqual(1);
		expect(cloned.prop1.prop2).toEqual("foo");
	}
});
testing.addUnit("Object.equals()", {
	"returns true for objects that are references to each other": () => {
		const obj1 = { foo: "bar" };
		const obj2 = obj1;
		testing.assert(obj1.equals(obj2));
		testing.assert(obj2.equals(obj1));
	},
	"returns true for non-reference objects with identical properties": () => {
		const obj1 = { foo: "bar" };
		const obj2 = { foo: "bar" };
		testing.assert(obj1.equals(obj2));
		testing.assert(obj2.equals(obj1));
	},
	"returns true for identical non-reference nested objects": () => {
		const obj1 = { prop1: { prop2: { prop3: "foo" }}};
		const obj2 = { prop1: { prop2: { prop3: "foo" }}};
		testing.assert(obj1.equals(obj2));
		testing.assert(obj2.equals(obj1));
	},
	"returns true for identical non-reference cyclic objects": () => {
		const obj1 = { foo: "bar" };
		obj1.self = obj1; // obj1 is now a cyclic (infinitely deep) object
		const obj2 = { foo: "bar" };
		obj2.self = obj2; // obj2 is now a cyclic (infinitely deep) object
		testing.assert(obj1.equals(obj2));
		testing.assert(obj2.equals(obj1));
	},
	"returns true for primitive values that are equal": () => {
		testing.assert((1).equals(1));
		testing.assert((1).equals(new Number(1)));
		testing.assert((new Number(1)).equals(1));
		testing.assert((new Number(1)).equals(new Number(1)));
		testing.assert((true).equals(true));
		testing.assert((false).equals(false));
		testing.assert((NaN).equals(NaN));
	},
	"returns false for objects with different property values": () => {
		const obj1 = { prop1: { prop2: { prop3: "foo" }}};
		const obj2 = { prop1: { prop2: { prop3: "bar" }}};
		testing.refute(obj1.equals(obj2));
		testing.refute(obj2.equals(obj1));
	},
	"returns false when two objects have different numbers of properties": () => {
		const obj1 = { foo: "bar" };
		const obj2 = { foo: "bar", baz: "qux" };
		testing.refute(obj1.equals(obj2));
		testing.refute(obj2.equals(obj1));
	},
	"returns false for objects that are instances of different classes - test case 1": () => {
		const obj1 = {};
		const obj2 = [];
		testing.refute(obj1.equals(obj2));
		testing.refute(obj2.equals(obj1));
	},
	"returns false for objects that are instances of different classes - test case 2": () => {
		class Foo {};
		class Bar {};
		const foo = new Foo();
		const bar = new Bar();
		testing.refute(foo.equals(bar));
		testing.refute(bar.equals(foo));
	},
	"returns false for non-identical non-reference cyclic objects": () => {
		const obj1 = { foo: "bar" };
		obj1.self = obj1; // obj1 is now a cyclic (infinitely deep) object
		const obj2 = { baz: "qux" };
		obj2.self = obj2; // obj2 is now a cyclic (infinitely deep) object
		testing.refute(obj1.equals(obj2));
		testing.refute(obj2.equals(obj1));
	},
	"returns false for primitive values that are not equal": () => {
		testing.refute((1).equals(2));
		testing.refute((2).equals(1));

		testing.refute((1).equals(true));
		testing.refute((true).equals(1));

		testing.refute((true).equals(false));
		testing.refute((false).equals(true));

		testing.refute((1).equals(null));
		testing.refute((false).equals(null));

		testing.refute((1).equals(undefined));
		testing.refute((false).equals(undefined));
	}
});
testing.addUnit("Object.watch()", {
	"runs the callback when the property is changed": () => {
		const myObj = { foo: "bar" };
		let arg1, arg2, arg3;
		myObj.watch("foo", (obj, prop, value) => {
			arg1 = obj;
			arg2 = prop;
			arg3 = value;
		});
		expect(myObj.foo).toEqual("bar");
		myObj.foo = "qux";
		expect(myObj.foo).toEqual("qux");
		expect(arg1).toStrictlyEqual(myObj);
		expect(arg2).toEqual("foo");
		expect(arg3).toEqual("qux");
	},
	"works when there are already getters and setters for the property": () => {
		let getterRun = false;
		let setterRun = false;
		let value = "bar";
		const myObj = {
			get foo() { getterRun = true; return value; },
			set foo(newValue) { setterRun = true; value = newValue; }
		};
		let arg1, arg2, arg3;
		myObj.watch("foo", (obj, prop, value) => {
			arg1 = obj;
			arg2 = prop;
			arg3 = value;
		});
		setterRun = false;
		myObj.foo = "bar";
		getterRun = false;
		expect(myObj.foo).toEqual("bar");
		expect(arg1).toStrictlyEqual(myObj);
		expect(arg2).toEqual("foo");
		expect(arg3).toEqual("bar");
		expect(setterRun).toEqual(true);
		expect(getterRun).toEqual(true);
	}
});

testing.addUnit("Set.equals()", [
	(a, b) => new Set(a).equals(new Set(b)),
	[[1, 2, 3], [1, 2, 3], true],
	[[3, 1, 2], [2, 1, 3], true],
	[[1, 2, 3], [4, 5, 6], false],
	[[1, 2, 3], [1], false],
	[[1], [1, 2, 3], false],
	[[new Set(), new Set()], [new Set(), new Set()], true],
	[new Set([{}]), new Set([null]), false],
]);
testing.addUnit("Set.union()", [
	(a, b) => new Set(a).union(new Set(b)),
	[[1, 2, 3], [3, 4, 5], new Set([1, 2, 3, 4, 5])],
	[[1, 2], [3, 4], new Set([1, 2, 3, 4])]
]);
testing.addUnit("Set.intersection()", [
	(a, b) => new Set(a).intersection(new Set(b)),
	[[1, 2, 3], [3, 4, 5], new Set([3])],
	[[1, 2], [3, 4], new Set([])]
]);
testing.addUnit("Set.difference()", [
	(a, b) => new Set(a).difference(new Set(b)),
	[[1, 2, 3], [3, 4, 5], new Set([1, 2])],
	[[1, 2], [3, 4], new Set([1, 2])]
]);
testing.addUnit("Set.subsets()", [
	(set) => set.subsets(),
	[
		new Set([]),
		new Set([
			new Set([])
		])
	],
	[
		new Set(["A"]),
		new Set([
			new Set([]),
			new Set(["A"])
		])
	],
	[
		new Set([1, 2]),
		new Set([
			new Set([]),
			new Set([1]),
			new Set([2]),
			new Set([1, 2])
		])
	]
]);
testing.addUnit("Set.cartesianProduct()", Set.cartesianProduct, [
	[
		new Set(["foo", "bar"]),

		new Set([
			["foo"],
			["bar"]
		])
	],
	[
		new Set([1, 2]),
		new Set(["a", "b"]),

		new Set([
			[1, "a"],
			[1, "b"],
			[2, "a"],
			[2, "b"]
		])
	],
	[
		new Set([1, 2]),
		new Set(["a", "b"]),
		new Set([true, false]),

		new Set([
			[1, "a", true],
			[1, "a", false],
			[1, "b", true],
			[1, "b", false],
			[2, "a", true],
			[2, "a", false],
			[2, "b", true],
			[2, "b", false],
		])
	],
	[
		new Set(["foo", "bar"]),
		new Set([1, 2, 3, 4]),
		new Set([true, false]),

		new Set([
			["foo", 1, true],
			["foo", 1, false],
			["foo", 2, true],
			["foo", 2, false],
			["foo", 3, true],
			["foo", 3, false],
			["foo", 4, true],
			["foo", 4, false],
			["bar", 1, true],
			["bar", 1, false],
			["bar", 2, true],
			["bar", 2, false],
			["bar", 3, true],
			["bar", 3, false],
			["bar", 4, true],
			["bar", 4, false],
		])
	]
]);
testing.addUnit("Set.cartesianProductGenerator()", [
	() => {
		const set1 = new Set(["a", "b"]);
		const set2 = new Set(["c", "d"]);
		const product = new Set([]);
		for(const combination of Set.cartesianProductGenerator(set1, set2)) {
			product.add(combination);
		}
		expect(product).toEqual(Set.cartesianProduct(set1, set2));
	},
	() => {
		const set1 = new Set(["a", "b"]);
		const product = new Set([]);
		for(const combination of Set.cartesianProductGenerator(set1)) {
			product.add(combination);
		}
		expect(product).toEqual(Set.cartesianProduct(set1));
	}
]);

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
testing.addUnit("DirectedGraph iteration", {
	"correctly iterates through all nodes of the graph": () => {
		const graph = new DirectedGraph([1, 2, 3]);
		const values = [];
		for(const value of graph) { values.push(value); }
		expect(values.length).toEqual(3);
		expect(values.sort()).toEqual([1, 2, 3].sort());
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
testing.addUnit("DirectedGraph.setConnections()", {
	"allows setting connections in the graph with a callback": () => {
		const graph = new DirectedGraph([-1, -2, 1, 2]);
		graph.setConnections((a, b) => a < 0 === b < 0 && a !== b);
		const connections = graph.connections();
		expect(new Set(connections)).toEqual(new Set([
			[-1, -2],
			[-2, -1],
			[1, 2],
			[2, 1]
		]));
	}
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

testing.addUnit("DirectedGraph.paths()", {
	"works for acyclic graphs": () => {
		const graph = new DirectedGraph([
			["S", ["1A", "1B"]],
			["1A", ["1"]],
			["1B", ["1"]],
			["1", ["2A", "2B"]],
			["2A", ["2"]],
			["2B", ["2"]],
			["2", ["F"]],
			["F", []]
		]);
		const paths = graph.paths(["S"], ["F"], 5);
		expect(paths).toEqual(new Set([
			["S", "1A", "1", "2A", "2", "F"],
			["S", "1B", "1", "2A", "2", "F"],
			["S", "1A", "1", "2B", "2", "F"],
			["S", "1B", "1", "2B", "2", "F"]
		]));
	},
	"works for cyclic graphs": () => {
		const graph = new DirectedGraph([
			["S", ["1"]],
			["1", ["S", "F"]],
			["F", []]
		]);
		const paths = graph.paths(["S"], ["F"], 10);
		expect(paths).toEqual(new Set([
			["S", "1", "S", "1", "S", "1", "S", "1", "S", "1", "F"]
		]));
	},
	"works when there are multiple starting nodes": () => {
		const graph = new DirectedGraph([
			["S1", ["A"]],
			["S2", ["A"]],
			["A", ["F"]],
			["F", []]
		]);
		const paths = graph.paths(["S1", "S2"], ["F"], 2);
		expect(paths).toEqual(new Set([
			["S1", "A", "F"],
			["S2", "A", "F"]
		]));
	},
	"works when there are multiple ending nodes": () => {
		const graph = new DirectedGraph([
			["S", ["F1", "F2", "F3"]],
			["F1", []],
			["F2", []],
			["F3", []],
		]);
		const paths = graph.paths(["S"], ["F1", "F2", "F3"], 1);
		expect(paths).toEqual(new Set([
			["S", "F1"],
			["S", "F2"],
			["S", "F3"]
		]));
	},
	"works when there are multiple starting and ending nodes": () => {
		const graph = new DirectedGraph([
			["S1", ["A"]],
			["S2", ["A"]],
			["A", ["F1", "F2"]],
			["F1", []],
			["F2", []],
		]);
		const paths = graph.paths(["S1", "S2"], ["F1", "F2"], 2);
		expect(paths).toEqual(new Set([
			["S1", "A", "F1"],
			["S1", "A", "F2"],
			["S2", "A", "F1"],
			["S2", "A", "F2"],
		]));
	},
	"works when there is no path of the given length": () => {
		const graph = new DirectedGraph([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["D"]],
			["D", []]
		]);
		const paths = graph.paths(["A"], ["D"], 7392);
		expect(paths).toEqual(new Set());
	},
	"works when there is no path between the nodes": () => {
		const graph = new DirectedGraph([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["A"]],
			["D", ["E"]],
			["E", ["D"]]
		]);
		const paths = graph.paths(["A"], ["E"], 5);
		expect(paths).toEqual(new Set());
	}
});
testing.addUnit("DirectedGraph.pathExists()", {
	"returns true when a path exists in an acyclic graph": () => {
		const graph = new DirectedGraph([
			["S", ["1"]],
			["1", ["2"]],
			["2", ["3"]],
			["3", ["F"]],
			["F", []]
		]);
		const exists = graph.pathExists(["S"], ["F"], 4);
		expect(exists).toEqual(true);
	},
	"returns true when a path exists in a cyclic graph": () => {
		const graph = new DirectedGraph([
			["S", ["1"]],
			["1", ["F"]],
			["F", ["S"]]
		]);
		const exists = graph.pathExists(["S"], ["F"], 302);
		expect(exists).toEqual(true);
	},
	"returns false when a path of the given length does not exist in an acyclic graph": () => {
		const graph = new DirectedGraph([
			["S", ["1"]],
			["1", ["2"]],
			["2", ["3"]],
			["3", ["F"]],
			["F", []]
		]);
		const exists = graph.pathExists(["S"], ["F"], 5);
		expect(exists).toEqual(false);
	},
	"returns false when a path of the given length does not exist in a cyclic graph": () => {
		const graph = new DirectedGraph([
			["S", ["1"]],
			["1", ["F"]],
			["F", ["S"]]
		]);
		const exists = graph.pathExists(["S"], ["F"], 304);
		expect(exists).toEqual(false);
	}
});
testing.addUnit("DirectedGraph.numPaths()", {
	"works for an acyclic graph with a single path": () => {
		const graph = new DirectedGraph([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["D"]],
			["D", []]
		]);
		const paths = graph.numPaths(["A"], ["D"], 3);
		expect(paths).toEqual(1);
	},
	"works for an acyclic graph with multiple paths": () => {
		const graph = new DirectedGraph([
			["S", ["1A", "1B"]],
			["1A", ["1"]],
			["1B", ["1"]],
			["1", ["2A", "2B"]],
			["2A", ["2"]],
			["2B", ["2"]],
			["2", ["F"]],
			["F", []]
		]);
		const paths = graph.numPaths(["S"], ["F"], 5);
		expect(paths).toEqual(4);
	},
	"works for a cyclic graph with a single path": () => {
		const graph = new DirectedGraph([
			["A", ["B"]],
			["B", ["A", "C"]],
			["C", []]
		]);
		const paths = graph.numPaths(["A"], ["C"], 152);
		expect(paths).toEqual(1);
	},
	"works for a cyclic graph with multiple paths": () => {
		const graph = new DirectedGraph([
			["S", ["A", "B"]],
			["A", ["F"]],
			["B", ["F"]],
			["F", ["S"]]
		]);
		const paths = graph.numPaths(["S"], ["F"], 11);
		expect(paths).toEqual(16);
	},
	"works when there are multiple starting nodes": () => {
		const graph = new DirectedGraph([
			["S", ["F1", "F2"]],
			["F1", []],
			["F2", []]
		]);
		const paths = graph.numPaths(["S"], ["F1", "F2"], 1);
		expect(paths).toEqual(2);
	},
	"works when there are multiple starting nodes": () => {
		const graph = new DirectedGraph([
			["S1", ["F"]],
			["S2", ["F"]],
			["F", []]
		]);
		const paths = graph.numPaths(["S1", "S2"], ["F"], 1);
		expect(paths).toEqual(2);
	},
	"works when there are multiple starting and ending nodes": () => {
		const graph = new DirectedGraph([
			["S1", ["A", "B"]],
			["S2", ["A", "B"]],
			["A", ["F1"]],
			["B", ["F2"]],
			["F1", []],
			["F2", []]
		]);
		const paths = graph.numPaths(["S1", "S2"], ["F1", "F2"], 2);
		expect(paths).toEqual(4);
	}
});

testing.addUnit("DirectedGraph.connections()", {
	"returns an array containing all connections in the graph": () => {
		const graph = new DirectedGraph(["A", "B", "C", "D", "E"]);
		graph.connect("A", "B");
		graph.connect("C", "C");
		graph.connect("D", "E");
		graph.connect("E", "D");
		expect(new Set(graph.connections())).toEqual(new Set([
			["A", "B"],
			["C", "C"],
			["D", "E"],
			["E", "D"]
		]));
	}
});

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
testing.addUnit("Graph iteration", {
	"correctly iterates through all nodes of the graph": () => {
		const graph = new Graph([1, 2, 3]);
		const values = [];
		for(const value of graph) { values.push(value); }
		expect(values.length).toEqual(3);
		expect(values.sort()).toEqual([1, 2, 3].sort());
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
testing.addUnit("Graph.setConnections()", {
	"allows setting connections in the graph with a callback": () => {
		const graph = new Graph([-1, -2, 1, 2]);
		graph.setConnections((a, b) => a < 0 === b < 0 && a !== b);
		const connections = new Set(graph.connections().map(c => new Set(c)));
		expect(connections).toEqual(new Set([
			new Set([-1, -2]),
			new Set([1, 2])
		]));
	}
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
testing.addUnit("Graph.connections()", {
	"returns an array containing all connections in the graph": () => {
		const graph = new Graph(["A", "B", "C", "D", "E"]);
		graph.connect("A", "B");
		graph.connect("D", "E");
		const connections = graph.connections();

		const connectionSet = new Set(connections.map(c => new Set(c)));
		expect(connectionSet).toEqual(new Set([
			new Set(["A", "B"]),
			new Set(["D", "E"])
		]));
	}
});

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

testing.addUnit("Sequence constructor", {
	"can create a sequence from a generator function": () => {
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i += 10) {
				yield i;
			}
		});
		const terms = [];
		for(const number of sequence) {
			terms.push(number);
			if(terms.length >= 5) { break; }
		}
		expect(terms).toEqual([0, 10, 20, 30, 40]);
	},
	"can create a sequence from an nth-term formula": () => {
		const sequence = new Sequence(n => n * 10);
		const terms = [];
		for(const number of sequence) {
			terms.push(number);
			if(terms.length >= 5) { break; }
		}
		expect(terms).toEqual([0, 10, 20, 30, 40]);
	}
});
testing.addUnit("Sequence iteration", {
	"correctly iterates through sequence": () => {
		const positiveIntegers = new Sequence(function*() {
			for(let i = 1; i < Infinity; i ++) { yield i; }
		});
		const sequenceItems = [];
		for(const number of positiveIntegers) {
			sequenceItems.push(number);
			if(sequenceItems.length >= 5) { break; }
		}
		expect(sequenceItems).toEqual([1, 2, 3, 4, 5]);
	},
	"correctly caches terms when creating a sequence from a generator function": () => {
		let termsCalculated = 0;
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i ++) {
				termsCalculated ++;
				yield i;
			}
		});

		let i = 0;
		const terms1 = [];
		for(const term of sequence) {
			terms1.push(term);
			i ++;
			if(i >= 10) { break; }
		}
		expect(terms1).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		expect(termsCalculated).toEqual(10);

		i = 0;
		const terms2 = [];
		for(const term of sequence) {
			terms2.push(term);
			i ++;
			if(i >= 5) { break; }
		}
		expect(terms2).toEqual([0, 1, 2, 3, 4]);
		expect(termsCalculated).toEqual(10);
	},
	"correctly caches terms when creating a sequence from an nth-term formula": () => {
		let termsCalculated = 0;
		const sequence = new Sequence(index => {
			termsCalculated ++;
			return index;
		});

		let i = 0;
		const terms1 = [];
		for(const term of sequence) {
			terms1.push(term);
			i ++;
			if(i >= 10) { break; }
		}
		expect(terms1).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		expect(termsCalculated).toEqual(10);

		i = 0;
		const terms2 = [];
		for(const term of sequence) {
			terms2.push(term);
			i ++;
			if(i >= 5) { break; }
		}
		expect(terms2).toEqual([0, 1, 2, 3, 4]);
		expect(termsCalculated).toEqual(10);
	}
});
testing.addUnit("Sequence.slice()", {
	"works for finite subsequences with nth-term formulas": () => {
		const sequence = new Sequence(n => n * 10); // {0, 10, 20, 30, ...}
		const sliced = sequence.slice(0, 5);
		expect(sliced).toEqual([0, 10, 20, 30, 40]);
	},
	"works for infinite subsequences with nth-term formulas": () => {
		const sequence = new Sequence(n => n * 10); // {0, 10, 20, 30, ...}
		const sliced = sequence.slice(5, Infinity);
		const terms = [];
		for(const term of sliced) {
			terms.push(term);
			if(terms.length >= 5) { break; }
		}
		expect(terms).toEqual([50, 60, 70, 80, 90]);
	},
	"works for finite subsequences without nth-term formulas": () => {
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i += 10) { yield i; }
		}); // {0, 10, 20, 30, ...}
		const sliced = sequence.slice(0, 5);
		expect(sliced).toEqual([0, 10, 20, 30, 40]);
	},
	"works for infinite sequences without nth-term formulas": () => {
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i += 10) { yield i; }
		}); // {0, 10, 20, 30, ...}
		const sliced = sequence.slice(5, Infinity);
		const terms = [];
		for(const term of sliced) {
			terms.push(term);
			if(terms.length >= 5) { break; }
		}
		expect(terms).toEqual([50, 60, 70, 80, 90]);
	},
	"only calculates as many terms as are needed": () => {
		let termsCalculated = 0;
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i ++) {
				termsCalculated ++;
				yield i;
			}
		});
		const terms = sequence.slice(0, 5);
		expect(terms).toEqual([0, 1, 2, 3, 4]);
		expect(termsCalculated).toEqual(5);
	},
	"correctly uses term caching optimizations": () => {
		let termsCalculated = 0;
		const sequence = new Sequence(termIndex => {
			termsCalculated ++;
			return termIndex;
		});

		const terms1 = sequence.slice(0, 10);
		const terms2 = sequence.slice(0, 5);
		const terms3 = sequence.slice(0, 1);
		expect(terms1).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		expect(terms2).toEqual([0, 1, 2, 3, 4]);
		expect(terms3).toEqual([0]);
		expect(termsCalculated).toEqual(10);
	},
	"returns an empty list when start=end for sequences with nth-term formulas": () => {
		const sequence = new Sequence(n => n);
		expect(sequence.slice(0, 0)).toEqual([]);
	},
	"returns an empty list when start=end for sequences without nth-term formulas": () => {
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i ++) { yield i; }
		});
		expect(sequence.slice(0, 0)).toEqual([]);
	},
});
testing.addUnit("Sequence.termsBelow()", {
	"correctly returns the terms below a given value": () => {
		const sequence = new Sequence(i => i, { isMonotonic: true });
		const terms = sequence.termsBelow(5);
		expect(terms).toEqual([0, 1, 2, 3, 4]);
	},
	"correctly returns the terms less than or equal to a given value": () => {
		const sequence = new Sequence(i => i, { isMonotonic: true });
		const terms = sequence.termsBelow(5, true);
		expect(terms).toEqual([0, 1, 2, 3, 4, 5]);
	}
});
testing.addUnit("Sequence.nthTerm()", {
	"correctly calculates the term at a given index": () => {
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i += 10) { yield i; }
		}); // {0, 10, 20, 30, ...}
		const term = sequence.nthTerm(3);
		expect(term).toEqual(30);
	},
	"correctly uses term caching optimizations": () => {
		let termsCalculated = 0;
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i ++) {
				termsCalculated ++;
				yield i;
			}
		});

		const term1 = sequence.nthTerm(10);
		const term2 = sequence.nthTerm(10);
		const term3 = sequence.nthTerm(10);
		expect(term1).toEqual(10);
		expect(term2).toEqual(10);
		expect(term3).toEqual(10);
		expect(termsCalculated).toEqual(11);
	},
	"correctly uses term caching optimizations when an nth-term function is provided": () => {
		let termsCalculated = 0;
		const sequence = new Sequence(termIndex => {
			termsCalculated ++;
			return termIndex;
		});

		const term1 = Sequence.prototype.nthTerm.call(sequence, 10);
		const term2 = Sequence.prototype.nthTerm.call(sequence, 10);
		const term3 = Sequence.prototype.nthTerm.call(sequence, 10);
		expect(term1).toEqual(10);
		expect(term2).toEqual(10);
		expect(term3).toEqual(10);
		expect(termsCalculated).toEqual(1);
	}
});
testing.addUnit("Sequence.nextTerm()", {
	"returns the term after the first occurence of the given term": () => {
		const sequence = new Sequence(n => n);
		const nextTerm = sequence.nextTerm(10);
		expect(nextTerm).toEqual(11);
	}
});
testing.addUnit("Sequence.indexOf()", {
	"works when the term is in the sequence": () => {
		const positiveIntegers = new Sequence(
			termIndex => termIndex + 1,
			{ isMonotonic: true }
		);
		const index = positiveIntegers.indexOf(29);
		expect(index).toEqual(28);
	},
	"returns -1 when the term is not in the sequence": () => {
		const positiveIntegers = new Sequence(
			termIndex => termIndex + 1,
			{ isMonotonic: true }
		);
		const index = positiveIntegers.indexOf(-347);
		expect(index).toEqual(-1);
	},
	"correctly uses term caching optimizations": () => {
		let termsCalculated = 0;
		const sequence = new Sequence(function*() {
			for(let i = 0; i < Infinity; i ++) {
				termsCalculated ++;
				yield i;
			}
		}, { isMonotonic: true });

		const index1 = sequence.indexOf(17);
		const index2 = sequence.indexOf(17);
		const index3 = sequence.indexOf(17);
		expect(index1).toEqual(17);
		expect(index2).toEqual(17);
		expect(index3).toEqual(17);
		expect(termsCalculated).toEqual(18);
	}
});
testing.addUnit("Sequence.filter()", [
	() => {
		const positiveIntegers = new Sequence(
			termIndex => termIndex + 1,
			{ isMonotonic: true }
		);
		const evenNumbers = positiveIntegers.filter(v => v % 2 === 0);
		const terms = evenNumbers.slice(0, 5);
		expect(terms).toEqual([2, 4, 6, 8, 10]);
	}
]);
testing.addUnit("Sequence.find()", {
	"correctly returns the first term that meets the criteria": () => {
		const sequence = new Sequence(n => n + 1); // [1, 2, 3, ...]
		const number = sequence.find(v => v % 2 === 0 && v % 7 === 0);
		expect(number).toEqual(14);
	}
});
testing.addUnit("Sequence.map()", [
	() => {
		const positiveIntegers = new Sequence(
			termIndex => termIndex + 1,
			{ isMonotonic: true }
		);
		const evenNumbers = positiveIntegers.map(n => n * 2);
		const terms = evenNumbers.slice(0, 5);
		expect(terms).toEqual([2, 4, 6, 8, 10]);
	}
]);
testing.addUnit("Sequence.entries()", [
	() => {
		const positiveIntegers = new Sequence(
			termIndex => termIndex + 1,
			{ isMonotonic: true }
		);
		const results = [];
		for(const [value, index] of positiveIntegers.entries()) {
			results.push([value, index]);
			if(results.length >= 5) { break; }
		}
		expect(results).toEqual([
			[1, 0],
			[2, 1],
			[3, 2],
			[4, 3],
			[5, 4]
		]);
	}
]);
testing.addUnit("Sequence.union()", {
	"works for increasing monotonic sequences": () => {
		const s1 = new Sequence(
			i => i * 2, // sequence of even numbers
			{ isMonotonic: true }
		);
		const s2 = new Sequence(
			i => i * 3, // sequence of numbers divisible by 3
			{ isMonotonic: true }
		);
		const union = Sequence.union(s1, s2); // numbers divisible by 2 or 3
		expect(union.slice(0, 14)).toEqual([
			0, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20
		]);
	},
	"works for decreasing monotonic sequences": () => {
		const s1 = new Sequence(
			i => -i * 2, // sequence of negative even numbers
			{ isMonotonic: true }
		);
		const s2 = new Sequence(
			i => -i * 3, // sequence of negative numbers divisible by 3
			{ isMonotonic: true }
		);
		const union = Sequence.union(s1, s2); // numbers divisible by 2 or 3
		expect(union.slice(0, 14)).toEqual([
			-0, -2, -3, -4, -6, -8, -9, -10, -12, -14, -15, -16, -18, -20
		]);
	},
	"works for sequences that contain duplicates": () => {
		const s1 = new Sequence(function*() {
			yield 0;
			for(let i = 10; i < Infinity; i += 10) { yield i; yield i; }
		}, { isMonotonic: true }); // s1 = [0, 10, 10, 20, 20, 30, 30, ...]
		const s2 = new Sequence(
			n => n * 4,
			{ isMonotonic: true }
		); // s2 = [0, 4, 8, 12, 16, ...]
		const union = Sequence.union(s1, s2);
		expect(union.slice(0, 10)).toEqual([
			0, 4, 8, 10, 12, 16, 20, 24, 28, 30
		]);
	},
	"works for sequences where the first few terms are equal": () => {
		const s1 = new Sequence(
			n => Math.floor(n / 5), // 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, ...
			{ isMonotonic: true }
		);
		const s2 = new Sequence(
			n => 2 * (n + 1), // 0, 1, 2, 3, 4,
			{ isMonotonic: true }
		);
		const union = Sequence.union(s1, s2);
		expect(union.slice(0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
	},
	"throws an error for non-monotonic sequences": () => {
		const s1 = new Sequence(function*() {
			yield 2; yield 3; yield 1;
		}, { isMonotonic: false });
		const s2 = new Sequence(function*() {
			yield 10; yield 100; yield 3;
		}, { isMonotonic: false });
		testing.assertThrows(() => {
			Sequence.union(s1, s2);
		});
	}
});
testing.addUnit("Sequence.isIncreasing()", {
	"returns null (unknown) when it is not known whether the sequence is monotonic": () => {
		const sequence = new Sequence(n => n + 1);
		/* the sequence is clearly monotonic and increasing, but its
		`isMonotonic` property is null (unknown) */
		expect(sequence.isIncreasing()).toEqual(null);
	},
	"returns true for increasing sequences": () => {
		const sequence = new Sequence(n => n + 1, { isMonotonic: true });
		expect(sequence.isIncreasing()).toEqual(true);
	},
	"returns false for non-increasing sequences": () => {
		const sequence = new Sequence(n => -n, { isMonotonic: true });
		expect(sequence.isIncreasing()).toEqual(false);
	},
	"works for sequences where the first few terms are constant": () => {
		const sequence = new Sequence(
			n => Math.floor(n / 5), // 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, ...
			{ isMonotonic: true }
		);
		expect(sequence.isIncreasing()).toEqual(true);
	}
});

testing.addUnit("Sequence.POSITIVE_INTEGERS", [
	() => {
		const integers = [];
		for(const integer of Sequence.POSITIVE_INTEGERS) {
			integers.push(integer);
			if(integers.length >= 9) { break; }
		}
		expect(integers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	}
]);
testing.addUnit("Sequence.INTEGERS", [
	() => {
		const integers = [];
		for(const integer of Sequence.INTEGERS) {
			integers.push(integer);
			if(integers.length >= 9) { break; }
		}
		expect(integers).toEqual([0, 1, -1, 2, -2, 3, -3, 4, -4]);
	}
]);
testing.addUnit("Sequence.PRIMES", [
	() => {
		const primes = [];
		for(const prime of Sequence.PRIMES) {
			primes.push(prime);
			if(primes.length >= 40) { break; }
		}
		expect(primes).toEqual([
			2,
			3,
			5,
			7,
			11,
			13,
			17,
			19,
			23,
			29,
			31,
			37,
			41,
			43,
			47,
			53,
			59,
			61,
			67,
			71,
			73,
			79,
			83,
			89,
			97,
			101,
			103,
			107,
			109,
			113,
			127,
			131,
			137,
			139,
			149,
			151,
			157,
			163,
			167,
			173
		]);
	}
]);
testing.addUnit("Sequence.powersOf", [
	() => {
		const terms = Sequence.powersOf(2).slice(0, 5);
		expect(terms).toEqual([1, 2, 4, 8, 16]);
	},
	() => {
		const terms = Sequence.powersOf(3).slice(0, 5);
		expect(terms).toEqual([1, 3, 9, 27, 81]);
	}
]);
testing.addUnit("Sequence.fibonacci", {
	"correctly generates the sequence from default starting values": () => {
		const terms = Sequence.fibonacci().slice(0, 10);
		expect(terms).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
	},
	"correctly generates the sequence from custom starting values": () => {
		const terms = Sequence.fibonacci(2, 1).slice(0, 10);
		expect(terms).toEqual([2, 1, 3, 4, 7, 11, 18, 29, 47, 76]);
	}
});

testing.addUnit("Tree.iterate()", {
	"correctly iterates through the tree": () => {
		/*
		This test case uses the method to iterate over all alphabetic strings less than 3 characters.
		*/
		const ALPHABET = ["A", "B", "C"];
		const getChildren = (string) => {
			if(string.length < 3) {
				return ALPHABET.map(char => string + char)
			}
			else { return []; }
		};
		const rootNode = "A";
		const results = [];
		for(const string of Tree.iterate(rootNode, getChildren)) {
			results.push(string);
		}
		expect(results).toEqual([
			"A",
			"AA",
			"AAA",
			"AAB",
			"AAC",
			"AB",
			"ABA",
			"ABB",
			"ABC",
			"AC",
			"ACA",
			"ACB",
			"ACC",
		]);
	},
	"correctly iterates through the leaves of the tree": () => {
		const ALPHABET = ["A", "B", "C"];
		const getChildren = (string) => {
			if(string.length < 3) {
				return ALPHABET.map(char => string + char)
			}
			else { return []; }
		};
		const rootNode = "A";
		const results = [];
		for(const string of Tree.iterate(rootNode, getChildren, true)) {
			results.push(string);
		}
		expect(results).toEqual([
			"AAA",
			"AAB",
			"AAC",
			"ABA",
			"ABB",
			"ABC",
			"ACA",
			"ACB",
			"ACC",
		]);
	},
	"correctly iterates through the tree when called with a generator function": () => {
		const rootNode = "A";
		const getChildren = function*(str) {
			if(str.length < 3) {
				for(const newChar of ["A", "B", "C"]) {
					yield str + newChar;
				}
			}
		};
		const results = [];
		for(const string of Tree.iterate(rootNode, getChildren)) {
			results.push(string);
		}
		expect(results).toEqual([
			"A",
			"AA",
			"AAA",
			"AAB",
			"AAC",
			"AB",
			"ABA",
			"ABB",
			"ABC",
			"AC",
			"ACA",
			"ACB",
			"ACC"
		]);
	},
	"correctly iterates through the leaves of the tree when called with a generator function": () => {
		const rootNode = "A";
		const getChildren = function*(str) {
			if(str.length < 3) {
				for(const newChar of ["A", "B", "C"]) {
					yield str + newChar;
				}
			}
		};
		const results = [];
		for(const string of Tree.iterate(rootNode, getChildren, true)) {
			results.push(string);
		}
		expect(results).toEqual([
			"AAA",
			"AAB",
			"AAC",
			"ABA",
			"ABB",
			"ABC",
			"ACA",
			"ACB",
			"ACC"
		]);
	}
});

testing.addUnit("utils.createElement()", {
	"can create a basic element without ID or class": () => {
		const element = utils.createElement("div");
		expect(element).toDirectlyInstantiate(HTMLDivElement);
	},
	"can create an element with an ID": () => {
		const element = utils.createElement("span#myID");
		expect(element).toDirectlyInstantiate(HTMLSpanElement);
	},
	"can create an element with a class": () => {
		const element = utils.createElement("p.myClass");
		expect(element).toDirectlyInstantiate(HTMLParagraphElement);
		testing.assert(element.classList.contains("myClass"));
	},
	"can create an element with multiple classes": () => {
		const element = utils.createElement("p .class1 .class2");
		expect(element).toDirectlyInstantiate(HTMLParagraphElement);
		testing.assert(element.classList.contains("class1"));
		testing.assert(element.classList.contains("class2"));
	},
	"can create an element with an ID and multiple classes": () => {
		const element = utils.createElement("p #myID .class1 .class2");
		expect(element).toDirectlyInstantiate(HTMLParagraphElement);
		expect(element.id).toEqual("myID");
		testing.assert(element.classList.contains("class1"));
		testing.assert(element.classList.contains("class2"));
	}
});

(() => {
	const increment = (value) => {
		/*
		This is a simple function that will be tested in order to test the testing library.
		*/
		if(value % 2 === 0) {
			throw new Error("Uh oh!");
		}
		return value + 1;
	};

	testing.addUnit("TestUnit constructor", {
		"can create a unit with auto-named tests from a list of functions": () => {
			const unit = new TestUnit("increment()", [
				() => {
					const result = increment(1);
					expect(result).toEqual(2);
				},
				() => {
					/* this test will fail - see the intentionally bad implementation of increment() above */
					const result = increment(2);
					expect(result).toEqual(3);
				}
			]);
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case 1").getResult()).toEqual(true);
			expect(unit.findTest("test case 2").getResult()).toEqual(false);
		},
		"can create a unit with custom-named tests from an object with functions as properties": () => {
			const unit = new TestUnit("increment()", {
				"test case foo": () => {
					const result = increment(1);
					expect(result).toEqual(2);
				},
				"test case bar": () => {
					/* this test will fail - see the intentionally bad implementation of increment() above */
					const result = increment(2);
					expect(result).toEqual(3);
				}
			});
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case foo").getResult()).toEqual(true);
			expect(unit.findTest("test case bar").getResult()).toEqual(false);
		},
		"can create a unit with auto-generated tests from an array of inputs and outputs - ordinary syntax": () => {
			const unit = new TestUnit("increment()", [
				increment,

				/* first test case: increment(1) === 2 */
				[1, 2],
				/* this 2nd test will fail - see the intentionally bad implementation of increment() above */
				[2, 3]
			]);
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case 1").getResult()).toEqual(true);
			expect(unit.findTest("test case 2").getResult()).toEqual(false);
		},
		"can create a unit with auto-generated tests from an array of inputs and outputs - alternative syntax": () => {
			const unit = new TestUnit("increment()", increment, [
				/* first test case: increment(1) === 2 */
				[1, 2],
				/* this 2nd test will fail - see the intentionally bad implementation of increment() above */
				[2, 3]
			]);
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case 1").getResult()).toEqual(true);
			expect(unit.findTest("test case 2").getResult()).toEqual(false);
		},
		"can create a unit with custom-named but auto-generated tests": () => {
			const unit = new TestUnit("increment()", increment, {
				/* first test case: increment(1) === 2 */
				"test case foo": [1, 2],
				/* this 2nd test will fail - see the intentionally bad implementation of increment() above */
				"test case bar": [2, 3]
			});
			expect(unit.unitName).toEqual("increment()");
			expect(unit.findTest("test case foo").getResult()).toEqual(true);
			expect(unit.findTest("test case bar").getResult()).toEqual(false);
		}
	});
}) ();
testing.addUnit("expect()", {
	"toEqual() works for primitives": () => {
		expect(123).toEqual(123);
		expect(123n).toEqual(123n);
		expect(123n).toEqual(123);
		expect(123).toEqual(123n);
		expect("abc").toEqual("abc");
		expect(true).toEqual(true);
		expect(false).toEqual(false);
		expect(null).toEqual(null);
		expect(undefined).toEqual(undefined);
		expect(NaN).toEqual(NaN);
		testing.assertThrows(() => {
			expect(1).toEqual(2);
		});
		testing.assertThrows(() => {
			expect(1).toEqual("abc");
		});
		testing.assertThrows(() => {
			expect(undefined).toEqual();
		});
	},
	"toEqual() works for objects": () => {
		expect({}).toEqual({});
		expect([]).toEqual([]);
		class Foo {
			constructor(prop) {
				this.prop = prop;
			}
		}
		expect(new Foo(123)).toEqual(new Foo(123));

		testing.assertThrows(() => {
			expect(new Foo(123).toEqual(new Foo(124)));
		});
		testing.assertThrows(() => {
			expect(new Foo(123).toEqual({ prop: 123 }));
		});
		testing.assertThrows(() => {
			expect([1]).toEqual([2]);
		});
		testing.assertThrows(() => {
			expect([1, 2, 3]).toEqual(4);
		});
		testing.assertThrows(() => {
			expect(4).toEqual([1, 2, 3]);
		});
	},
	"toStrictlyEqual() works for primitives": () => {
		expect(1).toStrictlyEqual(1);
		expect("abc").toStrictlyEqual("abc");
		expect(true).toStrictlyEqual(true);
		expect(false).toStrictlyEqual(false);
		expect(null).toStrictlyEqual(null);
		expect(undefined).toStrictlyEqual(undefined);
		expect(NaN).toStrictlyEqual(NaN);
		testing.assertThrows(() => {
			expect(1).toStrictlyEqual(2);
		});
		testing.assertThrows(() => {
			expect(1).toStrictlyEqual("abc");
		});
		testing.assertThrows(() => {
			expect(undefined).toStrictlyEqual();
		});
	},
	"toStrictlyEqual() works for objects": () => {
		const obj = {};
		expect(obj).toStrictlyEqual(obj);
		const arr = [];
		expect(arr).toStrictlyEqual(arr);
		class MyClass {
			constructor(prop) {
				this.prop = prop;
			}
		};
		const myInstance = new MyClass("foo");
		expect(myInstance).toStrictlyEqual(myInstance)


		testing.assertThrows(() => {
			expect({}).toStrictlyEqual({});
		});
		testing.assertThrows(() => {
			expect({ prop: 1 }).toStrictlyEqual({ prop: 1 });
		});
		testing.assertThrows(() => {
			expect([]).toStrictlyEqual([]);
		});
		testing.assertThrows(() => {
			expect([1, 2, 3]).toStrictlyEqual([1, 2, 3]);
		});
		testing.assertThrows(() => {
			expect(new MyClass("foo")).toStrictlyEqual(new MyClass("foo"));
		});
	},
	"toNotStrictlyEqual() works for primitives": () => {
		testing.assertThrows(() => {
			expect(1).toNotStrictlyEqual(1);
		});
		testing.assertThrows(() => {
			expect("abc").toNotStrictlyEqual("abc");
		});
		testing.assertThrows(() => {
			expect(true).toNotStrictlyEqual(true);
		});
		testing.assertThrows(() => {
			expect(false).toNotStrictlyEqual(false);
		});
		testing.assertThrows(() => {
			expect(null).toNotStrictlyEqual(null);
		});
		testing.assertThrows(() => {
			expect(undefined).toNotStrictlyEqual(undefined);
		});
		testing.assertThrows(() => {
			expect(NaN).toNotStrictlyEqual(NaN);
		});
		expect(1).toNotStrictlyEqual(2);
		expect(1).toNotStrictlyEqual("abc");
		testing.assertThrows(() => {
			expect(undefined).toNotStrictlyEqual();
		});
	},
	"toNotStrictlyEqual() works for objects": () => {
		const obj = {};
		testing.assertThrows(() => {
			expect(obj).toNotStrictlyEqual(obj);
		});
		const arr = [];
		testing.assertThrows(() => {
			expect(arr).toNotStrictlyEqual(arr);
		});
		class MyClass {
			constructor(prop) {
				this.prop = prop;
			}
		};
		const myInstance = new MyClass("foo");
		testing.assertThrows(() => {
			expect(myInstance).toNotStrictlyEqual(myInstance)
		});


		expect({}).toNotStrictlyEqual({});
		expect({ prop: 1 }).toNotStrictlyEqual({ prop: 1 });
		expect([]).toNotStrictlyEqual([]);
		expect([1, 2, 3]).toNotStrictlyEqual([1, 2, 3]);
		expect(new MyClass("foo")).toNotStrictlyEqual(new MyClass("foo"));
	},
	"toNotEqual() works for primitives": () => {
		testing.assertThrows(() => {
			expect(123).toNotEqual(123);
		});
		testing.assertThrows(() => {
			expect(123n).toNotEqual(123n);
		});
		testing.assertThrows(() => {
			expect(123n).toNotEqual(123);
		});
		testing.assertThrows(() => {
			expect(123).toNotEqual(123n);
		});
		testing.assertThrows(() => {
			expect("abc").toNotEqual("abc");
		});
		testing.assertThrows(() => {
			expect(true).toNotEqual(true);
		});
		testing.assertThrows(() => {
			expect(false).toNotEqual(false);
		});
		testing.assertThrows(() => {
			expect(null).toNotEqual(null);
		});
		testing.assertThrows(() => {
			expect(undefined).toNotEqual(undefined);
		});
		testing.assertThrows(() => {
			expect(NaN).toNotEqual(NaN);
		});
		expect(1).toNotEqual(2);
		expect(1).toNotEqual("abc");
		testing.assertThrows(() => {
			expect(undefined).toNotEqual();
		});
	},
	"toBeTrue() works": () => {
		expect(true).toBeTrue();


		testing.assertThrows(() => {
			expect(false).toBeTrue();
		});
		testing.assertThrows(() => {
			expect(123).toBeTrue();
		});
		testing.assertThrows(() => {
			expect({ prop: 123 }).toBeTrue();
		});
	},
	"toBeFalse() works": () => {
		expect(false).toBeFalse();


		testing.assertThrows(() => {
			expect(true).toBeFalse();
		});
		testing.assertThrows(() => {
			expect(0).toBeFalse();
		});
		testing.assertThrows(() => {
			expect({ prop: 123 }).toBeFalse();
		});
	},
	"toBeTruthy() works": () => {
		expect(true).toBeTruthy();
		expect(123).toBeTruthy();
		expect("abc").toBeTruthy();

		testing.assertThrows(() => {
			expect(false).toBeTruthy();
		});
		testing.assertThrows(() => {
			expect(0).toBeTruthy();
		});
		testing.assertThrows(() => {
			expect("").toBeTruthy();
		});
	},
	"toBeFalsy() works": () => {
		expect(false).toBeFalsy();
		expect(0).toBeFalsy();
		expect("").toBeFalsy();

		testing.assertThrows(() => {
			expect(true).toBeFalsy();
		});
		testing.assertThrows(() => {
			expect(123).toBeFalsy();
		});
		testing.assertThrows(() => {
			expect("abc").toBeFalsy();
		});
	},
	"toThrow() works": () => {
		const foo = (arg) => {
			if(arg !== 123) {
				throw new Error("Uh-oh, something went wrong!");
			}
		}

		// foo throws an error when the argument is not 123, as seen above
		expect(foo).toThrow();
		expect(foo, 456).toThrow();
		expect(foo.bind(null, 456)).toThrow();

		testing.assertThrows(() => {
			// here, foo should be called with 123 as a parameter, so no error should be thrown.
			expect(foo, 123).toThrow();
		});
		testing.assertThrows(() => {
			// here also, foo should be called with 123 as a parameter, so no error should be thrown.
			expect(foo.bind(null, 123)).toThrow();
		});
	},
	"toBeNumeric() works": () => {
		expect(1).toBeNumeric();
		expect(-1.23).toBeNumeric();
		expect(123n).toBeNumeric();

		testing.assertThrows(() => {
			expect("abc").toBeNumeric();
		});
		testing.assertThrows(() => {
			expect(NaN).toBeNumeric();
		});
	},
	"toBeAnObject() works": () => {
		expect({}).toBeAnObject();
		expect({ x: 1 }).toBeAnObject();
		expect([]).toBeAnObject();
		class Foo { constructor() {} }
		expect(new Foo()).toBeAnObject();


		testing.assertThrows(() => {
			expect(123).toBeAnObject();
		});
		testing.assertThrows(() => {
			expect("abc").toBeAnObject();
		});
		testing.assertThrows(() => {
			expect(null).toBeAnObject();
		});
	},
	"toBeAnArray() works": () => {
		expect([]).toBeAnArray();
		expect([1, 2, 3]).toBeAnArray();

		testing.assertThrows(() => {
			expect(123).toBeAnArray();
		});
		testing.assertThrows(() => {
			expect({}).toBeAnArray();
		});
	},
	"toBePositive() works": () => {
		expect(123).toBePositive();

		testing.assertThrows(() => {
			expect(-1).toBePositive();
		});
		testing.assertThrows(() => {
			expect(0).toBePositive();
		});
		testing.assertThrows(() => {
			expect("abc").toBePositive();
		});
	},
	"toBeNegative() works": () => {
		expect(-123).toBeNegative();

		testing.assertThrows(() => {
			expect(1).toBeNegative();
		});
		testing.assertThrows(() => {
			expect(0).toBeNegative();
		});
		testing.assertThrows(() => {
			expect("abc").toBeNegative();
		});
	},
	"toBeAnInteger() works": () => {
		expect(123).toBeAnInteger();
		expect(123n).toBeAnInteger();

		testing.assertThrows(() => {
			expect(1.23).toBeAnInteger();
		});
		testing.assertThrows(() => {
			expect("abc").toBeAnInteger();
		});
	},
	"toBeBetween() works": () => {
		expect(123).toBeBetween(100, 200);
		expect(123n).toBeBetween(100, 200);
		expect(123).toBeBetween(100n, 200n);
		expect(123n).toBeBetween(100n, 200n);

		expect(123).toBeBetween(123, 456);
		expect(123).toBeBetween(0, 123);

		testing.assertThrows(() => {
			expect(123).toBeBetween(50, 60);
		});
		testing.assertThrows(() => {
			expect(123n).toBeBetween(50, 60);
		});
	},
	"toBeStrictlyBetween() works": () => {
		expect(123).toBeStrictlyBetween(100, 200);
		expect(123n).toBeStrictlyBetween(100, 200);
		expect(123).toBeStrictlyBetween(100n, 200n);
		expect(123n).toBeStrictlyBetween(100n, 200n);

		testing.assertThrows(() => {
			expect(123).toBeStrictlyBetween(123, 456);
		});
		testing.assertThrows(() => {
			expect(123).toBeStrictlyBetween(0, 123);
		});

		testing.assertThrows(() => {
			expect(123).toBeStrictlyBetween(50, 60);
		});
		testing.assertThrows(() => {
			expect(123n).toBeStrictlyBetween(50, 60);
		});
	},
	"toBeGreaterThan() works": () => {
		expect(1).toBeGreaterThan(0);

		testing.assertThrows(() => {
			expect(1).toBeGreaterThan(2);
		});
		testing.assertThrows(() => {
			expect("abc").toBeGreaterThan(2);
		});
		testing.assertThrows(() => {
			expect(1).toBeGreaterThan("abc");
		});
	},
	"toApproximatelyEqual() works": () => {
		expect(0.1 + 0.2).toApproximatelyEqual(0.3);
		expect(0.3 - 0.1).toApproximatelyEqual(0.2);

		testing.assertThrows(() => {
			expect(2).toApproximatelyEqual(3);
		});
		testing.assertThrows(() => {
			expect(0.1 + 0.2 + 4e-14).toApproximatelyEqual(0.3);
		});
	},
	"toHaveProperties() works": () => {
		expect({ x: 1 }).toHaveProperties("x");
		expect({ x: 1, y: 1 }).toHaveProperties("x", "y");
		expect({ x: 1, y: 1, z: 1 }).toHaveProperties("x", "y");

		testing.assertThrows(() => {
			expect({ x: 1 }).toHaveProperties("y");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toHaveProperties("x", "y", "z");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toHaveProperties("x", "y", "z");
		});
	},
	"toOnlyHaveProperties() works": () => {
		expect({ x: 1 }).toOnlyHaveProperties("x");
		expect({ x: 1, y: 1 }).toOnlyHaveProperties("x", "y");

		testing.assertThrows(() => {
			expect({ x: 1, y: 1, z: 1 }).toOnlyHaveProperties("x", "y");
		});
		testing.assertThrows(() => {
			expect({ x: 1 }).toOnlyHaveProperties("y");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toOnlyHaveProperties("x", "y", "z");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toOnlyHaveProperties("x", "y", "z");
		});
	},
	"toInstantiate() works": () => {
		expect({}).toInstantiate(Object);
		expect([]).toInstantiate(Array);
		expect([]).toInstantiate(Object);
		class Foo { constructor() {} };
		expect(new Foo()).toInstantiate(Foo);
		expect(new Foo()).toInstantiate(Object);

		testing.assertThrows(() => {
			expect([]).toInstantiate(Foo);
		});
		testing.assertThrows(() => {
			expect({}).toInstantiate(Array);
		});
	},
	"toDirectlyInstantiate() works": () => {
		expect({}).toDirectlyInstantiate(Object);
		expect([]).toDirectlyInstantiate(Array);
		class Foo { constructor() {} };
		expect(new Foo()).toDirectlyInstantiate(Foo);

		testing.assertThrows(() => {
			expect(new Foo()).toDirectlyInstantiate(Object);
		});
		testing.assertThrows(() => {
			expect([]).toDirectlyInstantiate(Object);
		});

		testing.assertThrows(() => {
			expect([]).toDirectlyInstantiate(Foo);
		});
		testing.assertThrows(() => {
			expect({}).toDirectlyInstantiate(Array);
		});
	}
});

testing.addUnit("Vector constructor", {
	"can create a Vector from x and y coordinates": () => {
		const vector = new Vector(123, 456);
		expect(vector.x).toEqual(123);
		expect(vector.y).toEqual(456);
	},
	"can create a vector from an object with properties x and y": () => {
		const obj = { x: 123, y: 456 };
		const vector = new Vector(obj);
		expect(vector.x).toEqual(123);
		expect(vector.y).toEqual(456);
	},
	"can create a vector from a direction string": () => {
		const v1 = new Vector("left");
		expect(v1.x).toEqual(-1);
		expect(v1.y).toEqual(0);
		const v2 = new Vector("right");
		expect(v2.x).toEqual(1);
		expect(v2.y).toEqual(0);
		const v3 = new Vector("up");
		expect(v3.x).toEqual(0);
		expect(v3.y).toEqual(-1);
		const v4 = new Vector("down");
		expect(v4.x).toEqual(0);
		expect(v4.y).toEqual(1);
	},
	"can create a vector from an array containing two numbers": () => {
		const vector = new Vector([123, 456]);
		expect(vector.x).toEqual(123);
		expect(vector.y).toEqual(456);
	},
	"can create a vector from an object with properties angle and magnitude": () => {
		const obj = { angle: 90, magnitude: 123 };
		const vector = new Vector(obj);
		expect(vector.x).toApproximatelyEqual(0, 1e-10);
		expect(vector.y).toApproximatelyEqual(-123, 1e-10);
	},
	"sets the vector's position to (0, 0) when no arguments are passed in": () => {
		const vector = new Vector();
		expect(vector.x).toEqual(0);
		expect(vector.y).toEqual(0);
	}
});
testing.addUnit("Vector angle getter / setters", {
	"getting the angle returns the angle of the vector": () => {
		const vector = new Vector(1, -1);
		expect(vector.angle).toEqual(45);
	},
	"setting the angle correctly modifies the x and y properties": () => {
		const vector = new Vector(1, 0);
		vector.angle = 45;
		expect(vector.x).toApproximatelyEqual(1 / Math.SQRT2);
		expect(vector.y).toApproximatelyEqual(-1 / Math.SQRT2);
	}
});
testing.addUnit("Vector magnitude getters / setters", {
	"getting the magnitude returns the magnitude of the vector": () => {
		const vector = new Vector(3, 4);
		expect(vector.magnitude).toEqual(5);
	},
	"setting the magnitude correctly modifies the x and y properties": () => {
		const vector = new Vector(3, 4);
		vector.magnitude *= 2;
		expect(vector.x).toEqual(6);
		expect(vector.y).toEqual(8);
	}
});