import { ConceptNetwork } from "@/components/concept-network";
import { PageHeading } from "@/components/page-heading";

export default function ConnectionsPage() {
  return <div><PageHeading eyebrow="Concept connections" title="See the reasoning between chapters" description="Explore a clickable sample map showing how microarchitectural details become measurable performance consequences." /><ConceptNetwork /></div>;
}
