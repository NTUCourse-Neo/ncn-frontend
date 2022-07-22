import { ChakraProvider, Box } from "@chakra-ui/react";
import { CourseSearchingProvider } from "components/Providers/CourseSearchingProvider";
import { DisplayTagsProvider } from "components/Providers/DisplayTagsProvider";
import HeaderBar from "components/HeaderBar";
import Footer from "components/Footer";
import { UserProvider as Auth0UserProvider } from "@auth0/nextjs-auth0";
import theme from "styles/theme";

function MyApp({ Component, pageProps }) {
  return (
    <Auth0UserProvider>
      <ChakraProvider theme={theme}>
        <CourseSearchingProvider>
          <DisplayTagsProvider>
            <Box w="100vw" h={{ base: "100%", lg: "" }}>
              <HeaderBar />
              <Component {...pageProps} />
              <Footer />
            </Box>
          </DisplayTagsProvider>
        </CourseSearchingProvider>
      </ChakraProvider>
    </Auth0UserProvider>
  );
}

export default MyApp;
