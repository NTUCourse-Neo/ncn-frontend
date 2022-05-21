import { React } from "react";
import { ChakraProvider, useColorModeValue, Box, useMediaQuery } from "@chakra-ui/react";
import theme from "./theme";
import HeaderBar from "./components/HeaderBar";
import Footer from "./components/Footer";
import HomeViewContainer from "./containers/HomeViewContainer";
import CourseResultViewContainer from "./containers/CourseResultViewContainer";
import InfoPageContainer from "./containers/InfoPageContainer";
import { Auth0Provider } from "@auth0/auth0-react";
import dotenv from "dotenv-defaults";
import UserInfoContainer from "./containers/UserInfoContainer";
import ErrorContainer from "./containers/ErrorContainer";
import UserMyPage from "./containers/userMyPage";
import CourseInfoContainer from "./containers/CourseInfoContainer";
import { useParams } from "react-router-dom";
import ReactGA from "react-ga";
import RecruitingPageContainer from "./containers/RecruitingPageContainer";

dotenv.config();

if (process.env.REACT_APP_ENV === "prod") {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function App(props) {
  let { code } = useParams();
  const [isMobile] = useMediaQuery("(max-width: 1000px)");
  const miniFooterPages = ["home", "course", "courseinfo", "user/my", "user/info", "recruiting"];

  const content = (route) => {
    switch (route) {
      case "home":
        return <HomeViewContainer />;
      case "course":
        return <CourseResultViewContainer />;
      case "user/info":
        return <UserInfoContainer />;
      case "error":
        return <ErrorContainer code={code} />;
      case "about":
        return <InfoPageContainer />;
      case "user/my":
        return <UserMyPage />;
      case "courseinfo":
        return <CourseInfoContainer code={code} />;
      case "recruiting":
        return <RecruitingPageContainer />;
      default:
        return <HomeViewContainer />;
    }
  };

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
        <Box w="100vw" h={isMobile && miniFooterPages.includes(props.route) ? "100%" : ""}>
          <HeaderBar useColorModeValue={useColorModeValue} />
          {content(props.route)}
          <Footer mini={miniFooterPages.includes(props.route)} />
        </Box>
      </ChakraProvider>
    </Auth0Provider>
  );
}

export default App;
