"use client";

/* Tiny localStorage inbox that connects the PUBLIC website forms
   (admission + contact) to the ADMIN panel. No backend needed. */

export type InboxApplication = {
  id: string;
  studentName: string;
  grade: string;
  phone: string;
  email: string;
  guardian?: string;
  date: string;
};

export type InboxMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
};

const APPS_KEY = "sv_inbox_applications";
const MSGS_KEY = "sv_inbox_messages";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function push<T>(key: string, item: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify([item, ...read<T>(key)]));
  } catch {
    /* storage full / unavailable — prototype continues without persistence */
  }
}

export const saveApplication = (a: InboxApplication) => push(APPS_KEY, a);
export const saveMessage = (m: InboxMessage) => push(MSGS_KEY, m);
export const getInboxApplications = (): InboxApplication[] => read<InboxApplication>(APPS_KEY);
export const getInboxMessages = (): InboxMessage[] => read<InboxMessage>(MSGS_KEY);

export const todayISO = () => new Date().toISOString().slice(0, 10);
