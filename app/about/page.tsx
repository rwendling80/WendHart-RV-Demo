const faqs = [
  {
    question: "What should I know about buying a used RV here?",
    answer:
      "[Placeholder — replace with your own explanation.] Every unit on our lot is inspected before it's listed. We write up honest condition notes for each one — not generic marketing language — so you know what you're getting before you ever drive out to see it.",
  },
  {
    question: "Can I inspect or test-drive before buying?",
    answer:
      "[Placeholder.] Yes. Come by the lot during business hours, or call ahead to schedule a time that works for you.",
  },
  {
    question: "Do you offer financing or warranties?",
    answer:
      "[Placeholder — fill in your actual financing/warranty policy here.]",
  },
  {
    question: "Do you take trade-ins?",
    answer:
      "[Placeholder — describe your trade-in process here.]",
  },
  {
    question: "What paperwork is involved in buying a unit?",
    answer:
      "[Placeholder — explain your title transfer / paperwork process here.]",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-forest-dark mb-2">
        Buying Guide
      </h1>
      <p className="text-lg text-charcoal-light mb-8">
        Straight answers to the questions we hear most. (This page is
        placeholder text — swap in your own wording anytime.)
      </p>

      <div className="space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-lg border-2 border-charcoal/10 bg-white p-5"
          >
            <h2 className="text-xl font-bold text-charcoal">
              {faq.question}
            </h2>
            <p className="mt-2 text-lg leading-relaxed text-charcoal-light">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
