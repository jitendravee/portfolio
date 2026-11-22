import { FiArrowUpRight, FiFileText } from "react-icons/fi";
import { profile } from "@/data/portfolio";

export default function FloatingCV() {
  return (
    <a
      className="floating-cv"
      href={profile.resume}
      target="_blank"
      rel="noreferrer"
      aria-label="View CV (PDF, opens in a new tab)"
    >
      <FiFileText aria-hidden="true" />
      <span>View CV</span>
      <FiArrowUpRight aria-hidden="true" />
    </a>
  );
}
