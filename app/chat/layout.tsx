import type { ReactNode } from "react";
import "./chat-cleanup.css";
import "./chat-myanmar-typography-fix.css";
import ChatMyanmarTypographyBridge from "./ChatMyanmarTypographyBridge";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ChatMyanmarTypographyBridge />
      {children}
    </>
  );
}
