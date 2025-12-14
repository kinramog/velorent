import { create } from "zustand";

type ToastType = "success" | "error";

interface ToastState {
  messages: string[];
  type: ToastType | null;
  show: (type: ToastType, messages: string[] | string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  messages: [],
  type: null,

  show: (type, messages) => {
    set({
      type,
      messages: Array.isArray(messages) ? messages : [messages],
    });

    setTimeout(() => {
      set({ messages: [], type: null });
    }, 4000);
  },

  clear: () => set({ messages: [], type: null }),
}));
