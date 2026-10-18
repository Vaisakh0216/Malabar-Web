import { whatsappLink } from "@/lib/config";

export default function ExpertButton({ context }: { context?: string }) {
  const message = context
    ? `Hi, I'd like help from a style expert about: ${context}`
    : "Hi, I'd like to talk to a style expert.";
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-30 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-green-700"
    >
      Talk to an expert
    </a>
  );
}
