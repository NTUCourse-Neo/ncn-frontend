function setPageMeta({ title, desc }) {
  document.title = title || "NTUCourse Neo";
  document.querySelector("meta[name='description']").setAttribute("content", desc || "全新設計的台大選課網站。");
}

export default setPageMeta;
