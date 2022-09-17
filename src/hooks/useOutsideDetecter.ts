import { useEffect } from "react";

interface IdNode extends Node {
  id?: string;
}

// https://stackoverflow.com/a/42234988
export default function useOutsideDetecter(
  ref: React.RefObject<HTMLDivElement>,
  id: string,
  callback: () => void
) {
  useEffect(() => {
    // Alert if clicked on outside of element
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if ((event?.target as IdNode)?.id !== id) {
          callback();
        }
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
