import { PageHeading } from "@/components/page-heading";
import { SettingsView } from "@/components/settings-view";

export default function SettingsPage() { return <div><PageHeading eyebrow="Settings" title="Make the workspace yours" description="Control appearance, motion, and optional browser speech features. Text mode always remains fully available." /><SettingsView /></div>; }
