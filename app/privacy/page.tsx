import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Privacy Policy — Fits You",
  description: "How Fits You collects, uses, and protects your information, including sensitive health and fitness details.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="Effective date: pending counsel review"
      intro="This policy explains what information Fits You collects when you build a plan or subscribe, how we use it, and the choices and rights you have. Fits You is a lead-generation experience — we do not sell products or process payments on this site."
      sections={[
        {
          h: "Information we collect",
          p: ["We collect the information you choose to provide, plus limited technical data:"],
          list: [
            "Plan Builder intake — your goals, food preferences, allergies, training frequency and type, and optional body metrics (such as age, weight, height, and biological sex).",
            "Subscription details — email address, optional name, and (if you opt in) mobile number.",
            "Consent records — whether you agreed to email and/or SMS contact, with timestamps, IP address, and browser/user-agent, retained as evidence of consent.",
            "Technical and analytics data — collected via cookies and analytics tools when enabled (see Cookies & analytics).",
          ],
        },
        {
          h: "Sensitive personal information",
          p: [
            "Some Plan Builder inputs — health and fitness details such as body metrics and goals — may constitute sensitive personal information under the California Privacy Rights Act (CPRA) and similar laws in other U.S. states.",
            "We collect this information only to build and personalize your plan and to contact you about it. We do not use or disclose it for purposes other than those, and you may request that we limit its use. We do not sell or share this information for cross-context behavioral advertising.",
          ],
        },
        {
          h: "How we use your information",
          list: [
            "To build and calibrate your tailored plan and follow up with next steps.",
            "To send the communications you consented to (plan updates, occasional notes; SMS only if you opted in).",
            "To operate, secure, and improve the site.",
            "To comply with legal obligations and maintain consent records.",
          ],
        },
        {
          h: "Legal basis & consent",
          p: ["Where consent is the basis for contacting you, we rely on the explicit opt-in you provide. You can withdraw consent at any time — unsubscribe via any email, or reply STOP to text messages."],
        },
        {
          h: "How we share information",
          p: ["We share information only with service providers who help us operate the site and communicate with you (for example, hosting, database, and email providers), under contracts that limit their use of it. We do not sell your personal information."],
        },
        {
          h: "Data retention",
          p: ["We keep lead and subscriber information for as long as needed to contact you and operate the service, and consent records for as long as required to evidence consent. You may ask us to delete your information (see Your rights)."],
        },
        {
          h: "Your rights",
          p: ["Depending on where you live, you may have the right to:"],
          list: [
            "Access the personal information we hold about you.",
            "Correct or delete your personal information.",
            "Opt out of marketing communications at any time.",
            "Limit the use and disclosure of sensitive personal information.",
            "Not receive discriminatory treatment for exercising these rights.",
          ],
        },
        {
          h: "Cookies & analytics",
          p: ["When enabled, we use analytics tools (such as Google Analytics, Google Tag Manager, and Microsoft Clarity) to understand site usage. We do not push personally identifying details into analytics. You can control cookies through your browser settings."],
        },
        {
          h: "Contact",
          p: ["Questions or requests regarding your information can be sent to the contact address Fits You publishes. [Counsel to insert the controller entity, contact email/address, and any state-specific request channels.]"],
        },
      ]}
    />
  );
}
