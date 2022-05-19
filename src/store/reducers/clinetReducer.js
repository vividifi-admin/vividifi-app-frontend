export const clinetReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_CLINET":
      return { ...action.payload };
    default:
      return state;
  }
};
