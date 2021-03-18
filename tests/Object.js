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
