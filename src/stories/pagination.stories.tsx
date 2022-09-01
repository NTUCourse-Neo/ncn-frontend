import PaginationButton from "@/components/PaginationButton";
import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: PaginationButton,
  title: "Neo Design System/Pagination",
  argTypes: {
    useIcon: {
      defaultValue: false,
      control: {
        type: "boolean",
      },
    },
  },
} as ComponentMeta<typeof PaginationButton>;

const Template: ComponentStory<typeof PaginationButton> = (args) => {
  const { numberOfPages, onClick, ...restArgs } = args;
  return (
    <PaginationButton
      numberOfPages={numberOfPages}
      onClick={onClick}
      {...restArgs}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  numberOfPages: 10,
  maxVisiblePages: 5,
  onClick: (page) => {
    console.log(`page ${page}`);
  },
  useIcon: false,
};
