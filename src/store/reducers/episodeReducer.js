export const episodeReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_EPISODE":
      return { ...action.payload };
    case "CLEAR_EPISODE":
      return { ...action.payload };
    default:
      return state;
  }
};
