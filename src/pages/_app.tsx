import { ChakraProvider, Box } from "@chakra-ui/react";
import { CourseSearchingProvider } from "components/Providers/CourseSearchingProvider";
import HeaderBar from "components/HeaderBar";
import DeadlineCountdown from "components/DeadlineCountdown";
import { UserProvider as Auth0UserProvider } from "@auth0/nextjs-auth0";
import theme from "styles/theme";
import "styles/nprogress.css";
import "components/Filters/components/TableDragSelect.css";
import { useRouter } from "next/router";
import nProgress from "nprogress";
import { useEffect } from "react";
import GoogleAnalytics from "components/GoogleAnalytics";
import type { AppProps } from "next/app";
import CourseTableFloatingButton from "@/components/CourseTableFloatingButton";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeStart", nProgress.start);
    router.events.on("routeChangeComplete", nProgress.done);
    return () => {
      router.events.off("routeChangeStart", nProgress.start);
      router.events.off("routeChangeComplete", nProgress.done);
    };
  }, [router.events]);

  return (
    <>
      {process.env.NEXT_PUBLIC_ENV === "prod" && <GoogleAnalytics />}
      <Auth0UserProvider>
        <ChakraProvider theme={theme}>
          <CourseSearchingProvider>
            <Box w="100vw" h={{ base: "100%", lg: "" }}>
              <DeadlineCountdown />
              <HeaderBar />
              <CourseTableFloatingButton />
              <Component {...pageProps} />
            </Box>
          </CourseSearchingProvider>
        </ChakraProvider>
      </Auth0UserProvider>
    </>
  );
}

export default MyApp;
