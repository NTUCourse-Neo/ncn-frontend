import { React } from "react";
import { Flex, Heading, Badge, Text, Spacer, Button, ButtonGroup } from "@chakra-ui/react";
import { FaPlus, FaInfoCircle } from "react-icons/fa";
import { info_view_map } from "data/mapping_table";
import { useNavigate } from "react-router-dom";

function RenderNolContentBtn(course, title, key) {
  const navigate = useNavigate();
  const toCourseInfoPage = (code) => {
    navigate(`/courseinfo/${code}`);
  };

  return (
    <>
      <Button
        variant="ghost"
        colorScheme="blue"
        leftIcon={<FaInfoCircle />}
        size="sm"
        onClick={() => {
          toCourseInfoPage(course._id);
        }}
        key={"NolContent_" + key}
      >
        {title}
      </Button>
    </>
  );
}

function openPage(url, doClose) {
  const wnd = window.open(url, "_blank");
  if (doClose) {
    // console.log("closing");
    setTimeout(() => {
      wnd.close();
    }, 1000);
  }
}
const genNolAddUrl = (course) => {
  const d_id = "T010";
  return `https://nol.ntu.edu.tw/nol/coursesearch/myschedule.php?add=${course.id}&ddd=${d_id}`;
};
const genNolUrl = (course) => {
  const lang = "CH";
  const base_url = "https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?";
  const course_id = course.course_id.replace("E", "");
  const params = `course_id=${course_id.substr(0, 3)}%20${course_id.substr(3)}&class=${course.class_id}&ser_no=${
    course.id
  }&semester=${course.semester.substr(0, 3)}-${course.semester.substr(3, 1)}&lang=${lang}`;
  return base_url + params;
};

function DrawerDataTag({ fieldName, label }) {
  if (label === "" || label === null || label === undefined) {
    return <></>;
  }
  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="start" mr="4" minW="10vw">
      <Badge variant="solid" colorScheme="gray">
        {fieldName}
      </Badge>
      <Heading as="h3" color="gray.600" fontSize="sm" ml="4px">
        {label}
      </Heading>
    </Flex>
  );
}

function CourseDrawerContainer({ courseInfo }) {
  return (
    <Flex px="1" flexDirection="column" width="100%" alignItems="start" justifyContent="space-between">
      <Flex ml="2px" flexDirection="row" alignItems="center" justifyContent="start" flexWrap="wrap" css={{ gap: ".5rem" }}>
        <DrawerDataTag fieldName={"課程識別碼"} label={courseInfo.course_id} />
        <DrawerDataTag fieldName={"課號"} label={courseInfo.course_code} />
        <DrawerDataTag fieldName={"班次"} label={courseInfo.class_id} />
        <DrawerDataTag fieldName={info_view_map.enroll_method.name} label={info_view_map.enroll_method.map[courseInfo.enroll_method]} />
        <DrawerDataTag fieldName={info_view_map.language.name} label={info_view_map.language.map[courseInfo.language]} />
        <DrawerDataTag fieldName={"開課單位"} label={courseInfo.provider.toUpperCase()} />
      </Flex>
      <Spacer my="2" />
      <Flex
        w="100%"
        flexDirection="row"
        alignItems="start"
        justifyContent="start"
        borderRadius="md"
        border="2px"
        borderColor="gray.200"
        flexWrap="wrap"
        css={{ gap: "4px" }}
      >
        <Flex w={{ base: "100%", md: "30%" }} flexDirection="column" alignItems="start" justifyContent="start" p="2">
          <Heading as="h3" color="gray.600" fontSize="lg" ml="4px" mb="1">
            修課限制
          </Heading>
          <Text fontSize="sm" color="gray.800" mx="4px">
            {courseInfo.limit === "" ? "無" : courseInfo.limit}
          </Text>
        </Flex>
        <Flex w={{ base: "100%", md: "60%" }} flexDirection="column" alignItems="start" justifyContent="start" p="2">
          <Heading as="h3" color="gray.600" fontSize="lg" ml="4px" mb="1">
            備註
          </Heading>
          <Text fontSize="sm" color="gray.800" mx="4px">
            {courseInfo.note === "" ? "無" : courseInfo.note}
          </Text>
        </Flex>
      </Flex>
      <Spacer my="2" />
      <Flex
        w="100%"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "start", md: "center" }}
        justifyContent={{ base: "start", md: "space-between" }}
        flexWrap="wrap"
        css={{ gap: "2px" }}
      >
        <ButtonGroup size="sm" isAttached variant="outline" colorScheme="blue">
          {["ceiba", "cool"].map((linkName) => {
            const url = courseInfo.url?.[linkName];
            if (!url || url === "") {
              return null;
            }
            return (
              <Button key={`${linkName}`} size="sm" mr="-px" onClick={() => openPage(url)}>
                {linkName.toUpperCase()}
              </Button>
            );
          })}
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="ghost" colorScheme="blue" leftIcon={<FaPlus />} size="sm" onClick={() => openPage(genNolAddUrl(courseInfo), true)}>
            加入課程網
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}

export { CourseDrawerContainer, RenderNolContentBtn, genNolAddUrl, genNolUrl, openPage };
