import { React, useState } from 'react';
import {
  ChakraProvider,
  useColorModeValue,
  Box
} from '@chakra-ui/react';
import theme from './theme';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import HomeViewContainer from './containers/HomeViewContainer';
import CourseResultViewContainer from './containers/CourseResultViewContainer';
import SideCourseTableContainer from './containers/SideCourseTableContainer';


function App(props) {
  const content = (route)=>{
    switch(route){
      case "home":
        return <HomeViewContainer />
      case "course":
        return <CourseResultViewContainer />
      default:
        return <HomeViewContainer />
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <HeaderBar useColorModeValue={useColorModeValue}/>
      {content(props.route)}             
      <Footer />
    </ChakraProvider>
  );
}

export default App;
