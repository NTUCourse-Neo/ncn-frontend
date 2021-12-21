const mapStateToTimeTable = (time_state) => {
    // time_state is arr consisting of 7 subarray, ex:
    /*
        [
            ["0","1"],
            [],
            ["A"],
            [],
            [],
            [],
            ["B"]
        ]
    */
    if (time_state===null || time_state===[[],[],[],[],[],[],[]]){
        return [
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
        ];
    }
    else {
      let time_table = [
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
      ];
      for (let i=0;i<7;i++){
        let day = time_state[i];
        for (let j=0;j<day.length;j++){
          switch (day[j]){
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
  }

const mapStateToIntervals=(time_state)=>{
  if (time_state===null){
    return 0;
  }
  else {
    let res = 0;
    for (let i=0;i<time_state.length;i++){
      res+=time_state[i].length;;
    }
    return res;
  }
}

export {mapStateToTimeTable, mapStateToIntervals};