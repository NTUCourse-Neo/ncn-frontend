import { React } from 'react';
import {
  Avatar,
    Box,
    Divider,
    Flex,
    HStack,
    Spacer,
    Text,
    VStack,
    Image,
    Icon,
    Button
  } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { SiNotion, SiDiscord } from 'react-icons/si';

const teams = [
  {
    name: "張博皓",
    img: "https://avatars.githubusercontent.com/u/38657003?v=4",
    dept: "工科海洋系大四",
    quote: "WP 讚啦",
    github: "jc-hiroto",
    desc:""
  },
  {
    name: "許書維",
    img: "https://avatars.githubusercontent.com/u/71842426?v=4",
    dept: "電機系大四",
    quote: "WP 讚啦",
    github: "swh00tw",
    desc:""
  },
  {
    name: "謝維勝",
    img: "https://avatars.githubusercontent.com/u/87405718?v=4",
    dept: "電機系大四",
    quote: "WP 讚啦",
    github: "Wil0408",
    desc:""
  },
]

function InfoPageContainer(props){
  const handleOpenGithub = (github) => {
    window.open(`https://www.github.com/${github}`, '_blank');
  }
  const renderTeamCard = (person) => {
    return (
      <Box w="20vw" p="8" bg="white" boxShadow="xl" borderRadius="xl">
        <VStack spacing="4">
          <HStack align="center" justify="center" spacing="4">
            <Avatar src={person.img} name={person.name} size="2xl"/>
            <VStack spacing="2" alignItems="start">
              <Spacer />
              <Text fontSize="3xl" fontWeight="bold" color="gray.700">{person.name}</Text>
              <Text fontSize="md" fontWeight="500" color="gray.500">{person.dept}</Text>
              <Button size="sm" alignItems="center" justifyContent="center" spacing="2" borderRadius="md" borderWidth="2px" px="3" onClick={() => handleOpenGithub(person.github)}>
                <Icon as={FaGithub} size="2em" color="gray.500" mr="3"/>
                <Text fontSize="md" fontWeight="500" color="gray.500">{person.github}</Text>
              </Button>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    );
  };
  return(
    <>
      <Flex direction="column" alignItems="center" px="200" pt="100px">
        <Text fontSize="5xl" fontWeight="800" color="gray.700">關於</Text>
        <Divider />
        <Flex direction="column" alignItems="center" p="16">
          <Text fontSize="2xl" fontWeight="400" color="gray.500">課程網真的好難用，所以我們自己做了一個！ 🥰<br /> 希望 NTUCourse Neo 可以讓你我的選課都更加直覺，好用。</Text>
        </Flex>
        <Text fontSize="5xl" fontWeight="800" color="gray.700">團隊</Text>
        <Divider />
        <HStack spacing="8" p="16">
          {teams.map (person => renderTeamCard(person))}
        </HStack>
        <Text fontSize="5xl" fontWeight="800" color="gray.700">操作影片</Text>
        <Divider />
        <Flex direction="column" alignItems="center" p="16">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </Flex>
        <Text fontSize="5xl" fontWeight="800" color="gray.700">Powered by...</Text>
        <Divider />
        <HStack alignItems="center" p="16" spacing="8">
          <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Microsoft_Azure_Logo.svg/1200px-Microsoft_Azure_Logo.svg.png" height="50px" />
          <Image src="https://res.cloudinary.com/citiar/image/upload/v1611373461/ucamc/common/react_icon.png" height="50px" />
          <Image src="https://cg2010studio.files.wordpress.com/2016/07/nodejs.png?w=584" height="50px" />
          <Image src="https://upload.wikimedia.org/wikipedia/commons/0/00/Mongodb.png" height="50px" />
          <Image src="https://www.drupal.org/files/project-images/brand%20evolution_logo_Auth0_black.png" height="50px" />
          <Image src="https://brands.home-assistant.io/_/sendgrid/logo.png" height="50px" />
          <Image src="https://segmentfault.com/img/bVtSeK" height="50px" />
          <Image src="https://miro.medium.com/max/1200/0*4L-GqAxAp7KsObMj.png" height="50px" />
          <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/1200px-RecaptchaLogo.svg.png" height="50px" />
        </HStack>
        <HStack spacing={4}>
          <Text fontSize="2xl" fontWeight="500" color="gray.700">And with the help of...</Text>
          <Icon as={FaGithub} w="8" h="8" color="gray.700"/>
          <Icon as={SiDiscord} w="8" h="8" color="gray.700"/>
          <Icon as={SiNotion} w="8" h="8" color="gray.700"/>
        <Text fontSize="2xl" fontWeight="500" color="gray.700">and our 🔥 and 💖 !</Text>
        </HStack>
      </Flex>
    </>
  );
}

export default InfoPageContainer;