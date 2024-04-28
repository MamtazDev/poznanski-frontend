import React, { Fragment, useRef, useState } from "react";
import NavBar from "../../Components/Layout/NavBar";
import MainBack from "../../Components/MainBack";
import NewsContent from "./NewsContent";
import TV from "./TV";
import Book from "./Book";
import MaterialContent from "./MaterialContent";
import NewReleases from "./NewReleases";
import Artists from "./Artists";
import Subscription from "../../Components/Subscription";
import MarkCarousel from "../../Components/MarkCarousel";
import Logo_2 from "../../assets/png/wujo-2.png";
import "./style.css";
import Footer from "../../Components/Layout/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

const Home: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const pageBottomRef = useRef<HTMLDivElement>(null);
  const [filterText, setFilterText] = useState<string>("");
  const scrollToBottom = () => {
    if (pageBottomRef.current) {
      pageBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Fragment>
      <div className={`${!themeMode && "back-dark"} overflow-hidden`}>
        <NavBar filterText={filterText} setFilterText={setFilterText} />
        <div>
          <MainBack scrollToBottom={scrollToBottom} />
        </div>
        <div ref={pageBottomRef} />
        <NewsContent filterText={filterText} />
        <TV filter={filterText} />
        <div className="middle-back md:mt-28 mt-12 flex justify-center items-center">
          <div className="md:h-40 h-20">
            <img src={Logo_2} className="h-full w-full" alt="logo-2" />
          </div>
        </div>
        <Book filter={filterText} />
        <MaterialContent filter={filterText} />
        <NewReleases filter={filterText} />
        <Artists filter={filterText} />
        <Subscription />
        <MarkCarousel />
        <Footer />
      </div>
    </Fragment>
  );
};

export default Home;
