import { useToast, UseToastOptions } from "@chakra-ui/react";
import { CustomToast } from "@/components/Toast";
import { MdFavorite, MdCheckCircle, MdCancel, MdWarning } from "react-icons/md";
import { IconType } from "react-icons/lib";

export type NeoToastType =
  | "add_course"
  | "remove_course"
  | "add_favorite"
  | "remove_favorite"
  | "operation_failed";
export interface NeoToast {
  type: NeoToastType;
  icon: IconType;
  isSuccess: boolean;
  chineseTitle: string;
  englishTitle: string;
}
export const neoToasts: NeoToast[] = [
  {
    type: "add_course",
    icon: MdCheckCircle,
    isSuccess: true,
    chineseTitle: "已加入課程",
    englishTitle: "Course added",
  },
  {
    type: "remove_course",
    icon: MdCancel,
    isSuccess: false,
    chineseTitle: "已移除課程",
    englishTitle: "Course removed",
  },
  {
    type: "add_favorite",
    icon: MdFavorite,
    isSuccess: true,
    chineseTitle: "已收藏課程",
    englishTitle: "Course added to favorites",
  },
  {
    type: "remove_favorite",
    icon: MdCancel,
    isSuccess: false,
    chineseTitle: "已移除課程",
    englishTitle: "Course removed from favorites",
  },
  {
    type: "operation_failed",
    icon: MdWarning,
    isSuccess: false,
    chineseTitle: "操作失敗",
    englishTitle: "Operation failed",
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
    description: string,
    toastOptions?: UseToastOptions,
    undoCallback?: () => void
  ) {
    const neoToastObj = neoToasts.find((t) => t.type === toastType);
    if (!neoToastObj) {
      // TODO: other error handling?
      return;
    }
    toast({
      render: (props) => (
        <CustomToast
          description={description}
          toast={neoToastObj}
          undoCallback={undoCallback}
          {...props}
        />
      ),
      ...toastOptions,
    });
  }

  return neoToast;
}
