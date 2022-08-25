import React, { createContext, useContext, useState } from "react";

export type DisplayTagName = "requirement" | "slot" | "enroll_method" | "areas";
export const availableTags: DisplayTagName[] = [
  "requirement",
  "slot",
  "enroll_method",
  "areas",
];

interface DisplayTagsContextType {
  displayTags: DisplayTagName[];
  setDisplayTags: (displayTags: DisplayTagName[]) => void;
}

const DisplayTagsContext = createContext<DisplayTagsContextType>({
  displayTags: [],
  setDisplayTags: (displayTags: DisplayTagName[]) => {},
});

const DisplayTagsProvider: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const [displayTags, setDisplayTags] = useState<DisplayTagName[]>([]);
  return (
    <DisplayTagsContext.Provider value={{ displayTags, setDisplayTags }}>
      {children}
    </DisplayTagsContext.Provider>
  );
};

function useDisplayTags() {
  return useContext(DisplayTagsContext);
}

export { DisplayTagsProvider, useDisplayTags };
