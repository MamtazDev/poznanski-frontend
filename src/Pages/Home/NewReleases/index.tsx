import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import ReleaseCarousel from "./Carousel";
import { apiGetReq } from "../../../Constant/api-functions";
import { fileUrl } from "../../../Constant/config";
import { useNavigate } from "react-router-dom";
import "./style.css";
import NewReleaseCard from "../../../Components/Card/NewReleaseCard";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";

interface NewReleaseData {
  id: string;
  title: string;
  feature: string;
  img: string;
  date: string;
  link: string;
}

interface inputData {
  _id: string;
  title: string;
  artist: string;
  img: string;
  date: Date;
  link: string;
}
interface Product {
  artists: any;
  _id: any;
  id: string;
  title: string;
  img: string;
  category: string;
  date: string; // Ensure date is a valid ISO string
  link: string;
  location: string;
  artist: string;
  star: number;
}

const NewReleases: React.FC<{ filter: string }> = ({ filter }) => {
  const [cardNum, setCardNum] = useState<number>(4);
  const [cardData, setCardData] = useState<NewReleaseData[]>([]);
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  // useEffect(() => {
  //   apiGetReq("/product/new", { filter }).then((res) => {
  //     let newData: NewReleaseData[] = [];
  //     res.newProducts.map((item: inputData) => {
  //       const inputDate: Date = new Date(item.date);
  //       const formattedDate =
  //         inputDate.getDate() +
  //         "/" +
  //         (inputDate.getMonth() + 1) +
  //         "/" +
  //         inputDate.getFullYear();
  //       const temp: NewReleaseData = {
  //         id: item._id,
  //         title: item.artist,
  //         feature: item.title,
  //         img: fileUrl + item.img,
  //         date: formattedDate,
  //         link: item.link,
  //       };
  //       newData.push(temp);
  //     });
  //     setCardData(newData);
  //   });
  // }, [filter]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCardNum(3);
        if (window.innerWidth < 768) setCardNum(1);
      } else {
        setCardNum(4);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);



  const fetcher = () =>
    fetch(`http://localhost:8000/api/album`).then((res) => res.json());

  const { data, error } = useSWR(`http://localhost:8000/api/album`, fetcher);

 useEffect(() => {
    if (data) {
      // Sort albums by date (latest first) and select the latest 3
      const sortedAlbums = data.albums
        .sort((a: Product, b: Product) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);
      setAlbum(sortedAlbums);
      setLoading(false);
    }
  }, [data]);

  if (error) return <div>Error loading data.</div>;
  if (loading) return <div className="flex justify-center items-center h-screen w-full"
  style={{
    backgroundColor: themeMode ? "white" : "black"
  }}>
  <p className="text-xl font-semibold " style={{
    color: themeMode ? "black" : "white"
  }} >Loading...</p>
  <div className="w-6 h-6 ml-2 border-4 border-t-transparent rounded-full animate-spin"
    style={{
      borderRightColor: themeMode ? "#5A1073" : "#2FC4B2",
      borderBottomColor: themeMode ? "#5A1073" : "#2FC4B2",
      borderLeftColor: themeMode ? "#5A1073" : "#2FC4B2",
    }}>
  </div>
</div>;

  return (
    <div className="flex justify-center">
      <div className="container md:mt-36 md:pt-1.5 mt-20">
        <div className="flex justify-between">
          <ContentTitle titleType="NEW RELEASE" title="New Releases For You" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Release"
                btnType="web"
                onClick={() => navigate("/releases")}
              />
            </div>
          </div>
        </div>
        {/* <ReleaseCarousel cardNum={cardNum} cardData={cardData} /> */}
        <div className={`grid md:grid-cols-4 grid-cols-1 gap-5 mt-10 mb-10`}>
                {album.length > 0 ? (
                  album.map((categoryItem) => (
                    <NewReleaseCard
                      id={categoryItem._id}
                      key={categoryItem._id}
                      data={{ songs: [] }}
                      youTube="https://www.youtube.com/embed/6JYIGclVQdw"
                      title={categoryItem.title}
                      nickname={categoryItem.artists[0]?.name}

                      date={categoryItem.date}
                      link={categoryItem.link}
                      btn="See Details"
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500">No results found</div>
                )}
              </div>
      </div>
    </div>
  )
};

export default NewReleases;
