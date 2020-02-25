import { Dictionary, EmailData } from "../model";

export const getRankDict = (csv: string): Dictionary => {
  const splitted = csv.split("\n");
  splitted.shift(); // remove first line

  const dict: Dictionary = {};
  splitted
    .filter(it => it !== "")
    .forEach(it => {
      const [key, value] = it.split(",");
      if (typeof Number(key) === "number") dict[key] = value;
    });
  return dict;
};

export const getEmailData = (csv: string) => {
  const emailList: EmailData[] = [];
  const splitted = csv.split("\n");
  splitted.shift(); // remove first line

  splitted
    .filter(it => it !== "")
    .forEach(it => {
      const [
        email,
        user_name,
        user_next_rank_id,
        reviews_left_to_uprank
      ] = it.split(",");

      emailList.push({
        email,
        user_name,
        user_next_rank_id: Number(user_next_rank_id),
        reviews_left_to_uprank: Number(reviews_left_to_uprank)
      });
    });

  return emailList;
};
