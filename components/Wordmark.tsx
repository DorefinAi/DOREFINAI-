import Link from "next/link";

// The Dorefin mark, traced from the supplied logo: a ring crossed by a bar
// that breaks at the centre.
export function Mark() {
  return (
    <svg className="wordmark-mark" viewBox="0 0 155 110" fill="none" aria-hidden="true">
      <circle cx="75" cy="55" r="47" stroke="currentColor" strokeWidth="15" />
      <rect x="4" y="47" width="56" height="16" fill="currentColor" />
      <rect x="91" y="47" width="60" height="16" fill="currentColor" />
    </svg>
  );
}

export default function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="Dorefin AI, home">
      <Mark />
      Dorefin AI
    </Link>
  );
}
