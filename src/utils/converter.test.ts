import { getRankDict, getEmailData } from "./converter";
import { rankCsv, emailCsv } from "./__mocks__";

describe("getRankDict", () => {
  it("should convert correctly", () => {
    const expected = {
      1: "Newbie",
      3: "Reviewer",
      11: "Elite"
    };
    expect(getRankDict(rankCsv)).toEqual(expected);
  });
});

describe("getEmailData", () => {
  it("should convert correctly", () => {
    const expected = [
      {
        email: "pear@gmail.com",
        reviews_left_to_uprank: 3,
        user_name: "แพรกินจุ",
        user_next_rank_id: 3
      }
    ];
    expect(getEmailData(emailCsv)).toEqual(expected);
  });
});
