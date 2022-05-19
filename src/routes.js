import Episode from "./pages/Episode";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SeasonPage from "./pages/allSeason";
import Series from "./pages/Series";
import SingleSeasen from "./pages/SingleSeasen";
import SingleSeries from "./pages/SingleSeries";
import DashboardPage from "./pages/profile/dashboard";
import LeaderBoardPage from "./pages/profile/leaderBoard";
import SignUpPage from "./pages/SignUp";

const routes = [
  {
    name: "index",
    url: "/",
    component: Index,
  },
  {
    name: "login",
    url: "/login",
    component: Login,
  },
  {
    name: "signUp",
    url: "/signUp",
    component: SignUpPage,
  },
  {
    name: "home",
    url: "/home",
    component: Home,
  },
  {
    name: "series",
    url: "/series/:id",
    component: SingleSeries,
  },
  {
    name: "season",
    url: "/season/:seasonId/:seriesId",
    component: SingleSeasen,
  },
  {
    name: "episode",
    url: "/episode/:episodeId/:seasonId/:seriesId",
    component: Episode,
  },
  {
    name: "series",
    url: "/series",
    component: Series,
  },
  {
    name: "allSeason",
    url: "/all-season/:seriesId",
    component: SeasonPage,
  },
  {
    name: "dashboard",
    url: "/dashboard",
    component: DashboardPage,
  },
  {
    name: "leader-board",
    url: "/leader-board",
    component: LeaderBoardPage,
  },
];
export default routes;
