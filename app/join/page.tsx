import { SectionPending } from "@/components/content/SectionPending";

export const metadata = { title: "Join Skylark" };

export default function Page() {
  return (
    <SectionPending
      index="10"
      title="Join Skylark"
      intent="Work on real aircraft. Solve real problems. Learn by doing."
      needs={[
        "Recruitment dates for the current cycle",
        "Which departments are open, and how many places",
        "Application link or form",
        "What a first-year member actually does in their first term",
      ]}
    />
  );
}
