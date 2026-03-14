"use client";

import { useMediaQuery } from "@/lib/hooks/use-media.query";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", false);
  const [open, setOpen] = useState(false);
  const [desktopMode, setDesktopMode] = useState<"short" | "full">("short");
  const labels = ["CPC1HN AI", "AI hỗ trợ trực tuyến"];
  const [labelIndex, setLabelIndex] = useState(0);

  // Rotate label when bubble is visible
  React.useEffect(() => {
    if (open) return;
    const id = setInterval(() => {
      setLabelIndex((i) => (i + 1) % labels.length);
    }, 2500);
    return () => clearInterval(id);
  }, [open, labels.length]);

  return (
    <>
      <AnimatePresence initial={false}>
        {!open && (
          <motion.div
            key="chat-bubble-wrap"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 lg:right-12 lg:bottom-32"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${labelIndex}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-gray-700 shadow select-none"
              >
                {labels[labelIndex]}
              </motion.div>
            </AnimatePresence>
            <motion.div
              key="chat-bubble"
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 cursor-pointer items-center rounded-full bg-white p-0.5 text-white shadow lg:h-16 lg:w-16 lg:p-1"
            >
              <Image
                width={120}
                height={120}
                className="h-full w-full"
                src={"/icons/happy.png"}
                alt="CPC1HN AI"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {open && isDesktop && desktopMode === "short" && (
          <motion.div
            key="chat-desktop-short"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="fixed right-4 bottom-4 z-50 h-[70vh] w-[400px] overflow-hidden rounded-xl border bg-white shadow-lg lg:right-12 lg:bottom-12"
            style={{ transformOrigin: "bottom right" }}
          >
            <div className="h-full w-full">
              <ChatPanel
                desktopMode={desktopMode}
                onClose={() => setOpen(false)}
                onDesktopModeChange={setDesktopMode}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {open && isDesktop && desktopMode === "full" && (
          <motion.div
            key="chat-desktop-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex h-[100vh] w-full flex-col bg-white"
          >
            <div className="h-full w-full">
              <ChatPanel
                desktopMode={desktopMode}
                onClose={() => setOpen(false)}
                onDesktopModeChange={setDesktopMode}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {open && !isDesktop && (
          <motion.div
            key="chat-mobile-full"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col bg-white"
          >
            <div className="h-full w-full">
              <ChatPanel
                desktopMode={desktopMode}
                onClose={() => setOpen(false)}
                onDesktopModeChange={setDesktopMode}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
