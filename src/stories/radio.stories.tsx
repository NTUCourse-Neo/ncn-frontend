import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Radio } from "@chakra-ui/react";

export default {
  component: Radio,
  title: "Neo Components/Radio",
  argTypes: {
    isDisabled: {
      defaultValue: false,
      control: {
        type: "boolean",
      },
    },
    isChecked: {
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
} as ComponentMeta<typeof Radio>;

const Template: ComponentStory<typeof Radio> = (args) => <Radio {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Label",
};
