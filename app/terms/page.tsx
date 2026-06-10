import { LegalPage } from "@/components/LegalPage";
import { fetchLegalPage, legalUpdatedLabel } from "@/lib/legal";

export const metadata = {
  title: "Terms of Service — Fits You",
  description: "The terms for using the Fits You website and Plan Builder.",
};

export const revalidate = 0;

export default async function TermsPage() {
  // Admin-managed content takes over once published; otherwise the built-in
  // draft copy below renders.
  const db = await fetchLegalPage("terms");
  if (db) {
    return <LegalPage title={db.title} updated={legalUpdatedLabel(db.effective_date)} bodyHtml={db.body} />;
  }
  return (
    <LegalPage
      title="Terms of Service"
      updated="Effective date: pending counsel review"
      intro="These terms govern your use of the Fits You website. By using the site or submitting the Plan Builder, you agree to them. Fits You does not sell products or take payment on this site; it provides information and lets you request a tailored plan."
      sections={[
        {
          h: "What Fits You is",
          p: ["This site presents information about Fits You's approach and lets you build a plan or subscribe to updates. Submitting the Plan Builder is a request to be contacted — it is not an order, purchase, or binding agreement to buy anything. Any product, pricing, or fulfillment is arranged separately."],
        },
        {
          h: "Eligibility",
          p: ["You must be able to form a binding agreement to use the site and should only submit your own information. Fits You is intended for use within the United States."],
        },
        {
          h: "The Plan Builder & intake",
          p: ["When you complete the Plan Builder, you provide details we use to prepare a tailored plan and to contact you. Any plan shape or sample shown is illustrative — your actual plan is finalized by our team. Results vary; individual outcomes depend on many factors."],
        },
        {
          h: "Communications & consent",
          p: ["By opting in, you consent to receive the communications you selected. Email marketing can be stopped via the unsubscribe link in any message. If you opt in to text messages, you consent to recurring automated marketing texts; message and data rates may apply; reply STOP to opt out or HELP for help. Consent is not a condition of any purchase."],
        },
        {
          h: "Health & medical disclaimer",
          p: ["Fits You provides general information about nutrition, supplements, and training. It is not medical advice and is not a substitute for professional care. Consult a qualified healthcare provider before starting any nutrition, supplement, or training program, especially if you have a medical condition. Statements about dietary supplements have not been evaluated by the Food and Drug Administration and are not intended to diagnose, treat, cure, or prevent any disease."],
        },
        {
          h: "Intellectual property",
          p: ["The site's content, design, and marks are owned by Fits You or its licensors and may not be used without permission."],
        },
        {
          h: "Disclaimers & limitation of liability",
          p: ["The site is provided “as is,” without warranties of any kind. To the fullest extent permitted by law, Fits You is not liable for indirect, incidental, or consequential damages arising from your use of the site. [Counsel to tailor warranty and liability language.]"],
        },
        {
          h: "Changes & governing law",
          p: ["We may update these terms; material changes will be reflected by the effective date above. [Counsel to insert governing law, venue, and dispute-resolution terms.]"],
        },
        {
          h: "Contact",
          p: ["Questions about these terms can be sent to the contact address Fits You publishes. [Counsel to insert entity and contact details.]"],
        },
      ]}
    />
  );
}
