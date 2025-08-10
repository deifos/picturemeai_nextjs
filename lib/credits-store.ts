'use client';

import { create } from 'zustand';

interface CreditsStore {
  credits: number | null;
  setCredits: (credits: number) => void;
  decrementCredits: (amount?: number) => void;
  incrementCredits: (amount: number) => void;
  fetchCredits: () => Promise<void>;
}

export const useCreditsStore = create<CreditsStore>(set => ({
  credits: null,

  setCredits: (credits: number) => set({ credits }),

  decrementCredits: (amount = 1) =>
    set(state => ({
      credits:
        state.credits !== null ? Math.max(0, state.credits - amount) : null,
    })),

  incrementCredits: (amount: number) =>
    set(state => ({
      credits: state.credits !== null ? state.credits + amount : amount,
    })),

  fetchCredits: async () => {
    try {
      const response = await fetch('/api/user/credits');

      if (response.ok) {
        const data = await response.json();

        set({ credits: data.credits });
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  },
}));
