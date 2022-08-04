export interface CollegeMap {
  [key: string]: {
    name: string;
  };
}

const college_map: CollegeMap = {
  0: {
    name: "未知學院",
  },
  1: {
    name: "文學院",
  },
  2: {
    name: "理學院",
  },
  3: {
    name: "社會科學院",
  },
  4: {
    name: "醫學院",
  },
  5: {
    name: "工學院",
  },
  6: {
    name: "生物資源暨農學院",
  },
  7: {
    name: "管理學院",
  },
  8: {
    name: "公共衛生學院",
  },
  9: {
    name: "電機資訊學院",
  },
  A: {
    name: "法律學院",
  },
  B: {
    name: "生命科學院",
  },
  E: {
    name: "進修推廣學院",
  },
  H: {
    name: "學位學程",
  },
  J: {
    name: "產業研發碩士專班",
  },
  K: {
    name: "重點科技研究學院與三校聯盟",
  },
  Q: {
    name: "寫作教學中心",
  },
  V: {
    name: "國家理論科學研究中心",
  },
  Z: {
    name: "創新設計學院",
  },
};

const collegeIds = Object.keys(college_map);

export { college_map, collegeIds };
