import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import { useNavigate, Navigate } from "react-router-dom";
import ArtistsCarousel from "./Carousel";
import VerticalCarousel from "./VerticalCarousel";
import { Avatar } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import { apiGetReq } from "../../../Constant/api-functions";
import { fileUrl } from "../../../Constant/config";
import "./style.css";

interface Product {
  _id: string;
  title: string;
  img: string;
  date: string;
  category: string;
  location: string;
  link: string;
}

interface ArtistData {
  _id: string;
  name: string;
  profileImg: string;
  description: string;
}

interface ArtistsData {
  artist: ArtistData;
  products: Product[];
}
interface inputArtistsData {
  artist: ArtistData;
  products: Product[];
}

const Artists: React.FC<{ filter: string }> = ({ filter }) => {
  const [cardNum, setCardNum] = useState<number>(4);
  const [state, setState] = useState<boolean>(false);
  const [artists, setArtists] = useState<ArtistsData[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number | null>(3);
  const [curPage, setCurPage] = useState(1);
  const [all, setAll] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setCurPage(1);
  }, [filter]);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiGetReq("/artist", { filter, rowsPerPage, curPage })
      .then((res) => {
        let newData: ArtistsData[] = [];
        if (res.all) {
          setAll(res.all);
        }
        res.data.map((item: inputArtistsData) => {
          let products: Product[] = [];
          item.products.map((i) => {
            const inputDate: Date = new Date(i.date);
            const formattedDate =
              inputDate.getDate() +
              "/" +
              (inputDate.getMonth() + 1) +
              "/" +
              inputDate.getFullYear();
            const productTemp: Product = {
              _id: i._id,
              title: i.title,
              category: i.category,
              date: formattedDate,
              location: i.location,
              img: fileUrl + i.img,
              link: i.link,
            };
            products.push(productTemp);
          });
          const temp: ArtistsData = {
            artist: {
              _id: item.artist._id,
              name: item.artist.name,
              profileImg: fileUrl + item.artist.profileImg,
              description: item.artist.description,
            },
            products: products,
          };
          newData.push(temp);
        });
        setArtists(newData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [filter, curPage, rowsPerPage]);

  useEffect(() => {
    const handleResize = () => {
      setRowsPerPage(3);
      if (window.innerWidth < 1350) {
        setCardNum(3);
        setState(false);
        if (window.innerWidth < 1050) {
          setCardNum(2);
          setState(false);
        }
        if (window.innerWidth < 768) {
          setCardNum(1);
          setState(true);
          setRowsPerPage(null);
        }
      } else {
        setCardNum(4);
        setState(false);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="flex justify-center">
      <div className="container md:mt-28 mt-12">
        <div className="flex justify-between">
          <ContentTitle titleType="ARTISTS" title="Our Artists" />
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Artists"
                btnType="web"
                onClick={() => navigate("/artists")}
              />
            </div>
          </div>
        </div>
        {artists?.length && (
          <VerticalCarousel
            state={state}
            cardNum={cardNum}
            cardData={artists}
            all={all}
            curPage={curPage}
            setCurPage={setCurPage}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Artists;
