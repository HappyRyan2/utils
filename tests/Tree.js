testing.addUnit("Tree.iterate()", [
	() => {
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
	}
]);
