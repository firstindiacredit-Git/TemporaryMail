const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")
    : "") || "";

export const api = {
  async createMailbox() {
    const res = await fetch(`${API_BASE}/api/mailboxes`, { method: "POST" });
  },
  async getMessages(mailboxId) {
    const res = await fetch(`${API_BASE}/api/mailboxes/${mailboxId}/messages`);
  },
  async extendMailbox(mailboxId) {
    const res = await fetch(`${API_BASE}/api/mailboxes/${mailboxId}/extend`, {
      method: "POST",
    });
  },
};