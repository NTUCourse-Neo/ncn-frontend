function openPage(url: string, closeAfterOneSecond = false) {
  if (window) {
    const wnd = window.open(url, "_blank");
    if (closeAfterOneSecond) {
      setTimeout(() => {
        wnd?.close();
      }, 1000);
    }
  }
}

export default openPage;
