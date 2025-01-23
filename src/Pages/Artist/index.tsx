import React, { ChangeEvent, useState, useEffect } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import PaginationBar from "../../Components/PaginationBar";
import { apiGetReq } from "../../Constant/api-functions";
import Layout from "../../Components/Layout";
import { fileUrl } from "../../Constant/config";
import TVCard from "../../Components/Card/TVCard";
import { Spinner, Avatar } from "@chakra-ui/react";
import ArtistsCarousel from "../Home/Artists/Carousel";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "../mainPageStyle.css";
import { PageBasicProps } from "../../AppMain";

interface ArtistsData {
  id: string;
  name: string;
  img: string;
  description: string;
}

interface InputArtistsData {
  _id: string;
  name: string;
  profileImg: string;
  description: string;
}

interface Products {
  id: string;
  title: string;
  img: string;
  date: string;
  category: string;
  location: string;
}

interface InputProducts {
  _id: string;
  title: string;
  img: string;
  date: Date;
  category: string;
  location: string;
}

const ArtistMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const [cardNum, setCardNum] = useState<number>(4);
  const [state, setState] = useState<boolean>(false);
  const [artists, setArtists] = useState<ArtistsData[]>([]);
  const [artist, setArtist] = useState<ArtistsData>({
    id: "",
    name: "",
    img: "",
    description: "",
  });
  const [cardData, setCardData] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const [filterText, setFilterText] = useState<string>("");
  const [lineNum, setLineNum] = useState<number>(3);
  const [filterCardNum, setFilterCardNum] = useState<number>(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1350) {
        setCardNum(3);
        setFilterCardNum(4);
        setState(false);
        if (window.innerWidth < 1050) {
          setCardNum(2);
          setState(false);
          setFilterCardNum(3);
        }
        if (window.innerWidth < 768) {
          setCardNum(1);
          setFilterCardNum(2);
          setState(true);
        }
      } else {
        setFilterCardNum(4);
        setCardNum(4);
        setState(false);
      }

      if (window.innerWidth < 768) {
        setLineNum(2);
      } else {
        setLineNum(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    apiGetReq("/artist/data", {
      rowsPerPage: filterText ? lineNum * filterCardNum : lineNum,
      curPage: selectedPage,
      filter: filterText,
    })
      .then((res) => {
        const newData: ArtistsData[] = res.products.map((item: InputArtistsData) => ({
          id: item._id,
          name: item.name,
          img: fileUrl + item.profileImg,
          description: item.description,
        }));

        const totalPages = Math.ceil(res.all / lineNum);
        setPages(totalPages);
        setArtists(newData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedPage, filterText, filterCardNum, lineNum]);

  useEffect(() => {
    apiGetReq("/artist/top", {}).then((res) => {
      setArtist({
        id: res.artist[0]._id,
        name: res.artist[0].name,
        img: fileUrl + res.artist[0].profileImg,
        description: res.artist[0].description,
      });

      const newData: Products[] = res.products.map((item: InputProducts) => {
        const inputDate = new Date(item.date);
        const formattedDate = `${inputDate.getDate()}/${
          inputDate.getMonth() + 1
        }/${inputDate.getFullYear()}`;

        return {
          id: item._id,
          title: item.title,
          category: item.category,
          date: formattedDate,
          location: item.location,
          img: fileUrl + item.img,
        };
      });

      setCardData(newData);
    });
  }, []);

  return (
    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center">
        <div className="container">
          {!type && (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <div className="md:mt-7 mt-10">
            <ContentTitle titleType="TOP HITS" title="Our Top Artists" />
          </div>
          <div className="md:mt-6 mt-4">
            <FilterInput type={type} />
          </div>
          {filterText ? (
            loading ? (
              <div className="w-full flex justify-center items-center mt-8" style={{ minHeight: type ? "366px" : "448px" }}>
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" />
              </div>
            ) : (
              <div className={`grid ${filterCardNum === 4 && "grid-cols-4"} ${filterCardNum === 3 && "grid-cols-3"} ${filterCardNum === 2 && "grid-cols-2"} gap-4 py-5`}>
                {artists.map((item, idx) => (
                  <div key={`main-artist-filter-${idx}`} className="w-full">
                    <Avatar src={item.img} />
                    <div className={`md:text-xl text-md ${themeMode ? "artist-filter-name" : "artist-filter-name-dark"}`} style={{ fontSize: type ? "14px" : "24px" }}>
                      {item.name}
                    </div>
                    <div className={`${themeMode ? "artist-filter-description" : "artist-filter-description-dark"}`} style={{ fontSize: type ? "12px" : "21px" }}>
                      54 Songs
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div>
              <div className={`artists-body w-full p-6 md:p-12 md:mt-20 mt-6 ${!themeMode && "artists-body-dark"}`}>
                {artist && (
                  <div className="flex items-start w-full">
                    <Avatar size={window.innerWidth < 768 ? "lg" : "2xl"} src={artist.img} />
                    <div className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
                      <div className={`artist-name md:text-xl text-md ${!themeMode && "title-dark-color"}`}>
                        {artist.name}
                      </div>
                      <div className="artist-description" style={{ fontSize: !type ? "16px" : "12px" }}>
                        {artist.description}
                      </div>
                    </div>
                  </div>
                )}
                <div className="md:pr-16">
                  {cardData.length > 0 && <ArtistsCarousel cardNum={cardNum} cardData={cardData} />}
                </div>
              </div>
            </div>
          )}
          <div className="mt-8">
            <PaginationBar selectedPage={selectedPage} setSelectedPage={setSelectedPage} pages={pages} entriesPerPage={0} setEntriesPerPage={function (value: React.SetStateAction<number>): void {
              throw new Error("Function not implemented.");
            } } />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtistMainPage;
