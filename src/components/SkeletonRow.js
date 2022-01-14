import React from 'react';
import {Flex, useToast, Text, VisuallyHidden} from '@chakra-ui/react';
import {HashLoader} from 'react-spinners';
import { FaSadTear } from 'react-icons/fa';

function SkeletonRow(props) {
    const toast = useToast();
    const visible_logic = () =>{
        if (props.loading){
            return (
                <Flex p="4">
                    <HashLoader size="60px" color="teal"/>
                </Flex>
            )
        }
        else if (props.error){
            // console.log(props.error);
            return (
                <>
                    <Text color="gray.300" pt="10"> <FaSadTear size={32}/> </Text>
                    <VisuallyHidden>
                        {toast({
                            title: '錯誤',
                            description: '😢 哭阿，發生錯誤了，請稍後再試一次。',
                            status: 'error',
                            duration: 5000,
                            isClosable: true
                        })}
                    </VisuallyHidden>
                </>
            )
        }
        else {
            return (<></>)
        }
    };

    return (
        visible_logic()
    );
}
export default SkeletonRow;