import http from "./httpService";
import config from "./config.json";

export const getQuiz = (id) => {
  return http.get(`${config.api}/api/quiz/learning/${id}`);
};

// export const getPreQuiz = (clientId) =>{
//   return http.get(`${config.api}/api/answer/pre/${clientId}`);
// }

export const getPreQuiz = (clientId) =>{
  return http.get(`${config.api}/api/assesment/client/${clientId}`);
}

export const submitPreQuiz = (clientId) =>{
  return http.post(`${config.api}/api/answer/pre/${clientId}`);
}

export const getAssessmentAnswers = (userId) =>{
  return http.get(`${config.api}/api/answer/pre/user/${userId}`);
}