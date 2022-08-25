import {
  Button,
  Badge,
  useColorModeValue,
  ButtonProps,
} from "@chakra-ui/react";

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
      colorScheme={"teal"}
      variant={!selected ? "outline" : "solid"}
      size="sm"
      minW="100px"
      m="1"
      onClick={onClick}
      _hover={!selected ? { bg: "teal.100" } : { bg: "red.700" }}
    >
      <Badge mx="2" colorScheme={useColorModeValue("teal", "black")}>
        {id}
      </Badge>
      {name}
    </Button>
  );
}
export default FilterElement;
