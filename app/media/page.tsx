import { SectionPending } from "@/components/content/SectionPending";

export const metadata = { title: "Media" };

export default function Page() {
  return (
    <SectionPending
      index="08"
      title="Media"
      intent="Aircraft, workshop, flight testing, competition, team, events, manufacturing and engineering — real photographs and video only."
      needs={[
        "Photographs, sorted by category",
        "Video with poster frames",
        "Captions, and credit for whoever took them",
      ]}
    />
  );
}
