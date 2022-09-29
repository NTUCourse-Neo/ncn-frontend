import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Divider,
  Flex,
  useBreakpointValue,
  Radio,
  RadioGroup,
  Stack,
  FlexProps,
  Box,
} from "@chakra-ui/react";
import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  forwardRef,
  RefObject,
  createRef,
} from "react";
import { college_map } from "data/college";
import { deptList } from "data/department";
import FilterElement from "components/FilterModals/components/FilterElement";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { reportEvent } from "utils/ga";
import type { Department } from "types/course";

interface IsSeleciveRadioGroupProps extends FlexProps {
  readonly isSelective: boolean | null;
  readonly setIsSelective: (isSelective: boolean | null) => void;
}
function IsSeleciveRadioGroup(props: IsSeleciveRadioGroupProps) {
  const { isSelective, setIsSelective, ...rest } = props;
  return (
    <Flex alignItems={"center"} {...rest}>
      <RadioGroup
        onChange={(next) => {
          if (next === "all") {
            setIsSelective(null);
          } else if (next === "selective") {
            setIsSelective(true);
          } else if (next === "required") {
            setIsSelective(false);
          }
        }}
        value={
          isSelective === null
            ? "all"
            : isSelective === false
            ? "required"
            : "selective"
        }
      >
        <Stack
          direction="row"
          spacing={4}
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#666666",
            letterSpacing: "0.05em",
          }}
        >
          <Radio value={"all"}>全部</Radio>
          <Radio value={"required"}>必修課程</Radio>
          <Radio value={"selective"}>選修課程</Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
}

interface ModalDeptSectionProps {
  readonly college_key: string;
  readonly departments: Department[];
  readonly selectedDept: string[];
  readonly setSelectedDept: (selectedDept: string[]) => void;
  readonly activeDept: string | null;
  readonly setActiveDept: (activeDept: string | null) => void;
  readonly collegeRefs: Record<string, React.RefObject<HTMLDivElement>>;
  readonly flexProps?: FlexProps;
}
const ModalDeptSection = forwardRef<HTMLDivElement, ModalDeptSectionProps>(
  (props, ref) => {
    const {
      college_key,
      departments,
      selectedDept,
      setSelectedDept,
      activeDept,
      setActiveDept,
      collegeRefs,
      flexProps,
    } = props;
    const sectionRef = collegeRefs[college_key];
    const modalBody = (ref as RefObject<HTMLDivElement>).current;

    useEffect(() => {
      // ref: https://dev.to/maciekgrzybek/create-section-navigation-with-react-and-intersection-observer-fg0
      const observerConfig = {
        root: modalBody ?? null,
        rootMargin: `0px 0px -80% 0px`,
      };
      const handleIntersection = function (
        entries: IntersectionObserverEntry[]
      ) {
        entries.forEach((entry) => {
          if (entry.target.id !== activeDept && entry.isIntersecting) {
            setActiveDept(entry.target.id);
          }
        });
      };
      const observer = new IntersectionObserver(
        handleIntersection,
        observerConfig
      );
      observer.observe(sectionRef.current as Element);
      return () => observer.disconnect();
    }, [activeDept, modalBody, sectionRef, setActiveDept]);

    return (
      <Box>
        <Box
          ref={sectionRef}
          id={college_key}
          h="1px"
          w="100%"
          bg="transparent"
        />
        <Flex
          p="2"
          h="40px"
          flexDirection="column"
          justifyContent="center"
          position="sticky"
          top="0"
          zIndex="50"
          bg={"white"}
          {...flexProps}
        >
          <Heading fontSize="2xl" color={"heading.light"}>
            {college_key + " " + college_map[college_key].name}
          </Heading>
        </Flex>
        <Divider pt={2} />
        {departments
          .filter((dept) => !selectedDept.includes(dept.id))
          .map((dept, dept_index) => (
            <FilterElement
              key={`${dept.id}-${dept_index}-modalBody`}
              id={dept.id}
              name={dept.name_full}
              selected={false}
              onClick={() => {
                setSelectedDept([...selectedDept, dept.id]);
                reportEvent("filter_department", "click", dept.id);
              }}
            />
          ))}
      </Box>
    );
  }
);
ModalDeptSection.displayName = "ModalDeptSection";

export interface DeptFilterModalProps {
  readonly title: string;
  readonly isActive?: boolean;
}
function DeptFilterModal({ title, isActive = false }: DeptFilterModalProps) {
  const { searchFilters, setSearchFilters } = useCourseSearchingContext();
  const [selectedDept, setSelectedDept] = useState(searchFilters.department);
  const [isSelective, setIsSelective] = useState<boolean | null>(
    searchFilters.is_selective
  );
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // clickable navigation link && scrollIntoView effect
  const collegeRefs = Object.keys(college_map).reduce((refsObj, collegeId) => {
    refsObj[collegeId] = createRef<HTMLDivElement>();
    return refsObj;
  }, {} as Record<string, RefObject<HTMLDivElement>>);
  const scrollToCollege = (collegeId: string) => {
    collegeRefs?.[collegeId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const onOpenModal = () => {
    // overwrite local states by context
    setSelectedDept(searchFilters.department);
    setIsSelective(searchFilters.is_selective);
    onOpen();
  };

  const onCancelEditing = () => {
    // fire when click "X" or outside of modal
    // overwrite local state by context
    onClose();
    setSelectedDept(searchFilters.department);
    setIsSelective(searchFilters.is_selective);
  };

  const onSaveEditing = () => {
    // fire when click "Save"
    // overwrite redux state by local state
    setSearchFilters({
      ...searchFilters,
      department: selectedDept,
      is_selective: isSelective,
    });
    onClose();
  };

  const onResetEditing = () => {
    // fire when click "Reset"
    // set local state to empty array
    setSelectedDept([]);
    setIsSelective(null);
  };

  const modalBody = useMemo(
    () => (
      <>
        {Object.keys(college_map).map((college_key, index) => {
          const departments = deptList.filter(
            (dept) => dept.college_id === college_key
          );
          if (departments.length === 0) {
            return null;
          }
          return (
            <ModalDeptSection
              key={college_key}
              college_key={college_key}
              departments={departments}
              selectedDept={selectedDept}
              setSelectedDept={setSelectedDept}
              activeDept={activeDept}
              setActiveDept={setActiveDept}
              flexProps={{
                mt: index === 0 ? 0 : 6,
              }}
              ref={modalBodyRef}
              collegeRefs={collegeRefs}
            />
          );
        })}
      </>
    ),
    [selectedDept, activeDept, collegeRefs]
  );

  return (
    <>
      <Flex
        borderRadius={"24px"}
        height="36px"
        px="16px"
        py="6px"
        border="0.5px solid #4B4B4B"
        alignItems={"center"}
        color="#4b4b4b"
        cursor={"pointer"}
        transition={"all 0.2s ease-in-out"}
        _hover={{
          bg: "#4b4b4b20",
        }}
        onClick={() => {
          onOpenModal();
          reportEvent("filter_department", "click", "open_modal");
        }}
        bg={isActive ? "#cccccc" : "white"}
      >
        {title}
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onCancelEditing();
        }}
        size={useBreakpointValue({ base: "full", md: "xl" }) ?? "xl"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: "100vw", md: "90vw", lg: "50vw" }}>
          <ModalHeader
            borderBottom={"0.5px solid #6F6F6F"}
            boxSizing="border-box"
            sx={{
              fontSize: "17px",
              lineHeight: "22px",
              color: "#2d2d2d",
              fontWeight: 400,
            }}
          >
            {`已選擇 ${selectedDept.length} 個系所`}
            <Flex
              flexDirection="row"
              justifyContent="start"
              alignItems="center"
              mt="2"
              display={{ base: "block", md: "none" }}
            >
              <IsSeleciveRadioGroup
                isSelective={isSelective}
                setIsSelective={setIsSelective}
                my={2}
              />
              <Button
                size="sm"
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  onSaveEditing();
                  reportEvent("filter_department", "click", "save_changes");
                }}
              >
                套用
              </Button>
              <Button
                size="sm"
                variant="ghost"
                isDisabled={selectedDept.length === 0 && isSelective === null}
                onClick={() => {
                  onResetEditing();
                  reportEvent("filter_department", "click", "reset_changes");
                }}
              >
                重設
              </Button>
            </Flex>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody py="0" px={0} overflow="hidden">
            <Flex h="68vh" ref={modalBodyRef}>
              <Box overflowY="scroll" h="100%" w="25%" bg="#f2f2f2">
                {Object.keys(college_map).map((college_key, index) => {
                  const deptName = college_map[college_key].name;
                  const isActive = activeDept === college_key;
                  return (
                    <Flex
                      key={college_key}
                      py={3}
                      px={8}
                      alignItems="start"
                      sx={{
                        fontSize: isActive ? "17px" : "15px",
                        lineHeight: isActive ? "22px" : "23px",
                        color: isActive ? "#2d2d2d" : "#4b4b4b",
                        fontWeight: isActive ? 600 : 400,
                      }}
                      cursor="pointer"
                      onClick={() => {
                        scrollToCollege(college_key);
                      }}
                    >
                      <Box mr={1}>{college_key}</Box>
                      <Box>{deptName}</Box>
                    </Flex>
                  );
                })}
              </Box>
              <Box overflowY="scroll" w="75%" h="100%">
                {deptList.filter((dept) => selectedDept.includes(dept.id))
                  .length > 0 ? (
                  <Box mb={6}>
                    <Flex
                      p="2"
                      h="40px"
                      flexDirection="column"
                      justifyContent="center"
                      position="sticky"
                      top="0"
                      zIndex="50"
                      bg={"white"}
                    >
                      <Heading fontSize="2xl" color={"heading.light"}>
                        {`已選開課系所`}
                      </Heading>
                    </Flex>
                    <Divider pt={2} />
                    {deptList
                      .filter((dept) => selectedDept.includes(dept.id))
                      .map((dept, index) => (
                        <FilterElement
                          key={`${dept.id}-${index}-modalHeader`}
                          id={dept.id}
                          name={dept.name_full}
                          selected={true}
                          onClick={() => {
                            setSelectedDept(
                              selectedDept.filter((code) => code !== dept.id)
                            );
                            reportEvent("filter_department", "click", dept.id);
                          }}
                        />
                      ))}
                  </Box>
                ) : null}
                {modalBody}
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter
            display={{ base: "none", md: "flex" }}
            borderTop={"0.5px solid #6F6F6F"}
            boxSizing="border-box"
          >
            <Flex justifyContent={"space-between"} w="100%">
              <IsSeleciveRadioGroup
                isSelective={isSelective}
                setIsSelective={setIsSelective}
              />
              <Flex>
                <Button
                  variant={"unstyled"}
                  sx={{
                    color: "#4b4b4b",
                    fontSize: "13px",
                    lineHeight: "18px",
                    fontWeight: 600,
                  }}
                  mx={6}
                  isDisabled={selectedDept.length === 0 && isSelective === null}
                  onClick={() => {
                    onResetEditing();
                    reportEvent("filter_department", "click", "reset_changes");
                  }}
                >
                  重設
                </Button>
                <Button
                  ml="2"
                  w="58px"
                  h="34px"
                  sx={{
                    borderRadius: "50px",
                    fontSize: "13px",
                    lineHeight: "18px",
                    fontWeight: 600,
                    bg: "#4b4b4b",
                    _hover: {
                      bg: "#4b4b4b",
                      opacity: 0.8,
                    },
                    _active: {
                      bg: "#4b4b4b",
                      opacity: 0.7,
                    },
                  }}
                  onClick={() => {
                    onSaveEditing();
                    reportEvent("filter_department", "click", "save_changes");
                  }}
                >
                  套用
                </Button>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeptFilterModal;
