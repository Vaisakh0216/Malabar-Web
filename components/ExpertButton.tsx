"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { whatsappLink } from "@/lib/config";
import { ChatIcon } from "./Icons";

export default function ExpertButton({ context }: { context?: string }) {
  const [hover, setHover] = useState(false);
  // Product pages have a sticky add-to-bag bar on phones, so the button sits above it there.
  const pathname = usePathname();
  const raised = pathname.startsWith("/product/");
  if (pathname.startsWith("/admin")) return null;
  const message = context
    ? `Hi, I'd like help from a style expert about: ${context}`
    : "Hi, I'd like to talk to a style expert.";
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Talk to a style expert on WhatsApp"
      className={`fixed ${raised ? "bottom-[8.5rem] md:bottom-6" : "bottom-20 sm:bottom-6"} right-4 z-30 flex items-center gap-2 rounded-full bg-leaf p-3.5 text-white shadow-lg shadow-leaf/30 transition hover:bg-[#244a40]`}
    >
      <ChatIcon />
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden pr-1 text-sm font-semibold whitespace-nowrap"
          >
            Talk to a stylist
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}
