import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  useColorModeValue,
  BoxProps,
} from "@chakra-ui/react";

export interface HomeCardProps extends BoxProps {
  readonly desc: string[];
  readonly title: string;
  readonly img: string;
  readonly imgAtLeft?: boolean;
}

function HomeCard(props: HomeCardProps) {
  const { bg, desc, img, title, children, imgAtLeft = false } = props;
  const textColor = useColorModeValue("gray.500", "gray.400");
  return (
    <Box
      className="initialBox"
      w="100%"
      bg={bg}
      py={8}
      px={{ base: "10vw", sm: "5vw", xl: "10vw" }}
    >
      <Flex
        justifyContent={{ base: "center", lg: "space-between" }}
        alignItems="center"
        flexDirection="row"
        flexWrap={imgAtLeft ? "wrap" : "wrap-reverse"}
        my="8"
      >
        {!imgAtLeft ? (
          <></>
        ) : (
          <Image
            src={img}
            alt={title}
            maxW={["300px", "300px", "300px", "30%"]}
            maxH="400px"
            mb={{ base: "16", lg: "0" }}
            pointerEvents="none"
          />
        )}
        <Flex
          w={["100%", "100%", "100%", "60%"]}
          justifyContent="start"
          alignItems="start"
          flexDirection="column"
          mr="4"
        >
          <Heading
            as="h1"
            fontSize={["3xl", "3xl", "3xl", "5xl"]}
            fontWeight="800"
            color={useColorModeValue("gray.700", "gray.300")}
            mb="8"
          >
            {title}
          </Heading>
          {desc.map((item, index) => {
            return (
              <Text
                key={index}
                fontSize={["lg", "lg", "lg", "3xl"]}
                fontWeight="400"
                color={textColor}
                mb={4}
              >
                {item}
              </Text>
            );
          })}
        </Flex>
        {imgAtLeft ? (
          <></>
        ) : (
          <Image
            src={img}
            alt={title}
            maxW={["300px", "300px", "300px", "30%"]}
            maxH="400px"
            mb={{ base: "16", lg: "0" }}
            pointerEvents="none"
          />
        )}
      </Flex>
      {children}
    </Box>
  );
}
export default HomeCard;
