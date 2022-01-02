import { React, useState, useEffect } from 'react';
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
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import dotenv from 'dotenv-defaults';
import UserInfoContainer from './containers/UserInfoContainer';
dotenv.config();

function App(props) {

  const content = (route)=>{
    switch(route){
      case "home":
        return <HomeViewContainer />
      case "course":
        return <CourseResultViewContainer />
      case "user/info":
        return <UserInfoContainer />
      default:
        return <HomeViewContainer />
    }
  }

  return (
    <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
    >
      <ChakraProvider theme={theme}>
        <HeaderBar useColorModeValue={useColorModeValue}/>
        {content(props.route)}
        <Footer />
      </ChakraProvider>
    </Auth0Provider>
  );
}

export default App;
