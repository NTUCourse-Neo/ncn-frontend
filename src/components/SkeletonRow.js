import React from 'react';
import {Skeleton} from '@chakra-ui/react';

function SkeletonRow(props) {

    const visible_logic = () =>{
        if (props.loading){
            return (<Skeleton w='60%' speed='0.1' startColor='gray.100' endColor='teal.300' height='30px' >
                <div>won't be visible</div>
            </Skeleton>)
        }
        else if (props.error){
            // what to render if network error when fetching
            return (<></>)
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