import { SectionPending } from "@/components/content/SectionPending";

export const metadata = { title: "SAE Aero Design" };

export default function Page() {
  return (
    <SectionPending
      index="04"
      title="SAE Aero Design"
      intent="What the competition asks of a team, explained from Skylark's side of it: three classes, a design report, an oral presentation and a flight that has to actually work."
      needs={[
        "Competition scoring breakdown the team wants shown publicly",
        "Photographs from competition",
        "Which results are final versus projected",
      ]}
    />
  );
}
