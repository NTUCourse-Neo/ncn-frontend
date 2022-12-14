import Router from "next/router";
import { useEffect, useState } from "react";

// inspired by https://stackoverflow.com/a/69855350
const useWarnIfUnsavedChanges = (unsavedChanges: boolean) => {
  const [url, setUrl] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [proceedWithoutSaving, setProceedWithoutSaving] = useState(false);

  const closeWarning = () => setShowWarning(false);

  // intercept route change when there are unsaved changes
  // then store the "url" the user is trying to go to
  useEffect(() => {
    if (unsavedChanges) {
      const routeChangeStart = (url: string) => {
        if (!proceedWithoutSaving) {
          setUrl(url);
          setShowWarning(true);
          Router.events.emit("routeChangeError");
          throw "Abort route change. Please ignore this error.";
        }
      };

      Router.events.on("routeChangeStart", routeChangeStart);

      return () => {
        Router.events.off("routeChangeStart", routeChangeStart);
      };
    }
  }, [unsavedChanges, proceedWithoutSaving]);

  // if user toggle "proceed without saving" to true
  // then redirect to the "url" the user is trying to go to
  useEffect(() => {
    if (proceedWithoutSaving && url) {
      Router.router?.push(url);
    }
  }, [proceedWithoutSaving, url]);

  return {
    showWarning,
    closeWarning,
    setProceedWithoutSaving,
  };
};

export default useWarnIfUnsavedChanges;
