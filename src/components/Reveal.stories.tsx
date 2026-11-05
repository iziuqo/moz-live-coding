import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Reveal } from "./Reveal";

const meta = {
  title: "Motion/Reveal",
  component: Reveal,
  args: { children: "Moz, built live.", delay: 0 },
  argTypes: { delay: { control: { type: "range", min: 0, max: 1, step: 0.05 } } },
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single element easing into place. Toggle "Remount" to replay. */
export const Default: Story = {
  args: { className: "text-4xl font-semibold tracking-tight" },
};

/** Siblings with increasing delays read as one fluid sequence. */
export const Staggered: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {["Research", "Design", "Ship"].map((label, index) => (
        <Reveal key={label} delay={index * 0.08} className="text-2xl font-medium">
          {label}
        </Reveal>
      ))}
    </div>
  ),
};
