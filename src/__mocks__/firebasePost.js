export default {
  post: (obj) => {
    obj.id = "29060402";
    obj.date = "2021-10-28";
    return Promise.resolve({
      newData: [obj],
    });
  },
};
