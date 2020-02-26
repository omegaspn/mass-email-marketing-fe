import { Dictionary } from "../model";

export const rankMapper = (rankDict: Dictionary, rankId: number) => {
  return rankDict[rankId];
};
