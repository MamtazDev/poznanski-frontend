import { Spinner } from "@chakra-ui/react";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import NavBar from "../Components/Layout/NavBar";
import ScrollToTopOnPageChange from "../Components/ScrollToTop";
import YoutubePlayer from "../Components/YoutubePlayer";
import { checkIfLoggedIn } from "../Constant/api-requests";
import * as common from "../Constant/constants";
import ProfilePage from "../Pages/Profile/profile";
import { RootState } from "../reducers";
import { setType } from "../reducers/ThemeReducer";
import { logout } from "../reducers/user";
import { deleteCookie, getCookie, parseJwt } from "../utils/auth";
import TopArtist from "../Pages/TopArtist";
import ArtistDetailsPage from "../Pages/Artist/ArtistDetailsPage";
import TvRadioDetails from "../Pages/Video/TvRadioDetails";
import MaterialsDetails from "../Pages/Material/MaterialsDetails";
import VerifyEmail from "../Pages/Login/VerifyEmail";
import ResetPassword from "../Pages/Login/ResetPass";

const Home = lazy(() => import("../Pages/Home"));
const SubmitPage = lazy(() => import("../Pages/Submit"));
const VideoMainPage = lazy(() => import("../Pages/Video"));
const ConcertMainPage = lazy(() => import("../Pages/Concert"));
const ArticleMainPage = lazy(() => import("../Pages/Article"));
const ArtistMainPage = lazy(() => import("../Pages/Artist"));
const MaterialMainPage = lazy(() => import("../Pages/Material"));
const AlbumsMainPage = lazy(() => import("../Pages/Albums/index"));
const SearchMainPage = lazy(() => import("../Pages/Search"));

const ArticleDetailPage = lazy(
  () => import("../Pages/Article/articleDetailPage")
);
const LoginPage = lazy(() => import("../Pages/Login/index"));
const SubmitConfirmation = lazy(
  () => import("../Pages/SubmitConfirmation/index")
);

interface Tag {
  _id: string;
  name: string;
}

export interface PageBasicProps {
  themeMode: boolean;
  type: boolean;
}

const AppMain: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const playerOpen = useSelector((state: RootState) => state.player.isOpen);
  const videoId = useSelector((state: RootState) => state.player.videoId);
  const user = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState<boolean>(playerOpen);
  const [type, setPropsType] = useState<boolean>(false);
  const dispatch = useDispatch();
  const handleLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    dispatch(logout());
  };

  const checkIfAuth = async () => {
    try {
      await checkIfLoggedIn();
    } catch (error) {
      const accessToken = getCookie("accessToken");
      if (accessToken) {
        const decoded = parseJwt(accessToken);
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
        }
      } else {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    setIsOpen(playerOpen);
  }, [playerOpen]);

  useEffect(() => {
    if (user.isLoggedIn) {
      checkIfAuth();
    }
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setType(true));
        setPropsType(true);
      } else {
        dispatch(setType(false));
        setPropsType(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={` ${!themeMode && "back-dark"}`}>
      <NavBar themeMode={themeMode} type={type} />
      <Suspense
        fallback={
          <div className="w-screen h-screen flex justify-center items-center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="lg"
            />
          </div>
        }
      >
        <ScrollToTopOnPageChange />
        <Routes>
          <Route
            path="/"
            element={<Home themeMode={themeMode} type={type} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage themeMode={themeMode} />}
          />

          <Route path={common.NEWS_PATH}>
            <Route
              path=""
              element={<ArticleMainPage themeMode={themeMode} type={type} />}
            />
            <Route
              path=":id"
              element={<ArticleDetailPage themeMode={themeMode} type={type} />}
            />
          </Route>
          {/* top-artist */}
          <Route
            path={common.TOP_ARTIST_PATH}
            element={<TopArtist themeMode={themeMode} type={type} />}
          />

          {/* <Route
            path={common.MATERIAL_PATH}
            element={<MaterialMainPage themeMode={themeMode} type={type} />}
          /> */}

          <Route path={common.MATERIAL_PATH}>
            <Route
              path=""
              element={<MaterialMainPage themeMode={themeMode} type={type} />}
            />
            <Route
              path=":id"
              element={<MaterialsDetails themeMode={themeMode} type={type} />}
            />
          </Route>

          <Route
            path={common.CONCERT_PATH}
            element={<ConcertMainPage themeMode={themeMode} type={type} />}
          />

          <Route path={common.NEWRELEASE_PATH}>
            <Route
              path=""
              element={<AlbumsMainPage themeMode={themeMode} type={type} />}
            />
            <Route
              path=":id"
              element={<TopArtist themeMode={themeMode} type={type} />}
            />
          </Route>

          {/* radios  */}
          <Route path={common.TV_RADIO_PATH}>
            <Route
              path=""
              element={<VideoMainPage themeMode={themeMode} type={type} />}
            />
            <Route
              path=":id"
              element={<TvRadioDetails themeMode={themeMode} type={type} />}
            />
          </Route>

          <Route path={common.ARTISTS_PATH}>
            <Route
              path=""
              element={<ArtistMainPage themeMode={themeMode} type={type} />}
            />
            <Route
              path=":id"
              element={<ArtistDetailsPage themeMode={themeMode} type={type} />}
            />
          </Route>

          <Route
            path={common.CREATE_NEWS}
            element={<SubmitPage themeMode={themeMode} type={type} />}
          />
          <Route
            path={common.SEARCH_PATH}
            element={<SearchMainPage themeMode={themeMode} type={type} />}
          />

          <Route
            path={common.LOGIN_PATH}
            element={<LoginPage themeMode={themeMode} type={type} />}
          >
            <Route
              path=""
              element={<LoginPage themeMode={themeMode} type={type} />}
            />
          </Route>

          <Route path={common.VERIFY_EMAIL} element={<VerifyEmail />} />

          <Route path={common.RESET_PASS} element={<ResetPassword />} />

          <Route path={common.VERIFY_PATH} element={<SubmitConfirmation />} />
        </Routes>
      </Suspense>
      <YoutubePlayer type={type} isOpen={isOpen} videoId={videoId} />
    </div>
  );
};

export default AppMain;
