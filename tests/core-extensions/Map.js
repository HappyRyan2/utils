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
	},
	"works when the Map is part of a cyclic data structure": () => {
		const obj1 = { map: new Map() };
		obj1.map.set("obj", obj1);
		const obj2 = { map: new Map() };
		obj2.map.set("obj", obj2);
		testing.assert(obj1.equals(obj2));
		testing.assert(obj2.equals(obj1));
	}
});
testing.addUnit("Map.clone()", {
	"correctly clones the Map": () => {
		const map = new Map([[1, 2], [3, 4]]);
		const clone = map.clone();
		expect(clone.get(1)).toEqual(2);
		expect(clone.get(3)).toEqual(4);
	},
	"works when the Map is part of a cyclic data structure": () => {
		const obj = { map: new Map() };
		obj.map.set("obj", obj);
		const clone = obj.clone();
		expect(clone).toEqual(obj);
		expect(clone).toNotStrictlyEqual(obj);
	}
});
