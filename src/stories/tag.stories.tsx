import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Tag, TagLabel, TagRightIcon, TagLeftIcon } from "@chakra-ui/react";
import { CloseIcon, ArrowRightIcon } from "@chakra-ui/icons";

export default {
  component: Tag,
  title: "Neo Design System/Badge",
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      defaultValue: "md",
      control: {
        type: "select",
      },
    },
    colorScheme: {
      options: ["primary", "secondary", "error", "warning", "success"],
      defaultValue: "primary",
      control: {
        type: "select",
      },
    },
  },
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => {
  const { children, rightIcon, leftIcon, ...restArgs } = args;
  return (
    <Tag {...restArgs}>
      {leftIcon && <TagLeftIcon boxSize="6px" as={leftIcon} />}
      {children && <TagLabel>{children}</TagLabel>}
      {rightIcon && <TagRightIcon boxSize="6px" as={rightIcon} />}
    </Tag>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: "Label",
};

export const RightIcon = Template.bind({});
RightIcon.args = {
  children: "Label",
  rightIcon: CloseIcon,
};

export const LeftIcon = Template.bind({});
LeftIcon.args = {
  children: "Label",
  leftIcon: ArrowRightIcon,
};

export const Both = Template.bind({});
Both.args = {
  children: "Label",
  rightIcon: CloseIcon,
  leftIcon: ArrowRightIcon,
};

export const IconOnly: ComponentStory<typeof Tag> = (args) => {
  const { iconSize, ...restArgs } = args;
  return (
    <Tag p={1} {...restArgs}>
      <CloseIcon boxSize={iconSize} />
    </Tag>
  );
};
IconOnly.args = {
  iconSize: "6px",
};
