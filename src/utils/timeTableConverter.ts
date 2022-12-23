import { Interval } from "types/course";
import isEqual from "lodash/isEqual";

const EmptyTable = [[], [], [], [], [], [], []];
const Days = 7;
const Lessons = 15;

const mapStateToTimeTable = (time_state: Interval[][]) => {
  if (isEqual(time_state, EmptyTable)) {
    return new Array(Lessons).fill(0).map((x) => new Array(Days).fill(false));
  } else {
    const time_table = new Array(Lessons)
      .fill(0)
      .map((x) => new Array(Days).fill(false));
    for (let i = 0; i < 7; i++) {
      const day = time_state[i];
      for (let j = 0; j < day.length; j++) {
        switch (day[j]) {
          case "0":
            time_table[0][i] = true;
            break;
          case "1":
            time_table[1][i] = true;
            break;
          case "2":
            time_table[2][i] = true;
            break;
          case "3":
            time_table[3][i] = true;
            break;
          case "4":
            time_table[4][i] = true;
            break;
          case "5":
            time_table[5][i] = true;
            break;
          case "6":
            time_table[6][i] = true;
            break;
          case "7":
            time_table[7][i] = true;
            break;
          case "8":
            time_table[8][i] = true;
            break;
          case "9":
            time_table[9][i] = true;
            break;
          case "10":
            time_table[10][i] = true;
            break;
          case "A":
            time_table[11][i] = true;
            break;
          case "B":
            time_table[12][i] = true;
            break;
          case "C":
            time_table[13][i] = true;
            break;
          case "D":
            time_table[14][i] = true;
            break;
          default:
            break;
        }
      }
    }
    return time_table;
  }
};

const mapStateToIntervals = (time_state: Interval[][]) => {
  let res = 0;
  for (let i = 0; i < time_state.length; i++) {
    res += time_state[i].length;
  }
  return res;
};

export { mapStateToTimeTable, mapStateToIntervals };
