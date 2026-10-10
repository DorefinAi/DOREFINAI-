import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Terms of Use" };

export default async function TermsPage() {
  return <LegalPage {...(await getContent()).legal.terms} />;
}
