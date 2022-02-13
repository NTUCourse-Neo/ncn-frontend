import { 
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    VStack,
    HStack,
    Tooltip,
    Spacer,
    Icon,
    Badge,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    ButtonGroup,
    Textarea,
    useMediaQuery
} from '@chakra-ui/react'
import { FaThumbsUp, FaThumbsDown, FaInfoCircle, FaTrashAlt } from 'react-icons/fa';

// prop.post
// {
//   _id: post._id,
//   course_id: post.course_id,
//   type: post.type,
//   content: post.content,
//   is_owner: post.user_id === user_id,
//   user_type: post.user_type,
//   create_ts: post.create_ts,
//   upvotes: post.upvotes.length,
//   downvotes: post.downvotes.length,
//   self_vote_status: get_self_vote_status(post, user_id) 
// }

function SignUpCard({post, is_owner}) {
    const [isMobile] = useMediaQuery('(max-width: 1000px)')

    const renderReportPopover = () => {
        return(
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button disabled={is_owner} colorScheme="red" variant="ghost" size="sm">檢舉</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <Flex p="4" flexDirection="column" alignItems="start">
                <Text fontSize="md" fontWeight="800" color="gray.700" textAlign="center">檢舉資訊不實</Text>
                <Textarea my="2" size="md" placeholder='輸入檢舉內容...' />
                <ButtonGroup w="100%" size="sm" d='flex' justifyContent='end'>
                  <Button variant='outline'>
                    取消
                  </Button>
                  <Button colorScheme='red'>
                    檢舉
                  </Button>
                </ButtonGroup>
              </Flex>
            </PopoverContent>
          </Popover>
        );
    };

    return (
        <Flex key={post._id} w="100%" h="75%" py="8" px="8" justifyContent="space-around" alignItems="start" flexDirection={isMobile? "column":"row"} bg="gray.200" borderRadius="lg" boxShadow="lg">
          <Flex h="100%" w={isMobile? "100%":"24"} flexWrap="wrap" alignItems="start">
            <Stat minW="16">
              <StatLabel>加簽人數</StatLabel>
              <StatNumber>{post.content.amount}</StatNumber>
            </Stat>
            <Stat minW="16">
              <StatLabel>加簽方式</StatLabel>
              <Text mt="1" fontSize="lg" fontWeight="600">{post.content.rule}</Text>
            </Stat>
            <Stat minW="16">
              <StatLabel>加簽日期</StatLabel>
              <Text mt="1" fontSize="lg" fontWeight="600">{post.content.when}</Text>
            </Stat>
          </Flex>
          <VStack mt={isMobile? "4":""} w={isMobile? "100%":"70%"} h="100%">
            <VStack w="100%" h="100%" justify="start" align="start">
              <HStack w="100%">
                <Text fontSize="sm" fontWeight="600" color="gray.800">回報資訊</Text>
                {/* <Tooltip label="此資訊基於社群回報與機器學習擷取資訊，僅顯示評分最高之回報內容。此資訊可能有缺漏或不完全正確，亦不代表本站立場，請確實做好查證工作。" placement="top" hasArrow>
                  <p>
                    <Icon as={FaInfoCircle} boxSize="3" color="gray.500" />
                  </p>
                </Tooltip> */}
                <Spacer />
                <Text fontSize="xs" fontWeight="600" color="gray.500">提供者</Text>
                <Badge colorScheme="blue">{is_owner?"我":post.user_type}</Badge>
                {is_owner?<Button size="sm" h='100%' variant={'ghost'} colorScheme="gray" fontSize={'sm'} color="red.600">刪除</Button>:<></>}
              </HStack>
              <Flex maxH={isMobile? "":""} overflow="auto" flexGrow={1}>
                <Text fontSize="md" fontWeight="600" color="gray.600" overflow="auto">{post.content.comment}</Text>
              </Flex>
            </VStack>
            <HStack w="100%" justify="end">
              <Button colorScheme="teal" variant="ghost" size="xs" leftIcon={<FaThumbsUp />}>{post.upvotes}</Button>
              <Button colorScheme="orange" variant="ghost" size="xs" leftIcon={<FaThumbsDown />}>{post.downvotes}</Button>
              {renderReportPopover()}
            </HStack>
          </VStack>
        </Flex>
    )
}

export default SignUpCard;