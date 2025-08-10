'use client';

import { create } from 'zustand';

interface CreditInfo {
  total: number;
  paidCredits: number;
  freeCredits: number;
}

interface CreditsStore {
  creditInfo: CreditInfo | null;
  setCreditInfo: (creditInfo: CreditInfo) => void;
  decrementCredits: (amount?: number) => void;
  incrementCredits: (amount: number) => void;
  fetchCredits: () => Promise<void>;
}

export const useCreditsStore = create<CreditsStore>(set => ({
  creditInfo: null,

  setCreditInfo: (creditInfo: CreditInfo) => set({ creditInfo }),

  decrementCredits: (amount = 1) =>
    set(state => {
      if (state.creditInfo === null) {
        return {};
      }

      // Calculate new credit breakdown
      let remainingToDeduct = amount;
      let newFreeCredits = state.creditInfo.freeCredits;
      let newPaidCredits = state.creditInfo.paidCredits;

      // First deduct from free credits
      if (newFreeCredits > 0 && remainingToDeduct > 0) {
        const freeToDeduct = Math.min(newFreeCredits, remainingToDeduct);

        newFreeCredits -= freeToDeduct;
        remainingToDeduct -= freeToDeduct;
      }

      // Then deduct from paid credits
      if (newPaidCredits > 0 && remainingToDeduct > 0) {
        const paidToDeduct = Math.min(newPaidCredits, remainingToDeduct);

        newPaidCredits -= paidToDeduct;
        remainingToDeduct -= paidToDeduct;
      }

      const newTotal = newFreeCredits + newPaidCredits;

      return {
        creditInfo: {
          total: newTotal,
          freeCredits: newFreeCredits,
          paidCredits: newPaidCredits,
        },
      };
    }),

  incrementCredits: (amount: number) =>
    set(state => {
      if (state.creditInfo === null) {
        return {
          creditInfo: {
            total: amount,
            paidCredits: amount,
            freeCredits: 0,
          },
        };
      }

      const newTotal = state.creditInfo.total + amount;

      return {
        creditInfo: {
          ...state.creditInfo,
          total: newTotal,
          paidCredits: state.creditInfo.paidCredits + amount,
        },
      };
    }),

  fetchCredits: async () => {
    try {
      const response = await fetch('/api/user/credits');

      if (response.ok) {
        const data = await response.json();

        set({
          creditInfo: {
            total: data.total,
            paidCredits: data.paidCredits,
            freeCredits: data.freeCredits,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  },
}));
