import { Text } from "@chakra-ui/react";
function BetaBadge({
  content,
  size,
}: {
  readonly content: string;
  readonly size?: "sm" | "md" | "lg";
}) {
  return (
    <Text
      as="sup"
      fontSize={size ? size : "sm"}
      style={{ fontStyle: "italic" }}
      color="gray.500"
      fontWeight="500"
      mx="1"
    >
      {content ? content : "beta"}
    </Text>
  );
}

export default BetaBadge;
