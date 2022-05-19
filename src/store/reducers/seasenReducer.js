export const seasenReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_SEASEN":
      return { ...action.payload };
    default:
      return state;
  }
};
