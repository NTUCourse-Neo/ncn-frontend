import {
  Flex,
  Stack,
  Checkbox,
  Text,
  Divider,
  Box,
  Badge,
  FlexProps,
  HStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import TimeFilterModal from "@/components/FilterModals/TimeFilterModal";
import DeptFilterModal from "@/components/FilterModals/DeptFilterModal";
import { FaChevronDown } from "react-icons/fa";
import { mapStateToIntervals } from "utils/timeTableConverter";
import { useCourseSearchingContext } from "@/components/Providers/CourseSearchingProvider";
import {
  EnrollMethod,
  grades,
  Grade,
  otherLimits,
  OtherLimit,
} from "types/search";
import {
  isEnrollMethodFilterActive,
  isTargetGradeFilterActive,
} from "utils/searchFilter";
import _ from "lodash";
import Dropdown from "@/components/Dropdown";

function getNextCheckListState<T>(array: T[], member: T): T[] {
  const idx = array.indexOf(member);
  if (idx === -1) {
    return [...array, member];
  } else {
    return array.filter((item) => item !== member);
  }
}

function FilterButton(props: FlexProps) {
  return (
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
      {...props}
    />
  );
}

function FilterDropdown(props: {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly onClick: () => void;
  readonly onSave: () => void;
  readonly onClear: () => void;
  readonly isEmpty?: boolean;
  readonly isActive?: boolean;
}) {
  const {
    title,
    children,
    onClick,
    onSave,
    onClear,
    isEmpty = false,
    isActive = false,
  } = props;
  return (
    <Dropdown
      renderDropdownButton={(isOpen) => (
        <FilterButton
          onClick={onClick}
          bg={isActive || isOpen ? "#cccccc" : "white"}
        >
          <HStack>
            <Text>{title}</Text>
            <Icon
              as={FaChevronDown}
              transform={isOpen ? "rotate(180deg)" : ""}
              transition="all ease-in-out 0.4s"
            />
          </HStack>
        </FilterButton>
      )}
      renderDropdownFooter={(setIsOpen) => (
        <Flex flexDirection={"column"} gap={3} px={6} pb={6}>
          <Divider />
          <Flex justifyContent={"end"} alignItems={"center"}>
            <Button
              variant={"unstyled"}
              sx={{
                color: "#4b4b4b",
                fontSize: "13px",
                lineHeight: "18px",
                fontWeight: 600,
              }}
              onClick={onClear}
              isDisabled={isEmpty}
              ml={6}
            >
              清除
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
                onSave();
                setIsOpen(false);
              }}
            >
              套用
            </Button>
          </Flex>
        </Flex>
      )}
    >
      <Flex flexDirection={"column"} p={6}>
        {children}
      </Flex>
    </Dropdown>
  );
}

function SearchFilters(props: FlexProps) {
  const {
    searchFilters,
    setSearchFilters,
    resetFilters,
    isFiltersEdited,
    setPageIndex,
  } = useCourseSearchingContext();

  const [selectedEnrollMethod, setSelectedEnrollMethod] = useState<
    EnrollMethod[]
  >(searchFilters.enroll_method);
  const [selectedTargetGrade, setSelectedTargetGrade] = useState<Grade[]>(
    searchFilters.target_grade
  );
  const [selectedOtherLimit, setSelectedOtherLimit] = useState<OtherLimit[]>(
    searchFilters.other_limit
  );
  const otherLimitsGroupByType = _.groupBy(
    otherLimits,
    (limit) => limit.type_label
  );
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <Flex alignItems={"center"} flexWrap="wrap" gap="3" {...props}>
      <TimeFilterModal
        title={`上課時間${
          mapStateToIntervals(searchFilters.time) === 0
            ? ""
            : ` (${mapStateToIntervals(searchFilters.time)})`
        }`}
        isActive={
          mapStateToIntervals(searchFilters.time) > 0 ||
          searchFilters.is_full_year !== null
        }
      />
      <DeptFilterModal
        title={`開課系所${
          searchFilters.department.length > 0
            ? ` (${searchFilters.department.length})`
            : ""
        }`}
        isActive={
          searchFilters.department.length > 0 ||
          searchFilters.is_selective !== null
        }
      />
      <FilterDropdown
        title={`加選方式${
          isEnrollMethodFilterActive(searchFilters.enroll_method)
            ? ` (${[...searchFilters.enroll_method].sort().join(", ")})`
            : ""
        }`}
        onClick={() => {
          setSelectedEnrollMethod(searchFilters.enroll_method);
        }}
        onSave={() => {
          setSearchFilters({
            ...searchFilters,
            enroll_method: selectedEnrollMethod,
          });
          backToFirstPage();
        }}
        onClear={() => {
          setSelectedEnrollMethod([]);
        }}
        isEmpty={selectedEnrollMethod.length === 0}
        isActive={isEnrollMethodFilterActive(searchFilters.enroll_method)}
      >
        <Stack
          w="280px"
          spacing={3}
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#666666",
            letterSpacing: "0.05em",
          }}
        >
          <Checkbox
            isChecked={selectedEnrollMethod.includes("1")}
            onChange={() => {
              setSelectedEnrollMethod(
                getNextCheckListState(selectedEnrollMethod, "1")
              );
            }}
          >
            1 - 不限人數，直接上網加選
          </Checkbox>
          <Checkbox
            isChecked={selectedEnrollMethod.includes("2")}
            onChange={() => {
              setSelectedEnrollMethod(
                getNextCheckListState(selectedEnrollMethod, "2")
              );
            }}
          >
            2 - 向教師取得授權碼後加選
          </Checkbox>
          <Checkbox
            isChecked={selectedEnrollMethod.includes("3")}
            onChange={() => {
              setSelectedEnrollMethod(
                getNextCheckListState(selectedEnrollMethod, "3")
              );
            }}
          >
            3 - 有人數限制，上網登記後分發
          </Checkbox>
        </Stack>
      </FilterDropdown>
      <FilterDropdown
        title={`限修年級${
          isTargetGradeFilterActive(searchFilters.target_grade)
            ? ` (${searchFilters.target_grade.length})`
            : ""
        }`}
        onClick={() => {
          setSelectedTargetGrade(searchFilters.target_grade);
        }}
        onSave={() => {
          setSearchFilters({
            ...searchFilters,
            target_grade: selectedTargetGrade,
          });
          backToFirstPage();
        }}
        onClear={() => {
          setSelectedTargetGrade([]);
        }}
        isEmpty={selectedTargetGrade.length === 0}
        isActive={isTargetGradeFilterActive(searchFilters.target_grade)}
      >
        <Stack
          spacing={3}
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#666666",
            letterSpacing: "0.05em",
          }}
          w="fit-content"
        >
          {grades.map((grade) => {
            return (
              <Checkbox
                key={grade.value}
                isChecked={selectedTargetGrade.includes(grade.value)}
                onChange={() => {
                  setSelectedTargetGrade(
                    getNextCheckListState(selectedTargetGrade, grade.value)
                  );
                }}
              >
                {grade.label}
              </Checkbox>
            );
          })}
        </Stack>
      </FilterDropdown>
      <FilterDropdown
        title={`其他限制${
          searchFilters.other_limit.length > 0
            ? ` (${searchFilters.other_limit.length})`
            : ``
        }`}
        onClick={() => {
          setSelectedOtherLimit(searchFilters.other_limit);
        }}
        onSave={() => {
          setSearchFilters({
            ...searchFilters,
            other_limit: selectedOtherLimit,
          });
          backToFirstPage();
        }}
        onClear={() => {
          setSelectedOtherLimit([]);
        }}
        isEmpty={selectedOtherLimit.length === 0}
        isActive={searchFilters.other_limit.length > 0}
      >
        <Stack
          spacing={3}
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#666666",
            letterSpacing: "0.05em",
          }}
          w="300px"
        >
          {Object.entries(otherLimitsGroupByType).map(
            ([type, limits], index) => {
              return (
                <React.Fragment key={type}>
                  {index !== 0 ? <Divider /> : null}
                  <Stack spacing={3} w="fit-content">
                    <Text
                      sx={{
                        fontSize: "16px",
                        lineHeight: "21px",
                        fontWeight: 600,
                      }}
                    >
                      {type}
                    </Text>
                    {limits.map((limit) => (
                      <Checkbox
                        key={limit.label}
                        isDisabled={!limit.avaliable}
                        isChecked={selectedOtherLimit.includes(limit.value)}
                        onChange={() => {
                          setSelectedOtherLimit(
                            getNextCheckListState(
                              selectedOtherLimit,
                              limit.value
                            )
                          );
                        }}
                      >
                        {limit.label}{" "}
                        {!limit.avaliable ? <Badge>即將推出</Badge> : null}
                      </Checkbox>
                    ))}
                  </Stack>
                </React.Fragment>
              );
            }
          )}
        </Stack>
      </FilterDropdown>
      {isFiltersEdited ? (
        <Box
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#484848",
          }}
          cursor="pointer"
          onClick={() => {
            resetFilters();
          }}
        >
          清除全部
        </Box>
      ) : null}
    </Flex>
  );
}

export default SearchFilters;
