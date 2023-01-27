window.utils ??= {};
utils.createElement = (elementString) => {
	const TOKENIZE = /(?:\.|#|)[\w_-]+/g;
	const tokens = elementString.match(TOKENIZE);
	const element = document.createElement(tokens.find(t => t[0] !== "#" && t[0] !== "."));
	for(const token of tokens) {
		if(token.startsWith(".")) {
			element.classList.add(token.slice(1));
		}
		else if(token.startsWith("#")) {
			element.id = token.slice(1);
		}
	}
	return element;
};
