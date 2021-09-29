class Tree {
	static *iterate(root, getChildren, leavesOnly, algorithm = "dfs") {
		const GeneratorFunction = (function*() {}).constructor;
		if(!(getChildren instanceof GeneratorFunction)) {
			const generatorFunc = function*(value) {
				for(const nextChild of getChildren(value)) { yield nextChild; }
			};
			for(const value of Tree.iterate(root, generatorFunc, leavesOnly, algorithm)) {
				yield value;
			}
			return;
		}
		if(algorithm === "dfs") {
			const stack = [];
			stack.push({
				value: root,
				generator: getChildren(root),
				numChildren: 0
			});
			if(!leavesOnly) { yield root; }
			while(stack.length !== 0) {
				const lastItem = stack[stack.length - 1];
				const next = lastItem.generator.next();
				if(next.done) {
					if(leavesOnly && lastItem.numChildren === 0) {
						yield lastItem.value;
					}
					stack.pop();
					continue;
				}
				lastItem.numChildren ++;
				const value = next.value;
				stack.push({
					value: value,
					generator: getChildren(value),
					numChildren: 0
				});
				if(!leavesOnly) { yield value; }
			}
		}
		else {
			let currentLevel = [root];
			let nextLevel = [];
			while(currentLevel.length !== 0) {
				for(const value of currentLevel) {
					let hasChildren = false;
					for(const child of getChildren(value)) {
						hasChildren = true;
						nextLevel.push(child);
					}
					if(!hasChildren || !leavesOnly) {
						yield value;
					}
				}
				currentLevel = nextLevel;
				nextLevel = [];
			}
		}
	}

	constructor(root, getChildren) {

	}
}
