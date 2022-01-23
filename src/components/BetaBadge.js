import { Text } from "@chakra-ui/react"
function BetaBadge({ content }) {
  return(
    <Text as="sup" style={{fontStyle: "italic"}} color="gray.500" fontWeight="500" mx="1">{content? content:"beta"}</Text>
  );
}

export default BetaBadge;