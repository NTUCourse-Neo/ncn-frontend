import InstructionModal, {
  ModalButton,
} from "@/components/InstructionModals/InstructionModal";
import {
  Text,
  Flex,
  Box,
  HStack,
  UnorderedList,
  ListItem,
  OrderedList,
  Table,
  Thead,
  Tbody,
  Tr,
  Th as ChakraTh,
  Td as ChakraTd,
  TableColumnHeaderProps,
  TableCellProps,
  TableContainer,
} from "@chakra-ui/react";
import React from "react";
import openPage from "@/utils/openPage";

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

interface ThProps extends TableColumnHeaderProps {
  readonly children: React.ReactNode;
}
const Th: React.FC<ThProps> = ({ children, ...rest }) => {
  return (
    <ChakraTh
      sx={{
        border: "1px solid #1A181C",
        textAlign: "center",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
      }}
      {...rest}
    >
      {children}
    </ChakraTh>
  );
};

interface TdProps extends TableCellProps {
  readonly children: React.ReactNode;
}
const Td: React.FC<TdProps> = ({ children, ...rest }) => {
  return (
    <ChakraTd
      sx={{
        border: "1px solid #1A181C",
        textAlign: "center",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
      }}
      {...rest}
    >
      {children}
    </ChakraTd>
  );
};

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

export function ForeignLanguageCoursePrecautionModal() {
  const tableOneData = [
    ["英文(附一小時英聽)一/二", "300 元"],
    ["英文(附二小時英聽)一/二", "600 元"],
    ["英文(含聽講實習)一/二", "600 元"],
  ];
  const tableTwoData = [
    ["107 22511", "日文一上", "3", "上"],
    ["107 22512", "日文一下", "3", "下"],
    ["107 32521", "日文二上", "3", "上"],
    ["107 32522", "日文二下", "3", "下"],
    ["107 42531", "日文三上", "3", "上"],
    ["107 42532", "日文三下", "3", "下"],
    ["004 30311 (107 50011)", "韓文一上", "3", "上"],
    ["004 30312 (107 50012)", "韓文一下", "3", "下"],
    ["004 30321 (107 50111)", "韓文二上", "3", "上"],
    ["004 30322 (107 50112)", "韓文二下", "3", "下"],
    ["004 30611 (107 50021)", "越南文一上", "3", "上"],
    ["004 30612 (107 50022)", "越南文一下", "3", "下"],
    ["004 30621 (107 50121)", "越南文二上", "3", "上"],
    ["004 30622 (107 50122)", "越南文二下", "3", "下"],
    ["004 30511 (107 50031)", "泰文一上", "3", "上"],
    ["004 30512 (107 50032)", "泰文一下", "3", "下"],
    ["004 30521 (107 50131)", "泰文二上", "3", "上"],
    ["004 30522 (107 50132)", "泰文二下", "3", "下"],
    ["004 30411 (107 50051)", "馬來文一上", "3", "上"],
    ["004 30412 (107 50052)", "馬來文一下", "3", "下"],
    ["(107 50151)", "馬來文二上", "3", "上"],
    ["(107 50152)", "馬來文二下", "3", "下"],
    ["004 30111 (107 50041)", "菲律賓文一上", "3", "上"],
    ["004 30112 (107 50042)", "菲律賓文一下", "3", "下"],
    ["004 30211 (107 50061)", "印尼文一上", "3", "上"],
    ["004 30212 (107 50062)", "印尼文一下", "3", "下"],
    ["004 30221 (107 50161)", "印尼文二上", "3", "上"],
    ["004 30222 (107 50162)", "印尼文二下", "3", "下"],
    ["004 30331", "韓文三上", "3", "上"],
    ["004 30332", "韓文三下", "3", "下"],
    ["004 30531", "泰文三上", "3", "上"],
    ["004 30532", "泰文三下", "3", "下"],
    ["102 22111", "法文一上", "3", "上"],
    ["102 22112", "法文一下", "3", "下"],
    ["102 22211", "德文一上", "3", "上"],
    ["102 22212", "德文一下", "3", "下"],
    ["102 22311", "西班牙文一上", "3", "上"],
    ["102 22312", "西班牙文一下", "3", "下"],
    ["102 22411", "俄文一上", "3", "上"],
    ["102 22412", "俄文一下", "3", "下"],
    ["102 22611", "拉丁文一上", "3", "上"],
    ["102 22612", "拉丁文一下", "3", "下"],
    ["102 22811", "古希臘文一上", "3", "上"],
    ["102 22812", "古希臘文一下", "3", "下"],
    ["102 22821", "義大利文一上", "3", "上"],
    ["102 22822", "義大利文一下", "3", "下"],
    ["102 22831", "葡萄牙文一上", "3", "上"],
    ["102 22832", "葡萄牙文一下", "3", "下"],
    ["102 22910", "初級荷蘭文", "3", "上"],
    ["102 22920", "初級荷蘭文二", "3", "下"],
    ["102 22910", "初級荷蘭文", "3", "上"],
    ["102 22920", "初級荷蘭文二", "3", "下"],
    ["102 22841", "荷蘭文一上", "3", "上"],
    ["102 22842", "荷蘭文一下", "3", "下"],
    ["102 22851", "土耳其文一上", "3", "上"],
    ["102 22852", "土耳其文一下", "3", "下"],
    ["102 22711", "阿拉伯文一上", "3", "上"],
    ["102 22712", "阿拉伯文一下", "3", "下"],
    ["102 22861", "波蘭文一上", "3", "上"],
    ["102 22862", "波蘭文一下", "3", "下"],
    ["102 22881", "捷克文一上", "3", "上"],
    ["102 22882", "捷克文一下", "3", "下"],
    ["102 32121", "法文二上", "3", "上"],
    ["102 32122", "法文二下", "3", "下"],
    ["102 32221", "德文二上", "3", "上"],
    ["102 32222", "德文二下", "3", "下"],
    ["102 32321", "西班牙文二上", "3", "上"],
    ["102 32322", "西班牙文二下", "3", "下"],
    ["102 32421", "俄文二上", "3", "上"],
    ["102 32422", "俄文二下", "3", "下"],
    ["102 32621", "拉丁文二上", "3", "上"],
    ["102 32622", "拉丁文二下", "3", "下"],
    ["102 32821", "古希臘文二上", "3", "上"],
    ["102 32822", "古希臘文二下", "3", "下"],
    ["102 32831", "義大利文二上", "3", "上"],
    ["102 32832", "義大利文二下", "3", "下"],
    ["102 32841", "葡萄牙文二上", "3", "上"],
    ["102 32842", "葡萄牙文二下", "3", "下"],
    ["102 32851", "荷蘭文二上", "3", "上"],
    ["102 32852", "荷蘭文二下", "3", "下"],
    ["102 32861", "土耳其文二上", "3", "上"],
    ["102 32862", "土耳其文二下", "3", "下"],
    ["102 22721", "阿拉伯文二上", "3", "上"],
    ["102 22722", "阿拉伯文二下", "3", "下"],
    ["102 32871", "波蘭文二上", "3", "上"],
    ["102 32872", "波蘭文二下", "3", "下"],
    ["102 32891", "捷克文二上", "3", "上"],
    ["102 32892", "捷克文二下", "3", "下"],
    ["102 54131", "進階法文上", "3", "上"],
    ["102 54132", "進階法文下", "3", "下"],
    ["102 54231", "進階德文上", "3", "上"],
    ["102 54232", "進階德文下", "3", "下"],
    ["102 54331", "進階西班牙文上", "3", "上"],
    ["102 54332", "進階西班牙文下", "3", "下"],
    ["102 54331", "進階西班牙文上", "3", "上"],
    ["102 54332", "進階西班牙文下", "3", "下"],
    ["102 54441", "進階俄文上", "3", "上"],
    ["102 54442", "進階俄文下", "3", "下"],
    ["102 42131", "法文三上", "3", "上"],
    ["102 42132", "法文三下", "3", "下"],
    ["102 42231", "德文三上", "3", "上"],
    ["102 42232", "德文三下", "3", "下"],
    ["102 42231", "西班牙文三上", "3", "上"],
    ["102 42232", "西班牙文三下", "3", "下"],
    ["102 42431", "俄文三上", "3", "上"],
    ["102 42432", "俄文三下", "3", "下"],
    ["102 42451", "葡萄牙文三上", "3", "上"],
    ["102 42452", "葡萄牙文三下", "3", "下"],
    ["102 42461", "波蘭文三上", "3", "上"],
    ["102 42462", "波蘭文三下", "3", "下"],
    ["102 42471", "義大利文三上", "3", "上"],
    ["102 42472", "義大利文三下", "3", "下"],
    ["102 42481", "荷蘭文三上", "3", "上"],
    ["102 42482", "荷蘭文三下", "3", "下"],
    ["102 42491", "捷克文三上", "3", "上"],
    ["102 42492", "捷克文三下", "3", "下"],
  ];
  return (
    <InstructionModal title="外文領域選課注意事項">
      <Flex flexDirection={"column"} gap="24px">
        <Text>111.8.19 更新 </Text>
        <Text>◎ 大一英文 </Text>
        <Text>
          一、自 106
          學年度起，停止辦理「新生入學英語聽力測驗」。學生不需參加測驗，大一英文不會被擋修，可直接選課。本制度不限大一新生，適用所有在學學生。（僑生、國際生仍須參加「僑生、國際學生入學華語文及英語能力檢測」，並依照測驗結果修讀國文與英文。）
        </Text>

        <Text>
          二、請依就讀學系之規定，擇一修習英文領域或外文領域，上下學期必須修習同一語言。若就讀學系規定「外文領域限定修習英文」，請務必修習上下學期英文領域課程。查詢網站：各系所必修課程查詢
          <ELink href="http://140.112.161.31/NTUVoxCourse/index.php/uquery/index">
            http://140.112.161.31/NTUVoxCourse/index.php/uquery/index
          </ELink>
          。
        </Text>
        <Text>三、英文領域課程加選</Text>
        <UnorderedList ml={6} my={2} spacing={4}>
          <ListItem>
            第一學期：初選第一階段：不開放大二以上學生上網選課(電機系大二除外)。初選第二階段：開放所有學生上網選課(不限年級、時段)。開學後加退選期間：所有學生可自行找授課教師加選(不限年級、時段)，經教師同意後請向教師領取授權碼。
          </ListItem>
          <ListItem>
            第二學期：初選第一階段直接帶入同學於第一學期所修習之科目班次；初選期間不開放上網選課，需要轉班或補修下學期課程者，請於加退選期間自行找授課教師加選。
          </ListItem>
        </UnorderedList>
        <Box>
          四、修習下列課程，且使用外語教學暨資源中心教室者，須向外語教學暨資源中心繳交語言實習費：
          <TableContainer my={6} ml={6} w="520px">
            <Table variant={"unstyled"}>
              <Thead>
                <Tr bg="#F6F6F6">
                  <Th>科目名稱</Th>
                  <Th>每學期費用</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableOneData.map((row, index) => (
                  <Tr key={index}>
                    {row.map((cell) => (
                      <Td key={cell}>{cell}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Text>
          五、請依教務處公告之時程辦理加退選、查詢分發結果，並於開學第四週上網確認選課結果。加退選期間若有選課疑問，請至外文系辦公室求助。
        </Text>
        <Text>
          六、轉系、轉學生申請抵免大一英(外)文，依國立臺灣大學學生抵免學分辦法第五條第三點規定：如擬以學分少者抵免學分多者，則應由就讀學系（所）或師資培育中心指定補修科目以補足所差學分，若所差學分無性質相近科目可補修者，不得辦理抵免。
        </Text>
        <Text>
          七、符合大一英文免修條件之大一新生，得申請免修。請依本校行事曆公告之「基礎課程免修申請」期程，至「基礎課程免修作業系統
          <ELink href="https://curri.aca.ntu.edu.tw/waive_base/waive_base.asp">
            https://curri.aca.ntu.edu.tw/waive_base/waive_base.asp
          </ELink>
          」線上提出申請（僑生、國際生請另依「僑生、國際生入學華語文及英文能力檢測通知」所定方式與期限向外文系提出申請）。核准免修大一英文者，等同免修共同必修之外文領域課程及進階英語課程，給予學分並計入畢業學分數內。
        </Text>
        <Text>
          八、依據本校「
          <ELink href="https://www.aca.ntu.edu.tw/WebUPD/aca/CDRules/%E4%B8%80%E8%88%AC%E7%94%9F%E5%A4%A7%E4%B8%80%E8%8B%B1%E6%96%87%E8%BC%94%E5%B0%8E%E8%A6%81%E9%BB%9E.pdf">
            一般生大一英文輔導要點
          </ELink>
          」，部分學生將直接帶入指定之英文班次。欲修習就讀學系認可之其他外文領域課程者，則得退選之。
        </Text>
        <Text color="error.main">
          九、僑生和國際生入學時須參加英語能力檢測，因疫情影響，本次「英文能力測驗」全面線上進行，考量身份驗證問題，測驗結果僅供編班使用，無法免修大一英文。「英文能力測驗」結果顯示英文程度待加強者須修讀僑生、國際學生英文輔導班；其餘到考者，由外文系依所屬學院或學系進行大一英文課程編班。有關僑生和國際生英語能力檢測，請參閱「僑生、國際生入學華語文及英文能力檢測通知」。
        </Text>
        <Text>
          更多詳情請至外文系網站查詢{" "}
          <ELink href="https://www.forex.ntu.edu.tw/">
            https://www.forex.ntu.edu.tw/
          </ELink>
        </Text>
        <Text>◎ 日文及其它外文</Text>
        <Text>
          一、外文領域為全年課程，上學期成績不及格者，不得修習下學期課程。上下學期可選擇不同班次，但必須為同一語言（例如：日文一上＋日文一下；或法文二上＋法文二下）。
        </Text>
        <Box>
          二、97學年度起，學生亦可修習下列由外文系、日文系或外語教學暨資源中心開設之外語課程6學分作為外文領域學分，但上下學期必須為同一語言。
          <TableContainer my={6} ml={6}>
            <Table variant={"unstyled"}>
              <Thead>
                <Tr bg="#F6F6F6">
                  <Th>課程識別碼</Th>
                  <Th>課程名稱</Th>
                  <Th>學分數</Th>
                  <Th>開課學期</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableTwoData.map((row, index) => (
                  <Tr key={index}>
                    {row.map((data) => (
                      <Td key={data}>{data}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
    </InstructionModal>
  );
}

export function PECoursePrecautionModal() {
  return (
    <InstructionModal title="體育選課注意事項">
      <Flex flexDirection={"column"} gap={"24px"}>
        <Text>111.08.03</Text>
        <Text>
          本校體育課為電腦選課，請同學務必依自己的條件並配合下列說明選課：
        </Text>
        <Text>
          一、本校學士班一、二年級體育課為必修課程，課程規劃為「健康體適能」課程
          1 學分與「專項運動學群」課程 3 學分。學士班學生必須修完兩大學群共 4
          學分後方可畢業(體育學分不計入學系應修畢業學分)。
        </Text>
        <Text>
          二、「健康體適能」僅於每年上學期開課，會預先帶入大一新生必修課程中，學生若因個人特殊因素無法隨班上課而退選，且欲選擇其他時段健康體適能課程，則請先取得該時段授課教師同意後始至體育室領取授權碼。
          <OrderedList ml={6} mt={6} spacing={2}>
            <ListItem>大一健康體適能“不開放”初選，退選後即無法加選。</ListItem>
            <ListItem>
              大一上學期健康體適能退選後，也不能選修專項運動學群課程。
            </ListItem>
          </OrderedList>
        </Text>
        <Text>
          三、「專項運動學群」課程採興趣選項分組上課，得自大一下學期起開始修習。(專項運動課程同課名同課號之運動項目可重複選修)
          。
        </Text>
        <Text>
          四、體育選修課程限下列學生選修：
          <Box ml={2} mt={4} gap={2}>
            <Flex>
              (一)已修滿必修課程之學士班學生。(尚未修習完體育必修4學分之學士班學生如欲選「選修體育」，請於開學第三週辦理人工加簽。)
            </Flex>
            <Flex>(二) 碩、博士班研究生。</Flex>
          </Box>
        </Text>
        <Text>
          五、已修滿必修課程之學士班學生及碩、博士班研究生如欲修習「健康體適能」或「專項運動學群」等必修課程當選修學分，請於開學第三週辦理人工加簽。
        </Text>
        <Text>
          六、選修課程不能抵必修學分，「健康體適能」課程 1
          學分與「專項運動學群」課程 3 學分亦不得互抵。
        </Text>
        <Text>
          七、體育課程每學期以修習二門課程為限，且以修習必修學分者為優先。初選階段限分發上最多一門體育，如需加選第二門，應於開學後之加退選期間始得以授權碼。
        </Text>
        <Text>
          八、同學期如選修兩門專項運動學群課程中「同課號、不同班次」之運動項目，其中一門請於第
          3 週下載教師同意加簽單給老師加簽。
        </Text>
        <Text>
          九、校隊體育學分可優先抵免專項運動學群學分，俟專項運動學群 3
          學分抵滿後，始得抵免健康體適能 1 學分。
        </Text>
        <Text>十、凡在體育館內上課者，請自備乾淨球鞋。</Text>
        <Text>
          十一、其餘體育課程相關規定，請參閱{" "}
          <ELink href="https://sec.ntu.edu.tw/001/Upload/18/relfile/9783/25300/08b8dc92-49cf-4514-9b02-a14cabf5ad8d.pdf">
            本校學生體育課程修課辦法.pdf
          </ELink>{" "}
        </Text>
        <Text>
          十二、臺大體育室網址：
          <ELink href="https://pe.ntu.edu.tw">https://pe.ntu.edu.tw</ELink>
          <Flex>體育室教學組聯絡電話：(02)3366-9513</Flex>
        </Text>
      </Flex>
    </InstructionModal>
  );
}

export function ArmyCoursePrecautionLink() {
  return (
    <ModalButton
      title="國防教育選課注意事項"
      isExternal
      onClick={() => {
        openPage(
          "https://ssc.ntu.edu.tw/nationaldefenseeducation1/Courseinformation#anchorPageTitle"
        );
      }}
    />
  );
}

export function ProgramApplicationInfoLink() {
  return (
    <ModalButton
      title="各學程申請詳細資訊"
      isExternal
      onClick={() => {
        openPage("https://ifsel3.aca.ntu.edu.tw/cou_stu/index.php");
      }}
    />
  );
}

export function NTUSystemCourseUpdateScheduleModal() {
  return (
    <InstructionModal title="臺大系統課程更新日程">
      <Flex flexDirection={"column"} gap={6}>
        <Text>111 學年第 1 學期臺大系統課程更新日程</Text>
        <Text>
          為配合臺大系統(臺灣大學、臺灣科技大學、臺灣師範大學)學校選課時間，三校課程預定更新時間如下，請學生依所屬學校規定辦理相關事宜。
        </Text>
        <Box>
          <Flex>111/08/16(二)</Flex> <Flex>111/09/02 (五) </Flex>
          <Flex>111/09/06 (二) </Flex>
          <Flex>111/09/08 (四) </Flex>
          <Flex>111/09/13 (二)</Flex> <Flex>111/09/15 (四)</Flex>
          <Flex>111/09/19 (一)</Flex>
        </Box>
        <Text>
          臺大收到校際選課開放名額後，需要一些轉檔時間，感謝同學的耐心配合 🥺
        </Text>
      </Flex>
    </InstructionModal>
  );
}

export function NTUSystemCourseSelectionPlatformLink() {
  return (
    <ModalButton
      title="臺灣大學系統選課資訊共同平台"
      isExternal
      onClick={() => {
        openPage("https://ifweb.aca.ntu.edu.tw/UniversityAlliance/");
      }}
    />
  );
}

export function ChemistryCoursePrecautionModal() {
  return (
    <InstructionModal title="化學分班編組選課注意事項">
      <Flex flexDirection={"column"} gap={6}>
        <Text>
          修習「普通化學」、「有機化學」、「分析化學」、「物理化學」課程及實驗注意事項
          <Flex>修訂日：111.04</Flex>
        </Text>

        <Box>
          一、 選課絕對條件：
          <OrderedList ml={6} mt={4}>
            <ListItem>
              未修課程者絕對不得先修實驗(即課程應與實驗併修，或先於實驗修習)，期中停修課程者，實驗需一併停修。
            </ListItem>
            <ListItem>
              全年課程及實驗未修上學期(或相當科目1學期)者，絕對不得先修下學期課程或實驗。
            </ListItem>
            <ListItem>
              未曾修習普化實驗者，絕對不得先修有機實驗或分析實驗。
            </ListItem>
            <ListItem>
              未符修課/分班條件或授課教師不同意修習者須自行退選。
            </ListItem>
            <ListItem>
              各系有更嚴格規定者從其規定。(例：醫學系生第一次修習者需於學期中修原班次，不可換班及暑修)。
            </ListItem>
          </OrderedList>
        </Box>

        <Box>
          二、 分班規定：
          <OrderedList ml={6} mt={4}>
            <ListItem>
              各系應依「分班編組上課時間表」中授課對象別，選定所屬之分班課程及實驗班次；高年級補、選修之學生亦同。
            </ListItem>
            <ListItem>全年課程之上下學期，應選同一班次。</ListItem>
            <ListItem>
              請修習者（課程及實驗）依規定進行網路加選事宜：
              <ol
                type="a"
                style={{
                  marginLeft: "24px",
                }}
              >
                <li>實驗課加選前需先與助教確定 </li>
                <li>加選方式為『2』者須先向教師/助教取得加選授權碼</li>
                <li>
                  除普通化學課程外，需經教師/助教要求填寫申請書後至化學系辦公室領取授權碼。
                </li>
              </ol>
            </ListItem>
          </OrderedList>
        </Box>

        <Box>
          三、 課程先後修習規定：
          <OrderedList ml={6} mt={4}>
            <ListItem>
              未修習「普通化學」者，不得修習有機、分析、物化課程。
            </ListItem>
            <ListItem>
              曾修習「普通化學」(通過或未通過)，可續修習有機、分析、物化課程。
            </ListItem>
            <ListItem>
              本系所開全年課程(含普化/有機/分析/物化)，上學期未曾修習者不得直接修習下學期；上學期曾經修習但未及格者，仍可繼續修習下學期課程。(有機一、二視為全年課程)
            </ListItem>
          </OrderedList>
        </Box>
        <Box>
          四、 實驗修習規定：
          <OrderedList ml={6} mt={4}>
            <ListItem>
              未修「普通化學」、「有機化學」、「分析化學」課程者，絕對不得先修該課程之實驗。
            </ListItem>
            <ListItem>
              未修習「普通化學實驗」者，絕對不得先修習「有機化學實驗」、「分析化學實驗」。曾修習「普通化學實驗」者(通過或未通過)，可修習有機實驗/分析實驗。
            </ListItem>
            <ListItem>
              全年實驗，上學期(或相當科目1學期)未修習者，絕對不得修習下學期實驗。
            </ListItem>
            <ListItem>
              有機/分析化學全年實驗與半年實驗不同。全年課程需搭配全年實驗，半年課程需搭配半年實驗。如有特殊情形需全年課程搭配半年實驗者，僅同意於下學期修習實驗。並請提出書面申請，經實驗負責教師同意後修習。
            </ListItem>
            <ListItem>
              94學年度起普化實驗(1學期)
              與普化實驗上(全年實驗之上學期)實驗內容相同，可以互相充抵，免填申請書，如需化學系開立證明，請向化學系辦公室索取
            </ListItem>
            <ListItem>
              因每一實驗室空間有限，故須有修課學生人數之限制；當選課人數超過實驗室容量時，實驗教師及助教得視情況，請非該班次指定之授課對象或選修生轉班或退選。
            </ListItem>
            <ListItem>
              96學年度開始網路加退選，學校會經由檔修規定審核學生選課情形，原則上系統會剔除不符合修課規定者，即便系統未剔除，不合修課規定者仍不得修習。
            </ListItem>
          </OrderedList>
        </Box>
        <Text>
          五、全校外系學生，請依
          <ELink href="https://www.ch.ntu.edu.tw/office/eform/doc/r221.pdf">
            臺大化學系抵免/充抵審查規則(外系分班課程及實驗).pdf{" "}
          </ELink>
          核可充抵及補修科目。(充抵申請書下載 _____)
        </Text>
        <Text>
          ※
          請注意各選課相關規定上網路加退選（加選方式為『2』者須先向教師/助教取得授權碼），除普通化學課程外，須經教師/助教要求填寫申請書後至化學系辦公室領取授權碼。
        </Text>
        <Text>
          ※ 若需使用化學系表單，可至化學系網站查詢(
          <ELink href="https://www.ch.ntu.edu.tw/edoc/form/">
            https://www.ch.ntu.edu.tw/edoc/form/
          </ELink>
          )，或至化學系辦課程表單櫃取用
        </Text>
        <Text>
          ※ 未竟事宜詳學校及化學系相關規定(
          <ELink href="https://www.ch.ntu.edu.tw/edoc/rule/">
            https://www.ch.ntu.edu.tw/edoc/rule/
          </ELink>
          )。如有疑義請洽化學系辦課務櫃檯同仁尤靜嫺小姐 (33661139)。
        </Text>
      </Flex>
    </InstructionModal>
  );
}

type TableCell = {
  text: string;
  rowSpan?: number;
  fontSize?: number;
};
type TableData = (TableCell | null)[][];
export function CalculasCoursePrecautionModal() {
  const calculasCourseTable: TableData = [
    [
      { text: "微積分1/\n微積分2\n 01班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "180" },
      {
        text: "密集課程。限電機系學生修習。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      {
        text: "為配合統一教學班之進度，故期中、期末考會在周末考試。此為模組班，第1~8週上「微積分1」，停修截止時間為10/14；第9~16週上「微積分2」，退選截止時間為11/4，停修截止時間為11/25。僅需選微積分1，微積分2於初選階段直接帶入，不修微積分2的同學請自行退選微積分2。加退選階段不會自動帶入微積分2，需自行選課。",
        rowSpan: 11,
        fontSize: 11,
      },
    ],
    [
      { text: "微積分1/\n微積分2\n 03班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "150" },
      {
        text: "密集課程。限材料、資工、資管系學生修習。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 04班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "110" },
      {
        text: "密集課程。限材料、資工、資管系學生修習。英文授課。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 05班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "80" },
      {
        text: "密集課程。限物理系學生修習。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 06-07班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "140" },
      {
        text: "密集課程。限機械、化工、化學、大氣、醫工系學生修習。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 09-10班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "120" },
      {
        text: "密集課程。限生機、生工、地質、工科海洋系學生修習。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 11班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "120" },
      {
        text: "密集課程。限土木系學生修習。英文授課。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 12班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "140" },
      {
        text: "密集課程。限機械、化工、化學、大氣、醫工系學生修習。英文授課。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 13班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "180" },
      {
        text: "密集課程。限經濟系學生修習。英文授課。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 14-16班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "180" },
      {
        text: "密集課程。限工管、會計、財金、國企、地理系學生修習。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 17-18班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "140" },
      {
        text: "限農藝、森林、農經、 昆蟲、心理、生科院各系(生技、生科)系學生修習。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分1/\n微積分2\n 17-18班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "140" },
      {
        text: "限農藝、森林、農經、 昆蟲、心理、生科院各系(生技、生科)系學生修習。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      {
        text: "此為模組班，第1~8週上「微積分1」，停修截止時間為10/14；第9~16週上「微積分2」，退選截止時間為11/4，停修截止時間為11/25。微積分2於初選階段直接帶入，不修微積分2的同學請自行退選微積分2。僅需選微積分1，微積分2於初選階段直接帶入，不修微積分2的同學請自行退選微積分2。加退選階段不會自動帶入微積分2，需自行選課。",
        fontSize: 11,
        rowSpan: 2,
      },
    ],
    [
      { text: "微積分1/\n微積分2\n 19班" },
      { text: "半" },
      { text: "2+2" },
      { text: "4" },
      { text: "1" },
      { text: "140" },
      {
        text: "限農藝、森林、農經、 昆蟲、心理、生科院各系(生技、生科)系學生修習。英文授課。每班大二以上限20人，為統一教學班，有實習課。",
        fontSize: 11,
      },
      null,
    ],
    [
      { text: "微積分乙上\n01-02班" },
      { text: "全" },
      { text: "3" },
      { text: "3" },
      { text: "0" },
      { text: "120" },
      {
        text: "限限醫學院各系(牙醫、藥學、醫技、物治)、農化、公衛系學生修習。每班大二以上限20人。",
        fontSize: 11,
      },
      {
        text: "",
      },
    ],
    [
      { text: "微積分乙上\n01班" },
      { text: "半" },
      { text: "3" },
      { text: "4" },
      { text: "0" },
      { text: "170" },
      {
        text: "限醫學系學生修習。",
        fontSize: 11,
      },
      {
        text: "",
      },
    ],
  ];
  return (
    <InstructionModal title="微積分分班編組選課注意事項">
      <Flex flexDirection="column" gap={6}>
        <Box>111學年度第1學期『微積分』課程選課說明</Box>
        <Box>
          一、本系為達到區別系所特性設計課程，並提高學習效果，而採分組限制選課。
        </Box>
        <Box>
          二、111學年度微積分課程開設類別及班數如下：
          <TableContainer my={6} py={1}>
            <Table w="100%">
              <Thead>
                <Tr>
                  <Th>課程名稱</Th>
                  <Th px={1}>全/半年</Th>
                  <Th>學分</Th>
                  <Th px={1}>講演時數</Th>
                  <Th>實習</Th>
                  <Th px={1}>修課人數</Th>
                  <Th>修課對象</Th>
                  <Th>備註</Th>
                </Tr>
              </Thead>
              <Tbody>
                {calculasCourseTable.map((row, index) => (
                  <Tr key={index}>
                    {row.map((cell) =>
                      cell === null ? null : (
                        <Td
                          rowSpan={cell?.rowSpan ?? 1}
                          whiteSpace={"pre-wrap"}
                          px={1}
                          key={cell.text}
                        >
                          <Flex
                            justify={"center"}
                            sx={{
                              fontSize: `${cell?.fontSize ?? 14}px`,
                              color: "#2d2d2d",
                            }}
                          >
                            {cell.text}
                          </Flex>
                        </Td>
                      )
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex>
            註：微積分1 + 微積分2 = 微積分甲上；微積分3 + 微積分4 =
            微積分甲下；微積分1 + 微積分2 + 微積分 3 = 微積分乙上 + 微積分乙下
          </Flex>
        </Box>
        <Box>
          三、網路選課
          <OrderedList ml={6} mt={6}>
            <ListItem>
              <Flex color="error.main" display={"inline"}>
                電腦初選 第一階段時間 為111年8月17日至111年8月19日止
              </Flex>
              ，學生請依所屬學系分配之時段、可修習之微積分班級上網選課，非該時段、非可修習該班級之系所學生將在選課後統一刪除。
            </ListItem>
            <ListItem>
              <Flex color="error.main" display={"inline"}>
                電腦初選 第二階段時間 為111年8月24日至111年8月25日止
              </Flex>
              ，學生可上網查詢自己所選上之班次；未選上的同學，仍須依所屬學系分配之時段、可修習之微積分班級就尚有餘額之班次加選。非該時段、非可修習該班級之系所學生將在選課後統一刪除。
            </ListItem>
            <ListItem>
              <Flex color="error.main" display={"inline"}>
                網路加退選課程時間 為111年9月5日至111年9月19日(上午8點止)
              </Flex>
              ，電腦初選未選上或電腦選課已選上欲退換班之同學，
              請於網路加退選期間自行上網作業，此時段
              <Flex color="error.main" display={"inline"}>
                無系所身份限制。
              </Flex>
            </ListItem>
          </OrderedList>
        </Box>
        <Box>
          四、教師同意加簽單
          <OrderedList ml={6} mt={6}>
            <ListItem>
              受理時間：
              <Flex color="error.main" display={"inline"}>
                111年9月19日至111年9月23日 每日上午08:30至下午5:00止。
              </Flex>
            </ListItem>
            <ListItem>
              加簽班級與方式：
              <Flex color="error.main" display={"inline"}>
                僅能加簽人數未滿之班級。
              </Flex>
            </ListItem>
            <ListItem>
              核章流程：由系辦公室確認後發出加簽單後，請交由班級教師簽名，請於
              <Flex color="error.main" display={"inline"}>
                111年9月23日下午5:00前
              </Flex>
              送至學校註冊組。
            </ListItem>
            <ListItem>
              加簽週
              <Flex color="error.main" display={"inline"}>
                不授理更換微積分班級(已有選到微積分課程者，不再受理加簽，也不辦理退選)。
              </Flex>
            </ListItem>
          </OrderedList>
        </Box>
        <Box>五、微積分課程問題諮詢</Box>
        <Box>
          <Flex>聯絡人：天文數學館503系辦公室 趙怡茹</Flex>
          <Flex>聯絡電話：3366-2819</Flex>
        </Box>
      </Flex>
    </InstructionModal>
  );
}

export function AdvancedEnglishCoursePrecautionModal() {
  const advancedEnglishCourseTableData: TableData = [
    [
      {
        text: "004 20110",
        rowSpan: 6,
      },
      {
        text: "01",
      },
      {
        text: "進階英語一\n（綜合）\nG101綜合班",
        rowSpan: 3,
      },
      {
        text: "劉威辰",
      },
      {
        text: "教學方式主要是教師授課，講解課文重點，例如字彙或是文法概念，以及閱讀策略方面的教學，教師也會另外補充教材主題相關的聽力練習。",
        fontSize: 11,
        rowSpan: 2,
      },
    ],
    [
      null,
      {
        text: "02",
      },
      null,
      {
        text: "陳逸軒",
      },
      null,
    ],
    [
      null,
      {
        text: "03",
      },
      null,
      {
        text: "莊世全",
      },
      {
        text: "綜合學術英語專班，課程內容將以G101為基礎，並增加一些學術英語內容與教材;教學方式主要是教師授課，講解課文重點，例如字彙或是文法概念，以及閱讀策略方面的教學，教師也會另外補充教材主題相關的聽力練習。",
        fontSize: 11,
      },
    ],
    [
      null,
      {
        text: "04",
      },
      {
        text: "進階英語一\n（綜合）\nG201綜合班",
      },
      {
        text: "俞燕妮",
      },
      {
        text: "The course introduces ICT-based (Information and Communication Technology) foreign language learning strategies that seek to build up the students’ own personal eLearning framework (i.e., awareness of self, language learning processes and structures, linguistic knowledge, and communication skills), a vital element of second/foreign language learning which allows students to define, manage and self-regulate their learning continuously while equipping them with core knowledge of General/Specialized Education. This course also trains students in academic skills such as critical thinking and research.",
        fontSize: 11,
      },
    ],
    [
      null,
      {
        text: "05",
      },
      {
        text: "進階英語一\n（綜合）\nG101綜合班",
        rowSpan: 2,
      },
      {
        text: "王珊珊",
      },
      {
        text: "為「進階英語」課程綜合班的最高級別，課程內容以主教材的閱讀策略為主，搭配影音材料與練習題，提供學生所需的聽力與閱讀學習資源。授課老師另規劃口說活動，增加學生較具挑戰性的英語練習機會。",
        fontSize: 11,
        rowSpan: 2,
      },
    ],
    [
      null,
      {
        text: "06",
      },
      null,
      {
        text: "劉威辰",
      },
      null,
    ],
    [
      {
        text: "004 20310",
        rowSpan: 2,
      },
      {
        text: "01",
      },
      {
        text: "進階英語一\n（聽力）\nL101聽力班",
      },
      {
        text: "徐維娟",
      },
      {
        text: "以「Drill Exercise」為學習方式，著重日常生活中常見主題的談話大意理解訓練，並藉由線上英語學習軟體提供互動教學，另搭配聽力技巧訓練及口說練習",
        fontSize: 11,
      },
    ],
    [
      null,
      {
        text: "02",
      },
      {
        text: "進階英語一\n（聽力）\nL201聽力班",
      },
      {
        text: "莊世全",
      },
      {
        text: "以聽力技巧訓練為主，著重聽取大意及重要細節，同時搭配課本教材的線上練習，另外亦包含以大學課堂英語為學習聽力的素材，加強學術英語與訓練做筆記的概念，並運用新聞及學習技巧相關線上英語學習軟體供學生自學。",
        fontSize: 11,
      },
    ],
    [
      {
        text: "004 20410",
      },
      {
        text: "01",
      },
      {
        text: "進階英語一\n（口說）\n口說班",
      },
      {
        text: "徐維娟",
      },
      {
        text: "本課程目標為幫助同學勇敢以英語表達意見。學期內容涵蓋醫藥、經濟、金融、政治、環保、科技、教育、文化、娛樂等領域。上課時密集練習，積極提升同學的口語、聽力與發音。",
        fontSize: 11,
      },
    ],
  ];
  return (
    <InstructionModal title={"「進階英文一」課程選課須知"}>
      <Flex flexDirection={"column"} gap={6}>
        <Box>111學年第一學期「進階英語一」課程選課須知 </Box>
        <Box>
          一、
          選課對象：本校尚未修習，或未達本課程免修標準之學士班二年級（含）以上及進修學士班同學。
        </Box>
        <Box>
          二、 選課前注意事項及說明：
          <OrderedList ml={6} mt={6} spacing={6}>
            <ListItem>
              有意於畢業後參加國家考試、證照考試，或服預官役的同學，如需修讀「進階英語」課程，請儘早規劃完成修讀本課程的時間，以免屆臨畢業時因未修畢本課程而無法如期取得畢業證書，影響自身權益。
            </ListItem>
            <ListItem>
              本中心因課程規劃，110
              學年暑假起不再開設「進階英語」暑期班課程。無意參加英語檢定，擬以修讀「進階英語」課程方式於明年準時畢業的學士班同學，請於本學年
              (111) 至本校選課網完成課程選讀，以免影響畢業時程。
            </ListItem>
            <ListItem>
              基於課程設計理念，進階英語課程開放給含學士班二年級以上及進修學士班同學修讀，不開放學士班一年級、研究所博士班、碩士班學生選課。每學期一位同學僅能分發選讀一門進階英語課程，重複選課將註銷本課程全部選課紀錄。
            </ListItem>
            <ListItem>
              進階英語課程開放網路選課：
              <Flex my={4} gap={2} flexDirection={"column"}>
                <Flex>
                  4-1
                  各班級網路預選（課）人數超過修課人數上限時，由高年級至低年級依序分發。
                </Flex>
                <Flex>
                  4-2
                  倘高年級預選（課）人數已超過修課人數上限，則高年級全部預選人選以亂數分配方式分發。
                </Flex>
                <Flex>
                  4-3
                  未達修課人數上限班級之餘額，開放於開學第一週至第二週由各班級授課教師核發加選授權碼，授權碼核發規則由授課教師決定，不一定以高至低年級為核發規則。
                </Flex>
                <Flex>
                  4-4 本學年 (111) 將新增進階英語一 (綜合)
                  第03班，此班為綜合學術英語班，為鼓勵同學們提早選讀進階英語課程，為未來修習全英語授課課程預作準備，網路選課期間將僅開放大二學士班同學選讀，網路選課結束後之餘額，於開學第一週至第二週期間，由授課教師以核發加選授權碼方式，發給學士班二年級(含)以上學士班同學(即除一年級以外，不限年級的學士班同學)，授權碼核發規則仍由授課教師決定。
                </Flex>
              </Flex>
            </ListItem>
            <ListItem>
              所有班級之任課老師均保有同意學生上課與否的最後決定權利。第一次上課未到課，且未向授課老師請假並獲同意者，授課老師得請註冊組註銷該學生選課資格，並將名額轉給其他同班候補學生，不得異議。
            </ListItem>
          </OrderedList>
        </Box>
        <Box>
          三、 課程種類：
          <OrderedList mt={6} ml={6} spacing={4}>
            <ListItem>
              為全學年上、下兩學期課程，上學期為「進階英語一」，下學期為「進階英語二」。
            </ListItem>
            <ListItem>
              每學期課程分三類：(1) 綜合班 (2) 聽力班 (3)口說班。
            </ListItem>
            <ListItem>
              各類班別如下，同學可依課程教學內容說明，選擇符合自己學習需求的班級修讀：
              <Flex mt={4}>
                3-1
                班別主要依全民英語能力分級檢定測驗之中高級聽讀測驗成績為主要分班依據，各班級分數區間如下：
              </Flex>
              <Flex>綜合班：</Flex>
              <TableContainer my={4}>
                <Table>
                  <Tbody>
                    <Tr>
                      <Td>G101綜合班</Td>
                      <Td>
                        {`聽力(L)測驗及閱讀(R)測驗成績總和小於 104 分(R+L<104)`}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>G201綜合班</Td>
                      <Td>
                        {`聽力(L)測驗及閱讀(R)測驗成績總和達 104 分，並小於 134 分(104≦L+R<134)`}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>G301綜合班</Td>
                      <Td>
                        {`聽力(L)測驗及閱讀(R)測驗成績總和達 134 分，並小於 160 分(134≦L+R<160)`}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Flex>聽力班(本表分數以中高級聽讀測驗成績為班級區分依據)：</Flex>
              <TableContainer my={4}>
                <Table>
                  <Tbody>
                    <Tr>
                      <Td>聽力</Td>
                      <Td>{`60（含）以下`}</Td>
                      <Td>{`61（含）~79（含）`}</Td>
                    </Tr>
                    <Tr>
                      <Td>閱讀</Td>
                      <Td>{`60（含）以下`}</Td>
                      <Td>{`61（含）~79（含）`}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Flex>
                *全民英檢中高級初試通過標準：兩項測驗成績總和達160分，且其中任一項成績不低於72分。
              </Flex>
              <Flex mt={4}>
                範例一：甲生成績為聽力67分、閱讀52分，適合修讀G201/G202班。
              </Flex>
              <Flex mb={4}>
                範例二：乙生成績為聽力35分、閱讀82分，適合修讀L101/L102班。
              </Flex>
              <Flex>
                3-2
                上表以全民英語能力分級檢定測驗中高級聽讀測驗成績訂定之班級分類，僅為同學選課參考之一；未曾參加任何英語檢定的同學，亦可依適合自己的時間或興趣，選讀適合自己的班級課程。
              </Flex>
              <TableContainer my={4}>
                <Table>
                  <Tbody>
                    <Tr>
                      <Td colSpan={5}>
                        111學年第一學期「進階英語一」課程各班開課資訊
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>課程識別碼</Td>
                      <Td>班次</Td>
                      <Td>班別/級別</Td>
                      <Td>授課教師</Td>
                      <Td>課程教學內容說明</Td>
                    </Tr>
                    {advancedEnglishCourseTableData.map((row, index) => (
                      <Tr key={index}>
                        {row.map((cell) =>
                          cell === null ? null : (
                            <Td
                              rowSpan={cell?.rowSpan ?? 1}
                              whiteSpace={"pre-wrap"}
                              px={1}
                              key={cell.text}
                            >
                              <Flex
                                justify={"center"}
                                sx={{
                                  fontSize: `${cell?.fontSize ?? 14}px`,
                                  color: "#2d2d2d",
                                }}
                              >
                                {cell.text}
                              </Flex>
                            </Td>
                          )
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </ListItem>
          </OrderedList>
        </Box>
        <Box>
          四、 若還有其他問題，歡迎同學來信詢問，本中心公務信箱
          <ELink href="mailto:ntufltc@ntu.edu.tw">ntufltc@ntu.edu.tw</ELink>
        </Box>
      </Flex>
    </InstructionModal>
  );
}

export function DomainExpertisePrecautionLink() {
  return (
    <ModalButton
      title="領域專長查詢系統"
      isExternal
      onClick={() => {
        openPage(
          "https://specom.aca.ntu.edu.tw/Domain/doma-list?searchText=&searchType=course_name&college=0&department=0"
        );
      }}
    />
  );
}

export const precautions = {
  courseSelectionRule: <CourseSelectionRulesModal />,
  generalCommonCoursePrecaution: <GeneralCommonCoursePrecautionModal />,
  chineseCoursePrecaution: <ChineseCoursePrecautionModal />,
  foreignLanguageCoursePrecaution: <ForeignLanguageCoursePrecautionModal />,
  peCoursePrecaution: <PECoursePrecautionModal />,
  armyCoursePrecaution: <ArmyCoursePrecautionLink />,
  programApplicationInfo: <ProgramApplicationInfoLink />,
  ntuSystemCourseUpdateSchedule: <NTUSystemCourseUpdateScheduleModal />,
  ntuSystemCourseSelectionPlatform: <NTUSystemCourseSelectionPlatformLink />,
  chemistryCoursePrecaution: <ChemistryCoursePrecautionModal />,
  calculasCoursePrecaution: <CalculasCoursePrecautionModal />,
  advancedEnglishCoursePrecaution: <AdvancedEnglishCoursePrecautionModal />,
  domainExpertisePrecaution: <DomainExpertisePrecautionLink />,
};
export type PrecautionName = keyof typeof precautions;
