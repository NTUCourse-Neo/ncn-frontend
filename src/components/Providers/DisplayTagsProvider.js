import React, { createContext, useContext, useState } from "react";

const DisplayTagsContext = createContext({
  displayTags: [],
  setDisplayTags: () => {},
});

function DisplayTagsProvider(props) {
  const [displayTags, setDisplayTags] = useState([]);
  return (
    <DisplayTagsContext.Provider value={{ displayTags, setDisplayTags }}>
      {props.children}
    </DisplayTagsContext.Provider>
  );
}

function useDisplayTags() {
  return useContext(DisplayTagsContext);
}

export { DisplayTagsProvider, useDisplayTags };
