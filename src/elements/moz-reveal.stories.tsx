import type { Meta, StoryObj } from "@storybook/nextjs-vite";

type RevealArgs = { delay: number; label: string };

const meta = {
  title: "Elements/moz-reveal",
  args: { delay: 0, label: "Moz, built live." },
  argTypes: { delay: { control: { type: "range", min: 0, max: 600, step: 20 } } },
  render: ({ delay, label }) => (
    // `key` remounts the element so each change replays the entrance.
    <moz-reveal key={delay} delay={delay} className="text-4xl font-semibold tracking-tight">
      {label}
    </moz-reveal>
  ),
} satisfies Meta<RevealArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One element easing into place. Drag `delay` to replay it. */
export const Default: Story = {};

/** Siblings with rising delays read as one fluid sequence. */
export const Staggered: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {["Research", "Design", "Ship"].map((step, index) => (
        <moz-reveal key={step} delay={index * 80} className="text-2xl font-medium">
          {step}
        </moz-reveal>
      ))}
    </div>
  ),
};
