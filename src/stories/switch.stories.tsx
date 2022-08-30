import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Switch } from "@chakra-ui/react";

export default {
  component: Switch,
  title: "Neo Components/Switch",
  argTypes: {
    isDisabled: {
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
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Label",
};
