import { SectionPending } from "@/components/content/SectionPending";

export const metadata = { title: "Sponsors" };

export default function Page() {
  return (
    <SectionPending
      index="09"
      title="Sponsors"
      intent="What partnering with Skylark supports, what partners receive, and who has backed the team so far."
      needs={[
        "Sponsor logos as SVG or transparent PNG (never recreated)",
        "Which past partners may be named publicly",
        "The current approved sponsorship structure, and whether tiers are public",
        "Contact address for partnership enquiries",
      ]}
    />
  );
}
