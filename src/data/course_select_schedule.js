const status_map = [
  {
    name: "即將開始",
    emoji: "⏰",
    color: "blue.200",
  },
  {
    name: "已開始",
    emoji: "🏎️",
    color: "green.200",
  },
  {
    name: "快結束啦!",
    emoji: "🏃",
    color: "yellow.200",
  },
  {
    name: "剩不到一天了",
    emoji: "🥵",
    color: "red.200",
  },
];
const ntu_course_select_url = [
  "https://if192.aca.ntu.edu.tw/index.php",
  "https://if177.aca.ntu.edu.tw/index.php",
];
const course_select_schedule = [
  {
    name: "初選第一階段",
    label: "初選 一階",
    start: 1642381200,
    end: 1642705200,
  },
  {
    name: "初選第二階段",
    label: "二階",
    start: 1642986000,
    end: 1643223600,
  },
  {
    name: "第一週加退選",
    label: "加退選 W1",
    start: 1644800400,
    end: 1645243200,
  },
  {
    name: "第二週加退選",
    label: "W2",
    start: 1645405200,
    end: 1645869600,
  },
  {
    name: "第三週加退選",
    label: "W3",
    start: 1646096400,
    end: 1646679600,
  },
];

export { status_map, ntu_course_select_url, course_select_schedule };
