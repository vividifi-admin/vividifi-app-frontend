import { combineReducers } from "redux";
import { clinetReducer } from "./clinetReducer";
import { episodeReducer } from "./episodeReducer";
import { learningReducer } from "./learningReducer";
import { quizReducer } from "./quizReducer";
import { seasenReducer } from "./seasenReducer";
import { seriesReducer } from "./seriesReducer";
import { singleEpisodeReducer } from "./singleEpisodeReducer";
import { singleSeasenReducer } from "./singleSeasenReducer";
import { singleSeriesRenderer } from "./singleSeriesReducer";

export const reducers = combineReducers({
  series: seriesReducer,
  singleSeries: singleSeriesRenderer,
  seasen: seasenReducer,
  singleSeasen: singleSeasenReducer,
  learning: learningReducer,
  episode: episodeReducer,
  singleEpisode: singleEpisodeReducer,
  quiz: quizReducer,
  clinet: clinetReducer,
});
