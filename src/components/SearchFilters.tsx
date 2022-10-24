import { Flex, Box, FlexProps } from "@chakra-ui/react";
import React from "react";
import { useCourseSearchingContext } from "@/components/Providers/CourseSearchingProvider";
import {
  TimeFilter,
  DeptFilter,
  EnrollMethodFilter,
  OtherLimitFilter,
  TargetGradeFilter,
  GeneralCourseTypeFilter,
} from "@/components/Filters/index";

function SearchFilters(props: FlexProps) {
  const { resetFilters, isFiltersEdited } = useCourseSearchingContext();

  return (
    <Flex alignItems={"center"} flexWrap="wrap" gap="3" {...props}>
      <TimeFilter />
      <DeptFilter />
      <EnrollMethodFilter />
      <TargetGradeFilter />
      <OtherLimitFilter />
      <GeneralCourseTypeFilter />
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
