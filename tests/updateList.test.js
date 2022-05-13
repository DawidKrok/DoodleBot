const { changeOrder } = require("../services/contestServices");

test('contestServices.changeOrder() properly changes order of an array', () => {
    // testing basic functionality
    expect(changeOrder([0, 1, 2, 3, 4, 5, 6, 7], ['4', `2`, 3, "1"])).toEqual([0, 4, 2, 3, 1, 5, 6, 7])
    expect(changeOrder(["a", "b", "c", "d", "e"], [3, 4, 1, 2])).toEqual(["a", "d", "e", "b", "c"])
})

//=================| ERROR THROWING |===============
test("contestServices.changeOrder() properly throws 'Exceeded' error", () => {
    // when order input is above it's proper range
    expect(() => changeOrder([0, 1, 2, 3, 4, 5, 6], [4, `2`, 5, "1"])).toThrow("Exceeded")
    expect(() => changeOrder([0, 1, 2, 3, 4], ['4', 2, 5, "1", 4])).toThrow("Exceeded")
    // when order input is below it's proper range
    expect(() => changeOrder([0, 1, 2, 3, 4, 5], ['4', `-1`, 3, "1"])).toThrow("Exceeded")
})

test("contestServices.changeOrder() properly throws 'NaI' error", () => {
    // when order input is not an integer
    expect(() => changeOrder([0, 1, 2, 3, 4], ['4', `abc`, 3, "1"])).toThrow("NaI")
    expect(() => changeOrder([0, 1, 2, 3, 4, 5], ['4', `1`, 3.2, "1"])).toThrow("NaI")
})

test("contestServices.changeOrder() properly throws 'Duplicate' error", () => {
    // when order input is duplicated
    expect(() => changeOrder([0, 1, 2, 3, 4, 5, 6], ['4', `1`, 3, "3", 2])).toThrow("Duplicate")
})