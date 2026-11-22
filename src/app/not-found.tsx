import Link from "next/link";
export default function NotFound() {
  return (
    <div className="interior-page empty-page">
      <p className="eyebrow">404</p>
      <h1 className="page-title">An unwritten page.</h1>
      <p>There’s nothing here yet. Let’s get you back to the work.</p>
      <Link href="/">Back home</Link>
    </div>
  );
}
