import { rankMapper } from "./mapper";

describe("rankMapper", () => {
  it("should map rank correctly with id", () => {
    const mockDict = {
      1: "Newbie",
      3: "Reviewer",
      11: "Elite"
    };
    const expected = "Reviewer";
    expect(rankMapper(mockDict, 3)).toEqual(expected);
  });
});
