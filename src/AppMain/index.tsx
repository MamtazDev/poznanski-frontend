import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { apiGetReq } from "../Constant/api-functions";
import { Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { closePlayer } from "../reducers/PlayerReducer";
import * as common from "../Constant/constants";
import ScrollToTopOnPageChange from "../Components/ScrollToTop";
import YoutubePlayer from "../Components/YoutubePlayer";
import Modal from "../Components/Modals";
import { useDispatch } from "react-redux";

const Home = lazy(() => import("../Pages/Home"));
const SubmitPage = lazy(() => import("../Pages/Submit"));
const VideoMainPage = lazy(() => import("../Pages/Video"));
const ConcertMainPage = lazy(() => import("../Pages/Concert"));
const ArticleMainPage = lazy(() => import("../Pages/Article"));
const ArtistMainPage = lazy(() => import("../Pages/Artist"));
const MaterialMainPage = lazy(() => import("../Pages/Material"));
const AlbumsMainPage = lazy(() => import("../Pages/Albums/index"));
const ArticleDetailPage = lazy(
  () => import("../Pages/Article/articleDetailPage")
);

interface Tag {
  _id: string;
  name: string;
}

const AppMain: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const playerOpen = useSelector((state: RootState) => state.player.isOpen);
  const selectedLink = useSelector((state: RootState) => state.player.link);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(playerOpen);

  useEffect(() => {
    setIsOpen(playerOpen);
  }, [playerOpen]);

  useEffect(() => {
    apiGetReq("/tag", {}).then((res) => {
      setTags(res.tags);
    });
  }, []);

  const onClose = () => {
    // setIsOpen(false);
    dispatch(closePlayer());
  };

  return (
    <div className={` ${!themeMode && "back-dark"}`}>
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
          <Route path="/" element={<Home />} />
          <Route path={common.NEWS_PATH}>
            <Route path="" element={<ArticleMainPage />} />
            <Route path=":id" element={<ArticleDetailPage tagData={tags} />} />
          </Route>
          <Route path={common.TV_RADIO_PATH} element={<VideoMainPage />} />
          <Route path={common.MATERIAL_PATH} element={<MaterialMainPage />} />
          <Route path={common.CONCERT_PATH} element={<ConcertMainPage />} />
          <Route path={common.NEWRELEASE_PATH} element={<AlbumsMainPage />} />
          <Route path={common.ARTISTS_PATH} element={<ArtistMainPage />} />
          <Route path={common.CREATE_NEWS} element={<SubmitPage />} />
        </Routes>
      </Suspense>
      <Modal isOpen={isOpen} onClose={onClose}>
        <YoutubePlayer link={selectedLink} />
      </Modal>
    </div>
  );
};

export default AppMain;
