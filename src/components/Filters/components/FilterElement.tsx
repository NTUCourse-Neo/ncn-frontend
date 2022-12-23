import { Button, Badge, ButtonProps } from "@chakra-ui/react";

export interface FilterElementProps extends ButtonProps {
  readonly id: string;
  readonly name: string;
  readonly selected: boolean;
}

// Buttons in filter modal
function FilterElement(props: FilterElementProps) {
  const { id, name, selected, onClick } = props;
  return (
    <Button
      colorScheme={"primary"}
      variant={!selected ? "outline" : "solid"}
      size="sm"
      minW="100px"
      m="1"
      onClick={onClick}
      _hover={!selected ? { bg: "primary.200" } : { bg: "error.800" }}
    >
      <Badge mx="2" bg="#ececec" color="primary.500">
        {id}
      </Badge>
      {name}
    </Button>
  );
}
export default FilterElement;
