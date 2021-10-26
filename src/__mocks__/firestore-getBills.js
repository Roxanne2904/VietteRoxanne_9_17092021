import { bills } from "../fixtures/bills.js";

export const storage = {
  bills: () => storage,
  get: async () => {
    return {
      docs: bills,
    };
  },
};
