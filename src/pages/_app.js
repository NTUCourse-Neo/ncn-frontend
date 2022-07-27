import { ChakraProvider, Box } from "@chakra-ui/react";
import { UserDataProvider } from "components/Providers/UserProvider";
import { CourseSearchingProvider } from "components/Providers/CourseSearchingProvider";
import { DisplayTagsProvider } from "components/Providers/DisplayTagsProvider";
import { CourseTableProvider } from "components/Providers/CourseTableProvider";
import HeaderBar from "components/HeaderBar";
import Footer from "components/Footer";
import { UserProvider as Auth0UserProvider } from "@auth0/nextjs-auth0";
import theme from "styles/theme";
import GoogleAnalytics from "components/GoogleAnalytics";

function MyApp({ Component, pageProps }) {
  return (
    <Auth0UserProvider>
      <ChakraProvider theme={theme}>
        <CourseSearchingProvider>
          <CourseTableProvider>
            <UserDataProvider>
              <DisplayTagsProvider>
                <Box w="100vw" h={{ base: "100%", lg: "" }}>
                  <HeaderBar />
                  <Component {...pageProps} />
                  {process.env.NEXT_PUBLIC_ENV === "prod" && (
                    <GoogleAnalytics />
                  )}
                  <Footer />
                </Box>
              </DisplayTagsProvider>
            </UserDataProvider>
          </CourseTableProvider>
        </CourseSearchingProvider>
      </ChakraProvider>
    </Auth0UserProvider>
  );
}

export default MyApp;
