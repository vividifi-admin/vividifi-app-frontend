export const quizReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_QUIZ":
      return { ...action.payload };
    default:
      return state;
  }
};
