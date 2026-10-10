import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  return <LegalPage {...(await getContent()).legal.privacy} />;
}
