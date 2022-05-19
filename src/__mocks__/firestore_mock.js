import { bills } from "../fixtures/bills.js";

export const firestore_mock = {
  bills: () => firestore_mock,
  add: async () => {
    return this.onNavigate(ROUTES_PATH["Bills"]);
  },
  get: async () => {
    return {
      docs: bills,
    };
  },
  storage: {
    ref: () => firestore_mock.storage,
    put: async () => {
      return {
        ref: { getDownloadURL: () => "https//test-rox.com" },
      };
    },
  },
};
