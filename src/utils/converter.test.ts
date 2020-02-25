import { getRankDict } from "./converter";

describe("getRankDict", () => {
  it("should convert", () => {
    const expected = {
      1: "Newbie",
      3: "Reviewer",
      11: "Elite"
    };
    expect(getRankDict()).toEqual(expected);
  });
});
