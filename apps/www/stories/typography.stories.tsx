import { Meta, StoryObj } from "@storybook/react"

import {
  BlockQuote,
  H1,
  H2,
  H3,
  H4,
  InlineCode,
  LI,
  Large,
  Lead,
  P,
  Small,
  Subtle,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  UL,
} from "@/registry/default/ui/typography"

const meta: Meta = {
  title: "ui/Typography",
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj

export const H1Story: Story = {
  name: "H1",
  render: (args) => <H1>Taxing Laughter: The Joke Tax Chronicles</H1>,
  args: {},
}

export const H2Story: Story = {
  name: "H2",
  render: (args) => <H2>Taxing Laughter: The Joke Tax Chronicles</H2>,
  args: {},
}

export const H3Story: Story = {
  name: "H3",
  render: (args) => <H3>Taxing Laughter: The Joke Tax Chronicles</H3>,
  args: {},
}

export const H4Story: Story = {
  name: "H4",
  render: (args) => <H4>Taxing Laughter: The Joke Tax Chronicles</H4>,
  args: {},
}

export const PStory: Story = {
  name: "P",
  render: (args) => <P>Taxing Laughter: The Joke Tax Chronicles</P>,
  args: {},
}

export const BlockQuoteStory: Story = {
  name: "BlockQuote",
  render: (args) => (
    <BlockQuote>Taxing Laughter: The Joke Tax Chronicles</BlockQuote>
  ),
  args: {},
}

export const TableStory: Story = {
  name: "Table",
  render: (args) => (
    <div className="my-6 w-full overflow-y-auto">
      <Table className="w-full">
        <THead>
          <TR className="m-0 border-t border-slate-300 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800">
            <TH className="border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
              King's Treasury
            </TH>
            <TH className="border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
              People's happiness
            </TH>
          </TR>
        </THead>
        <TBody>
          <TR className="m-0 border-t border-slate-200 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800">
            <TD className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
              Empty
            </TD>
            <TD className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
              Overflowing
            </TD>
          </TR>
          <TR className="m-0 border-t border-slate-200 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800">
            <TD className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
              Modest
            </TD>
            <TD className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
              Satisfied
            </TD>
          </TR>
          <TR className="m-0 border-t border-slate-200 p-0 even:bg-slate-100 dark:border-slate-600 dark:even:bg-slate-800">
            <TD className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
              Full
            </TD>
            <TD className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
              Ecstatic
            </TD>
          </TR>
        </TBody>
      </Table>
    </div>
  ),
  args: {},
}

export const ListULStory: Story = {
  name: "List UL",
  render: (args) => (
    <UL className="my-6 ml-6 list-disc [&>li]:mt-2">
      <LI>1st level of puns: 5 gold coins</LI>
      <LI>2nd level of jokes: 10 gold coins</LI>
      <LI>3rd level of humor: 15 gold coins</LI>
    </UL>
  ),
  args: {},
}

export const InlineCodeStory: Story = {
  name: "InlineCode",
  render: (args) => (
    <InlineCode>Taxing Laughter: The Joke Tax Chronicles</InlineCode>
  ),
  args: {},
}

export const LeadStory: Story = {
  name: "Lead",
  render: (args) => <Lead>Taxing Laughter: The Joke Tax Chronicles</Lead>,
  args: {},
}

export const LargeStory: Story = {
  name: "Large",
  render: (args) => <Large>Taxing Laughter: The Joke Tax Chronicles</Large>,
  args: {},
}

export const SmallStory: Story = {
  name: "Small",
  render: (args) => <Small>Taxing Laughter: The Joke Tax Chronicles</Small>,
  args: {},
}

export const SubtleStory: Story = {
  name: "Subtle",
  render: (args) => <Subtle>Taxing Laughter: The Joke Tax Chronicles</Subtle>,
  args: {},
}
