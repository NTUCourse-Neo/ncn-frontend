import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Textarea, Box, Stack, Text, Flex } from "@chakra-ui/react";

export default {
  component: Textarea,
  title: "Neo Design System/Textarea",
  argTypes: {
    isDisabled: {
      defaultValue: false,
      control: {
        type: "boolean",
      },
    },
  },
} as ComponentMeta<typeof Textarea>;

const Template: ComponentStory<typeof Textarea> = (args) => {
  const [value, setValue] = React.useState("");
  const { label, helperText, ...restArgs } = args;
  return (
    <Box w="50%">
      <Stack spacing={1}>
        {label && label !== "" && (
          <Text textStyle={"h6"} color="#616161">
            {label}
          </Text>
        )}
        <Textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          {...restArgs}
        />
        {helperText && helperText !== "" && (
          <Flex
            justifyContent={"space-between"}
            flexDirection="row"
            textStyle="body2"
            color="#6f6f6f"
          >
            <Text>{helperText}</Text>
            <Text>{value.length ?? 0}/100</Text>
          </Flex>
        )}
      </Stack>
    </Box>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: "placeholder",
  label: "Label",
  helperText: "Helper Text",
};
