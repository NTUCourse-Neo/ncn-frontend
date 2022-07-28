export const reportEvent = (event_category, eventAction, event_label) => {
  if (process.env.NEXT_PUBLIC_ENV === "prod") {
    window.gtag("event", eventAction, { event_category, event_label });
  }
};
