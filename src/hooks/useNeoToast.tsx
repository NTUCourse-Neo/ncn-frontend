import { useToast, UseToastOptions } from "@chakra-ui/react";
import { CustomToast } from "@/components/Toast";
import { MdFavorite, MdCheckCircle, MdCancel } from "react-icons/md";
import { IconType } from "react-icons/lib";

export type NeoToastType =
  | "add_course"
  | "remove_course"
  | "add_favorite"
  | "remove_favorite";
export interface NeoToast {
  type: NeoToastType;
  icon: IconType;
  color: string;
}
export const neoToasts: NeoToast[] = [
  {
    type: "add_course",
    icon: MdCheckCircle,
    color: "success.main",
  },
  {
    type: "remove_course",
    icon: MdCancel,
    color: "error.main",
  },
  {
    type: "add_favorite",
    icon: MdFavorite,
    color: "success.main",
  },
  {
    type: "remove_favorite",
    icon: MdCancel,
    color: "error.main",
  },
];

export default function useNeoToast(option?: UseToastOptions) {
  const toast = useToast({
    containerStyle: {
      position: "relative",
      top: "74px",
    },
    position: "top-right",
    isClosable: true,
    ...option,
  });

  function neoToast(
    toastType: NeoToastType,
    title: string,
    description: string,
    toastOptions?: UseToastOptions,
    undoCallback?: () => void
  ) {
    const neoToastObj = neoToasts.find((t) => t.type === toastType);
    if (!neoToastObj) {
      // TODO: other error handling?
      return;
    }
    const { icon, color } = neoToastObj;
    toast({
      render: (props) => (
        <CustomToast
          title={title}
          description={description}
          icon={icon as IconType}
          color={color as string}
          undoCallback={undoCallback}
          {...props}
        />
      ),
      ...toastOptions,
    });
  }

  return neoToast;
}
