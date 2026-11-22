import Link from "next/link";
import FlowField from "@/components/portfolio/FlowField";
export const metadata = { title: "Flow field" };
export default function FlowFieldPage() {
  return (
    <div className="interior-page experiment-page">
      <Link href="/play" className="back-link">
        Back to play
      </Link>
      <h1 className="page-title">Flow field.</h1>
      <p>
        A small experiment in repetition. Change the cycles, follow the lines,
        find something unexpected.
      </p>
      <FlowField />
    </div>
  );
}
