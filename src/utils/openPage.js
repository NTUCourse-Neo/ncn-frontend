function openPage(url, closeAfterOneSecond = false) {
  if (window) {
    const wnd = window.open(url, "_blank");
    if (closeAfterOneSecond) {
      // console.log("closing");
      setTimeout(() => {
        wnd.close();
      }, 1000);
    }
  }
}

export default openPage;
