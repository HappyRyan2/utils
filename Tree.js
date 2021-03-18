class Tree {
	static *iterate(root, getChildren) {
		const stack = [];
		stack.push({
			item: root,
			children: getChildren(root),
			childIndex: 0
		});
		yield stack[0].item;
		while(stack.length !== 0) {
			const lastItem = stack[stack.length - 1];
			if(lastItem.childIndex >= lastItem.children.length) {
				stack.pop();
				continue;
			}
			const nextChild = lastItem.children[lastItem.childIndex];
			yield nextChild;
			stack.push({
				item: nextChild,
				children: getChildren(nextChild) ?? [],
				childIndex: 0
			});
			lastItem.childIndex ++;
		}
	}

	constructor(root, getChildren) {

	}
}
