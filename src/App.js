import { React, useState } from 'react';
import {
  ChakraProvider,
  useColorModeValue,
} from '@chakra-ui/react';
import theme from './theme';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import HomeViewContainer from './containers/HomeViewContainer';
import CourseResultViewContainer from './containers/CourseResultViewContainer';
import { Auth0Provider } from "@auth0/auth0-react";
import dotenv from 'dotenv-defaults';
dotenv.config();

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
