import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Checkbox } from "@chakra-ui/react";

export default {
  component: Checkbox,
  title: "Neo Design System/Checkbox",
  argTypes: {
    variant: {
      options: ["default", "rounded"],
      defaultValue: "default",
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
    isIndeterminate: {
      defaultValue: false,
      control: {
        type: "boolean",
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
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "Label",
};
