import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Text, Box } from "@chakra-ui/react";

export default {
  component: Text,
  title: "Neo Design System/Typography",
  argTypes: {
    textStyle: {
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "title",
        "subtitle",
        "body1",
        "body2",
        "caption1",
        "caption2",
        "small1",
        "small2",
        "tiny1",
        "tiny2",
      ],
      defaultValue: "h1",
      control: {
        type: "select",
      },
    },
  },
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof Text> = (args) => (
  <Box w="100%">
    <Text {...args} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  children:
    "'The quick brown fox jumps over the lazy dog' is an English-language pangram—a sentence that contains all of the letters of the English alphabet. 'The quick brown fox jumps over the lazy dog' is an English-language pangram—a sentence that contains all of the letters of the English alphabet. 'The quick brown fox jumps over the lazy dog' is an English-language pangram—a sentence that contains all of the letters of the English alphabet.",
  textStyle: "h1",
};
