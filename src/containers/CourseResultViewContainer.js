import { React } from 'react';
import {
    Box,
    Flex,
} from '@chakra-ui/react';
import CourseInfoRowContainer from './CourseInfoRowContainer';
import DataSet from '../components/FakeDataSet';


function CourseResultViewContainer() {
    return (
        <>
            <CourseInfoRowContainer courseInfo={DataSet.courseInfo} />
        </>
    );
};

export default CourseResultViewContainer;
