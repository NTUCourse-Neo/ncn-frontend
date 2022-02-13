function setPageMeta({title, desc}){
  title = title || "NTUCourse Neo";
  desc = desc || "全新設計的台大選課網站。";
  document.title = title;
  document.querySelector("meta[name='description']").setAttribute("content", desc);
}

export default setPageMeta;