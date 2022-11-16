import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbProps,
  Center,
} from "@chakra-ui/react";
import Link from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface CustomBreadcrumbProps extends BreadcrumbProps {
  readonly pageItems: {
    text: string;
    href: string;
  }[];
}

export default function CustomBreadcrumb(props: CustomBreadcrumbProps) {
  const { pageItems, ...restProps } = props;
  return (
    <Breadcrumb
      alignItems={"center"}
      justifyContent={"center"}
      separator={
        <Center>
          <ChevronRightIcon color="black" h="100%" boxSize="16px" />
        </Center>
      }
      {...restProps}
    >
      {pageItems.map((item, index) => {
        const isLastPage = index === pageItems.length - 1;
        return (
          <BreadcrumbItem
            key={index}
            color={isLastPage ? "#002F94" : "#6f6f6f"}
            sx={{
              fontSize: "14px",
              lineHeight: "1.4",
            }}
          >
            <Link href={item.href}>{item.text}</Link>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
