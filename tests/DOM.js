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
