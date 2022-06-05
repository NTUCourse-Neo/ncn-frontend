import { React } from "react";
import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
function HomeCard({ bg, desc, img, title, children }) {
  return (
    <Box className="initialBox" w="80vw" bg={bg} borderRadius="3xl" p={4} boxShadow="xl">
      <Flex justifyContent="start" alignItems="start" flexDirection="column" m="8">
        <Heading as="h1" fontSize={["xl", "2xl", "3xl", "5xl"]} fontWeight="800" color="gray.700" mb="8">
          {title}
        </Heading>
        <Flex w="100%" justifyContent="start" alignItems="center" flexDirection="row" flexWrap="wrap-reverse" css={{ gap: "2em" }}>
          <Flex w={["100%", "100%", "100%", "60%"]} justifyContent="start" alignItems="start" flexDirection="column" mr="4">
            {desc.map((item, index) => {
              return (
                <Text key={index} fontSize={["md", "lg", "lg", "3xl"]} fontWeight="400" color="gray.600" mb={4}>
                  {item}
                </Text>
              );
            })}
          </Flex>
          <Image
            src={img}
            alt={title}
            w={["100%", "100%", "100%", "30%"]}
            borderRadius="xl"
            boxShadow="xl"
            _hover={{ transform: "Scale(1.2)", boxShadow: "2xl" }}
            transition="all ease-out 0.2s"
          />
        </Flex>
      </Flex>
      {children}
    </Box>
  );
}
export default HomeCard;
