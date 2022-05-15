const type_list = [
  {
    id: "chinese",
    code: "共",
    full_name: "國文領域",
  },
  {
    id: "english",
    code: "共",
    full_name: "英文領域",
  },
  {
    id: "english_adv",
    code: "共",
    full_name: "進階英文",
  },
  {
    id: "foreign",
    code: "共",
    full_name: "外文領域",
  },
  {
    id: "foreign_like",
    code: "共",
    full_name: "可充當外文領域",
  },
  {
    id: "shared_selective",
    code: "共",
    full_name: "共同選修課程",
  },
  {
    id: "g_ax",
    code: "AX",
    full_name: "不分領域通識課程",
  },
  {
    id: "g_a1",
    code: "A1",
    full_name: "文學與藝術領域",
  },
  {
    id: "g_a2",
    code: "A2",
    full_name: "歷史思維領域",
  },
  {
    id: "g_a3",
    code: "A3",
    full_name: "世界文明領域",
  },
  {
    id: "g_a4",
    code: "A4",
    full_name: "哲學與道德思考領域",
  },
  {
    id: "g_a5",
    code: "A5",
    full_name: "公民意識與社會分析領域",
  },
  {
    id: "g_a6",
    code: "A6",
    full_name: "量化分析與數學素養領域",
  },
  {
    id: "g_a7",
    code: "A7",
    full_name: "物質科學領域",
  },
  {
    id: "g_a8",
    code: "A8",
    full_name: "生命科學領域",
  },
  {
    id: "freshman",
    code: "新",
    full_name: "新生專題/新生講座課程",
  },
  {
    id: "basic",
    code: "基",
    full_name: "基本能力課程",
  },
  {
    id: "millitary",
    code: "軍",
    full_name: "軍訓課程",
  },
  {
    id: "pe_1",
    code: "體",
    full_name: "健康體適能",
  },
  {
    id: "pe_2",
    code: "體",
    full_name: "專項運動學群",
  },
  {
    id: "pe_3",
    code: "體",
    full_name: "選修體育",
  },
  {
    id: "pe_4",
    code: "體",
    full_name: "校隊班",
  },
  {
    id: "pe_5",
    code: "體",
    full_name: "進修學士班",
  },
  {
    id: "frequent",
    code: "密",
    full_name: "密集課程",
  },
];

const code_map = {
  共: {
    name: "共同課程",
  },
  A: {
    name: "通識",
  },
  新: {
    name: "新生專題/新生講座",
  },
  基: {
    name: "基本能力課程",
  },
  軍: {
    name: "軍訓",
  },
  體: {
    name: "體育",
  },
  密: {
    name: "密集課程",
  },
};

export { type_list, code_map };
