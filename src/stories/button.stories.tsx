import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Button, IconButton } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon, AddIcon } from "@chakra-ui/icons";

export default {
  component: Button,
  title: "Neo Design System/Button",
  argTypes: {
    variant: {
      options: ["solid", "outline"],
      defaultValue: "solid",
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
    isDisabled: {
      defaultValue: false,
      control: {
        type: "boolean",
      },
    },
    borderRadius: {
      defaultValue: "6px",
      description:
        "Use px as unit. Type `full` to make the border radius full.",
      control: {
        type: "text",
      },
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Button",
};

export const RightIcon = Template.bind({});
RightIcon.args = {
  children: "Button",
  rightIcon: <ChevronRightIcon />,
};

export const LeftIcon = Template.bind({});
LeftIcon.args = {
  children: "Button",
  leftIcon: <ChevronLeftIcon />,
};

export const IconOnly: ComponentStory<typeof IconButton> = (args) => (
  <IconButton {...args} />
);
IconOnly.args = {
  children: <AddIcon />,
};
