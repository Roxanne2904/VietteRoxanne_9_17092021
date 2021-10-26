export const storage = {
  ref: () => storage,
  put: async () => {
    return {
      ref: { getDownloadURL: () => "https//test-rox.com" },
    };
  },
};
