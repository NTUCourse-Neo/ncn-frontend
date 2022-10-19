import { Box, RenderProps } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

export interface ToastProps extends RenderProps {
  readonly title: string;
  readonly description: string;
  readonly icon: IconType;
  readonly color: string;
  readonly undoCallback?: () => void;
}

export function CustomToast(props: ToastProps) {
  const { id, onClose, title, description, color: themeColor } = props;
  return (
    <Box bg={themeColor} p={3}>
      {`${id} ${title} ${description}`}
    </Box>
  );
}
