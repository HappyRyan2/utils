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
		testing.assert((true).equals(true));
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
		testing.refute(obj1.equals(obj2));
		testing.refute(obj2.equals(obj1));
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
