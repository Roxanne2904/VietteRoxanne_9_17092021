import firebaseGet from "./firebaseGet.js";

export default {
  post: async () => {
    let bills = await firebaseGet.get();
    return Promise.resolve({
      newDatas: [
        ...bills.datas,
        {
          email: "test@mail.fr",
          type: "Transport",
          name: "Vol Paris-Brasilia",
          amount: 1000,
          date: "2017-06-29",
          vat: 70,
          pct: 20,
          commentary: "hello :D",
          fileUrl:
            "https://firebasestorage.googleapis.com/v0/b/bill-rox.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
          fileName: "bill-rox.jpg",
          status: "pending",
        },
      ],
    });
  },
};
