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
import { PageBasicProps } from "../../AppMain";

const Home: React.FC<PageBasicProps> = ({type, themeMode}) => {
  const pageBottomRef = useRef<HTMLDivElement>(null);
  const [filterText, setFilterText] = useState<string>("");
  const scrollToBottom = () => {
    if (pageBottomRef.current) {
      pageBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  // mt-[${type ? '300' : '60'}px]
  console.log(type)
  return (
    <Fragment>
      <div className={`${!themeMode && "back-dark"} overflow-hidden`}>
        <NavBar themeMode={themeMode} type={type} filterText={filterText} setFilterText={setFilterText} />
        <div className={`mt-${type ? '28' : '40'}`}>
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
