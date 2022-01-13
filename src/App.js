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
import InfoPageContainer from './containers/InfoPageContainer';
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import dotenv from 'dotenv-defaults';
import UserInfoContainer from './containers/UserInfoContainer';
import ErrorContainer from './containers/ErrorContainer';
import UserMyPage from './containers/userMyPage';
import { useParams } from 'react-router-dom';
dotenv.config();

function App(props) {
  let { code } = useParams();

  const content = (route)=>{
    switch(route){
      case "home":
        return <HomeViewContainer />
      case "course":
        return <CourseResultViewContainer />
      case "user/info":
        return <UserInfoContainer />
      case "error":
        return <ErrorContainer code={code}/>
      case "about":
        return <InfoPageContainer />
      case "user/my":
        return <UserMyPage />
      default:
        return <HomeViewContainer />
    }
  }

  return (
    <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    audience={process.env.REACT_APP_SELF_API_AUDIENCE}
    redirectUri={window.location.origin}
    useRefreshTokens={true}
    cacheLocation={"localstorage"}
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
