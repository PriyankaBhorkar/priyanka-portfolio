"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface ChatContextValue { open: boolean; openChat: () => void; closeChat: () => void }

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openChat, closeChat }), [open, openChat, closeChat]);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
