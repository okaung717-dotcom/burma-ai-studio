"use client";

import { useLayoutEffect } from "react";

const SESSION_KEY = "bas_full_chat_session";
const HISTORY_PREFIX = "bas_website_chat_history_v2";
const LEGACY_HISTORY_KEY = "bas_website_chat_history";

type StoredMessage = {
  id?: string;
  role?: "assistant" | "user";
  content?: string;
  createdAt?: string;
};

function readMessages(raw: string | null): StoredMessage[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value): value is StoredMessage => {
      if (!value || typeof value !== "object") return false;
      const message = value as StoredMessage;
      return (
        (message.role === "assistant" || message.role === "user") &&
        typeof message.content === "string" &&
        Boolean(message.content.trim())
      );
    });
  } catch {
    return [];
  }
}

function messageTime(message: StoredMessage) {
  const value = Date.parse(message.createdAt || "");
  return Number.isFinite(value) ? value : 0;
}

function messageKey(message: StoredMessage) {
  if (message.id) return `id:${message.id}`;
  return `${message.role || "assistant"}|${message.createdAt || ""}|${message.content || ""}`;
}

function mergeMessages(...groups: StoredMessage[][]) {
  const merged = new Map<string, StoredMessage>();

  groups.flat().forEach((message) => {
    const key = messageKey(message);
    const current = merged.get(key);
    if (!current || messageTime(message) >= messageTime(current)) merged.set(key, message);
  });

  return Array.from(merged.values()).sort((a, b) => messageTime(a) - messageTime(b));
}

function safeIdentityPart(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9@._:-]+/g, "-").slice(0, 180);
}

function getStorageIdentity() {
  try {
    const rawProfile = window.localStorage.getItem("bas_website_profile");
    if (rawProfile) {
      const profile = JSON.parse(rawProfile) as { id?: unknown; email?: unknown };
      if (typeof profile.id === "string" && profile.id.trim()) {
        return `account-${safeIdentityPart(profile.id)}`;
      }
      if (typeof profile.email === "string" && profile.email.trim()) {
        return `email-${safeIdentityPart(profile.email)}`;
      }
    }
  } catch {
    // Fall through to the persistent visitor identity.
  }

  const visitorId = window.localStorage.getItem("bas_visitor_id") || "website-visitor";
  return `visitor-${safeIdentityPart(visitorId)}`;
}

function historyKey() {
  return `${HISTORY_PREFIX}:${getStorageIdentity()}`;
}

export default function ChatHistoryPersistence() {
  useLayoutEffect(() => {
    let lastSessionValue = "";
    let activeHistoryKey = historyKey();

    const restore = () => {
      activeHistoryKey = historyKey();
      const sessionMessages = readMessages(window.sessionStorage.getItem(SESSION_KEY));
      const accountMessages = readMessages(window.localStorage.getItem(activeHistoryKey));
      const legacyMessages = readMessages(window.localStorage.getItem(LEGACY_HISTORY_KEY));
      const merged = mergeMessages(legacyMessages, accountMessages, sessionMessages);

      if (!merged.length) return;

      const serialized = JSON.stringify(merged);
      window.localStorage.setItem(activeHistoryKey, serialized);
      window.sessionStorage.setItem(SESSION_KEY, serialized);
      lastSessionValue = serialized;
    };

    const persist = () => {
      const nextHistoryKey = historyKey();
      const rawSession = window.sessionStorage.getItem(SESSION_KEY) || "";
      const identityChanged = nextHistoryKey !== activeHistoryKey;

      if (!identityChanged && rawSession === lastSessionValue) return;

      const previousMessages = readMessages(window.localStorage.getItem(activeHistoryKey));
      const accountMessages = readMessages(window.localStorage.getItem(nextHistoryKey));
      const sessionMessages = readMessages(rawSession);
      const merged = mergeMessages(previousMessages, accountMessages, sessionMessages);

      activeHistoryKey = nextHistoryKey;
      if (!merged.length) {
        lastSessionValue = rawSession;
        return;
      }

      const serialized = JSON.stringify(merged);
      window.localStorage.setItem(activeHistoryKey, serialized);
      lastSessionValue = rawSession;
    };

    restore();

    const timer = window.setInterval(persist, 250);
    const handlePageHide = () => persist();
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") persist();
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      persist();
      window.clearInterval(timer);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
