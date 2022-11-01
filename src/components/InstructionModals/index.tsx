import InstructionModal from "@/components/InstructionModals/InstructionModal";
import {
  Text,
  Flex,
  Box,
  HStack,
  UnorderedList,
  ListItem,
  OrderedList,
} from "@chakra-ui/react";

function ELink({
  children,
  href,
}: {
  readonly children: React.ReactNode;
  readonly href: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Text
        sx={{
          color: "primary.500",
          textDecoration: "underline",
          display: "inline",
          mx: 1,
        }}
      >
        {children}
      </Text>
    </a>
  );
}

export function CourseSelectionRulesModal() {
  return (
    <InstructionModal title="選課限制條件說明">
      <Flex flexDirection={"column"}>
        <Text>
          「選課限制條件」只在初選階段有身份限制，不會沿用至於開學後之加退選。
        </Text>
        <Box h="18px" />
        <Box>
          但下列二種情形需特別注意：
          <HStack ml="4px" align={"start"}>
            <Flex>1.</Flex>
            <Flex>
              在第一與第三類加簽中，若較高學制課程未開放較低學制學生修習者，系統將直接設定無法加選(由低到高學制分別為學士班、碩士班、博士班)；而第二類加簽是由教師發放授權碼，所以不受此限。
            </Flex>
          </HStack>
          <HStack ml="4px" align={"start"}>
            <Flex>2.</Flex>
            <Flex>在職專班課程限在職專班學生修習。</Flex>
          </HStack>
        </Box>
      </Flex>
    </InstructionModal>
  );
}

export function GeneralCommonCoursePrecautionModal() {
  return (
    <InstructionModal title="通識通修課程注意事項">
      <Flex flexDirection={"column"} gap="6">
        <Text>
          一、 凡 105 學年度已在學或新入學之學士班學生，應修習通識課程 15
          學分。轉學生、降級轉系學生，應依轉入年級學生之入學學年度為標準。入學之當年度第一學期即辦理休學者，應依其復學學年度為標準。
        </Text>
        <Text>
          二、 通識課程分為「文學與藝術 (A1)」、「歷史思維(A2)」、「世界文明
          (A3)」、「哲學與道德思考 (A4)」、「公民意識與社會分 析
          (A5)」、「量化分析與數學素養 (A6)」、「物質科學 (A7)」、「生命科學
          (A8)」等八大核心領域。學生應依據共同教育中心公佈之 「
          <ELink href="https://nol.ntu.edu.tw/nol/note/111-1/comarea.pdf">
            各院系指定學生應修習通識課程領域一覽表.pdf
          </ELink>
          」 ，修習其就讀學系指定領域之通識課程。滿足 3
          個指定領域，其餘不受指定領域限制。
        </Text>
        <Text>
          {" "}
          三、
          通識課程如兼跨二個領域者，得選擇計入其中任一領域。國際學生不受前項指定領域之限制。
        </Text>
        <Text>
          四、 大一國文可與通識課程A1~A4 等 4 個領域中任一領域相互充抵，至多 3
          學分。106
          學年度起，「大一國文」調整為「大學國文」，分為「大學國文一」與「大學國文二」，各自獨立，學生應至少修習
          1 門大學國文；修習 2 門大學國文可充抵通識課程 A1~A4 等 4
          個領域中任一領域，至多 3
          學分。僑生、國際學生應依本校「僑生、國際學生大學國文輔導辦法」修習。
          學生在大學國文與通識之修習方案有二： (一) 6 學分大學國文+12 學分通識
          (2 個指定領域)； (二) 3 學分大學國文+15 學分通識 (3 個指定領域)。
        </Text>
        <Text>
          五、 經共同教育中心核准並公布之專業基礎科目，可採計為通識學分，詳見「
          <ELink href="https://nol.ntu.edu.tw/nol/note/111-1/casge.pdf">
            採計為通識學分之專業基礎科目.pdf
          </ELink>
          」，或至共同教育中心網頁
          <ELink href="https://cge.ntu.edu.tw/cp_n_56967.html">
            https://cge.ntu.edu.tw/cp_n_56967.html
          </ELink>{" "}
          查看。
        </Text>{" "}
        <Text> 六、 修習基本能力課程可充抵通識學分，至多 6 學分。</Text>
        <Text>
          {" "}
          七、
          經認可為兼充通識課程或基本能力課程之一般課程，或可採計為通識學分之專業基礎科目，若為該學生畢業學系之必修課程，或為其畢業學系所開授之課程，不得採計為通識學分。
        </Text>
        <Text>
          八、
          超修或不可採計之通識課程或基本能力課程，採計為一般選修。惟若學生畢業之學系有其他規定，從其規定。
        </Text>
      </Flex>
    </InstructionModal>
  );
}

export function ChineseCoursePrecautionModal() {
  return (
    <InstructionModal title="大學國文選課及修習注意事項">
      <Flex flexDirection={"column"} gap="24px">
        <Text>第一學期：</Text>
        <Text>
          一、「大學國文」分為「大學國文：文學鑑賞與寫作(一)/
          (二)」、「大學國文：文化思想與寫作(一)/
          (二)」及「大學國文：閱讀與寫作(一)/
          (二)」，本校學生至少須修習其中一門，以滿足必修國文3學分之基本要求。
        </Text>
        <Text>
          二、若修習6學分大學國文課程，可充抵通識課程「文學與藝術」、「歷史思維」、「世界文明」、「哲學與道德思考」等四個領域中任一領域，至多3學分。
        </Text>
        <Text>三、本地生「大學國文」系列課程大一至大四任何學期皆可修習。</Text>
        <Text>
          四、本課程如有符合以下情況擬加選者可於第三週週四前洽中文系辦公室處理。
          <OrderedList ml={6} my={5}>
            <ListItem>
              <Flex>班級選課人數未達修課人數上限，擬加選者。</Flex>
            </ListItem>
            <ListItem>
              修畢第二學期「大學國文」，擬加選第一學期「大學國文」者。（需填寫「學生報告書」經授課教師同意）
            </ListItem>
            <ListItem>
              其他特殊狀況。（需填寫「學生報告書」敘明原因經授課教師同意）
            </ListItem>
          </OrderedList>
          以上第2、3兩類每班總共以5名為限。
        </Text>
        <Text>
          五、僑生、國際學生依據本校「僑生、國際學生大學國文輔導辦法」，應參加本校「僑生/國際學生華語文能力檢測」，並依檢測結果修課。
        </Text>
        <Text>
          六、有關國文領域課程最新消息請參閱大學國文網站
          <ELink href="https://cc.cl.ntu.edu.tw/">
            https://cc.cl.ntu.edu.tw/
          </ELink>{" "}
          公告。
        </Text>
        <Text>
          七、符合「國立臺灣大學學士班大學國文免修施行要點」申請條件之本校學生，得依本校公告之「基礎課程免修認證考試」相關規定申請考試。核准免修大學國文者，等同免修共同必修之國文領域課程，給予3學分並計入畢業學分數內；若再修習大學國文課程，所修課程學分與通識學分之充抵，依本校「通識課程與基本能力課程實施辦法」規定辦理。
        </Text>
        <Text>
          八、本地生之轉學生或重考生抵免國文領域後尚不足3學分者，可直接修習「大學國文」系列課程；亦可補修中文系專業科目，請參考下方一覽表。
          <Text
            mt={6}
            sx={{
              textIndent: "1em",
            }}
          >
            僑生、國際學生之轉學生抵免國文領域後，尚不足6學分者，依大一僑生、大一國際學生修習國文方式修課（參考注意事項五及六，視不足學分數修習），亦可補修中文系專業科目，請參考下方一覽表。
          </Text>
        </Text>
        <Flex gap={6}>
          <Text>聯絡人：張怡茵助教</Text> <Text>電話：02-33664005</Text>{" "}
          <Text>E-mail：yiyin747@ntu.edu.tw</Text>
        </Flex>
        <Text>
          轉學生或重考生抵免國文領域後尚不足學分者，若擬於111學年度第1學期補修，可自下列科目擇一修習：
          <UnorderedList my={5} ml={6}>
            <ListItem>佛典導讀（半年 / 3 學分 / 羅鈴沛）</ListItem>{" "}
            <ListItem>神話與文學（半年 / 3 學分 / 李文鈺） </ListItem>
            <ListItem>世紀末文學與文化 （半年 / 3 學分 / 潘少瑜）</ListItem>
            <ListItem>近現代報刊導論（半年 / 2 學分 / 蔡祝青） </ListItem>
            <ListItem>鮑照賦（半年 / 3 學分 / 李錫鎮） </ListItem>
            <ListItem>清代女性詩詞（半年 / 2 學分 / 卓清芬）</ListItem>
          </UnorderedList>
          ※由任課教師決定是否同意加選。
        </Text>
      </Flex>
    </InstructionModal>
  );
}
