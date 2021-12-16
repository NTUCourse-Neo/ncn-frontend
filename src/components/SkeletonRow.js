import React from 'react';
import {Flex, Spinner, useToast} from '@chakra-ui/react';

function SkeletonRow(props) {
    const toast = useToast();
    const visible_logic = () =>{
        if (props.loading){
            return (
                <Flex p="4">
                    <Spinner size="lg" color="teal.600"/>
                </Flex>
            )
        }
        else if (props.error){
            console.log(props.error);
            return (
                toast({
                    title: '錯誤',
                    description: '😢 哭阿，發生錯誤了，請稍後再試一次。',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                })
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