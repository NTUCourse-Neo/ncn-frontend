export const reportEvent = (
  event_category: string,
  eventAction: string,
  event_label: string
) => {
  if (process.env.NEXT_PUBLIC_ENV === "prod") {
    window.gtag("event", eventAction, { event_category, event_label });
  }
};
