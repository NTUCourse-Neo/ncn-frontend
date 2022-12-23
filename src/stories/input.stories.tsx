import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { EmailIcon, TriangleDownIcon } from "@chakra-ui/icons";

export default {
  component: Input,
  title: "Neo Design System/Input",
  argTypes: {
    isDisabled: {
      defaultValue: false,
      control: {
        type: "boolean",
      },
    },
    isInvalid: {
      defaultValue: false,
      control: {
        type: "boolean",
      },
    },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
  const {
    label,
    hint,
    leftElement,
    rightElement,
    isInvalid,
    isDisabled,
    ...restArgs
  } = args;
  return (
    <Stack spacing={1.5}>
      {label !== "" && label && (
        <Text textStyle={"h6"} color="#2d2d2d">
          {label}
        </Text>
      )}
      <InputGroup>
        {leftElement && (
          <InputLeftElement
            color={isDisabled ? "#909090" : isInvalid ? "#CE0829" : "#2d2d2d"}
            pointerEvents="none"
          >
            {leftElement}
          </InputLeftElement>
        )}
        <Input isInvalid={isInvalid} isDisabled={isDisabled} {...restArgs} />
        {rightElement && (
          <InputRightElement color={isDisabled ? "#909090" : "#2d2d2d"}>
            {rightElement}
          </InputRightElement>
        )}
      </InputGroup>
      {hint !== "" && hint && (
        <Text textStyle={"body2"} color={isInvalid ? "#B21927" : "#6f6f6f"}>
          {hint}
        </Text>
      )}
    </Stack>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: "pat@shuffle.dev",
  isInvalid: false,
  label: "Email",
  hint: "Text under input",
};

export const LeadIcon = Template.bind({});
LeadIcon.args = {
  placeholder: "pat@shuffle.dev",
  leftElement: <EmailIcon />,
  isInvalid: false,
  isDisabled: false,
  label: "Email",
  hint: "Text under input",
};

export const RightClickIcon = Template.bind({});
RightClickIcon.args = {
  placeholder: "pat@shuffle.dev",
  rightElement: <TriangleDownIcon />,
  isInvalid: false,
  isDisabled: false,
  label: "Email",
  hint: "Text under input",
};

export const LeadAndRightClickIcon = Template.bind({});
LeadAndRightClickIcon.args = {
  placeholder: "pat@shuffle.dev",
  leftElement: <EmailIcon />,
  rightElement: <TriangleDownIcon />,
  isInvalid: false,
  isDisabled: false,
  label: "Email",
  hint: "Text under input",
};
