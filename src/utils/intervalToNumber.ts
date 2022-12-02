import { Interval } from "types/course";

export default function intervalToNumber(interval: Interval): number {
  switch (interval) {
    case "0":
      return 0;
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    case "7":
      return 7;
    case "8":
      return 8;
    case "9":
      return 9;
    case "10":
      return 10;
    case "A":
      return 11;
    case "B":
      return 12;
    case "C":
      return 13;
    case "D":
      return 14;
    default:
      // assert never
      return 15;
  }
}
