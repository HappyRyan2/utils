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
