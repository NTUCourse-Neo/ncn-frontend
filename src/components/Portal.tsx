import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({
  children,
  containerId,
}: {
  readonly children: React.ReactNode;
  readonly containerId?: string;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(
        children,
        document.querySelector(containerId || `#destination`) as Element
      )
    : null;
};

export default Portal;
