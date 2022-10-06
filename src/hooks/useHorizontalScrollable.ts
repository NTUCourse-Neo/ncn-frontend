import { useEffect, useState } from "react";

export default function useHorizontalScrollable(
  ref: React.RefObject<HTMLDivElement>,
  scrollUnit = 100
) {
  const [isScrollable, setIsScrollable] = useState(false);
  const [reachLeft, setReachLeft] = useState(false);
  const [reachRight, setReachRight] = useState(false);

  // console.log({
  //   scrollLeft: ref.current?.scrollLeft,
  //   scrollWidth: ref.current?.scrollWidth,
  //   clientWidth: ref.current?.clientWidth,
  // });

  const updateReachStates = () => {
    if (ref.current) {
      if (ref.current?.scrollLeft === 0) {
        setReachLeft(true);
      } else {
        setReachLeft(false);
      }
      if (
        ref.current?.scrollLeft ===
        ref.current?.scrollWidth - ref.current?.clientWidth
      ) {
        setReachRight(true);
      } else {
        setReachRight(false);
      }
    }
  };

  const scrollLeft = () => {
    ref.current?.scrollTo({
      left: Math.max(ref?.current?.scrollLeft - scrollUnit, 0),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    ref.current?.scrollTo({
      left: Math.min(
        ref?.current?.scrollLeft + scrollUnit,
        ref?.current?.scrollWidth - ref?.current?.clientWidth
      ),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (ref.current) {
      if (ref.current?.scrollLeft === 0) {
        setReachLeft(true);
      } else {
        setReachLeft(false);
      }
      if (
        ref.current?.scrollLeft ===
        ref.current?.scrollWidth - ref.current?.clientWidth
      ) {
        setReachRight(true);
      } else {
        setReachRight(false);
      }
    }
  }, [ref]);

  useEffect(() => {
    const resizeHandler = () => {
      setIsScrollable(
        ref.current?.clientWidth !== undefined &&
          ref.current?.scrollWidth > ref.current?.clientWidth
      );
    };
    const observer = new ResizeObserver(resizeHandler);
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return {
    isScrollable,
    reachLeft,
    reachRight,
    updateReachStates,
    scrollLeft,
    scrollRight,
  };
}
