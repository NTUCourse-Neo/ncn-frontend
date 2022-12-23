import { Flex, Box, FlexProps } from "@chakra-ui/react";
import React from "react";
import { useCourseSearchingContext } from "@/components/Providers/CourseSearchingProvider";
import { filterComponentMap } from "@/types/filter";

function SearchFilters(props: FlexProps) {
  const { resetFilters, isFiltersEdited, searchMode } =
    useCourseSearchingContext();

  return (
    <Flex alignItems={"center"} flexWrap="wrap" gap="3" {...props}>
      {searchMode.filters.map((filterId) => {
        return (
          <React.Fragment key={`${filterId}`}>
            {filterComponentMap?.[filterId]?.["component"] ?? null}
          </React.Fragment>
        );
      })}
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
