class Tree {
	static *iterate(root, getChildren, leavesOnly) {
		const GeneratorFunction = (function*() {}).constructor;
		if(!(getChildren instanceof GeneratorFunction)) {
			const generatorFunc = function*(value) {
				for(const nextChild of getChildren(value)) { yield nextChild; }
			};
			for(const value of Tree.iterate(root, generatorFunc, leavesOnly)) {
				yield value;
			}
			return;
		}
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

	constructor(root, getChildren) {

	}
}
