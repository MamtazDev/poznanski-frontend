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
import avatar from "../../../assets/png/profileImage2.png";

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

// interface ArtistsData {
//   name: any;
//   description: any;
//   profileImg: any;
//   _id: string | undefined;
//   id(id: any): void;
//   artist: ArtistData;
//   products: Product[];
// }
interface inputArtistsData {
  artist: ArtistData;
  products: Product[];
}

interface ArtistsData {
  id: string;
  _id?: string;
  name: string;
  img: string;
  profileImg: any;
  description: string;
  products: [
    {
      title: string;
      location: string;
      date: string;
      category: string;
      img: string;
      profileImg: string;
    },
  ];
}
const Artists: React.FC<{ filter: string }> = ({ filter }) => {
  const [cardNum, setCardNum] = useState<number>(4);
  const [state, setState] = useState<boolean>(false);
  const [artists, setArtists] = useState<ArtistsData[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number | null>(3);
  const [curPage, setCurPage] = useState(1);
  const [all, setAll] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [filterText, setFilterText] = useState<string>("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();
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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/artist");
        const jsonData = await response.json();

        console.log("Fetched Data:", jsonData);

        const newArtists = jsonData.data.map((item: any) => ({
          id: item.artist._id,
          name: item.artist.name,
          img: fileUrl + item.artist.profileImg,
          profileImg: item.artist.profileImg,
          description: item.artist.description,
          products: item.products,
        }));

        console.log("Formatted Artists Data:", newArtists);

        setArtists(newArtists);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(filterText.toLowerCase()) ||
      artist.description.toLowerCase().includes(filterText.toLowerCase()) ||
      artist.profileImg
  );

  const handleClick = (id: string) => {
    navigate(`/artist/${id}`);
  };

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

        {filteredArtists.map((artist, _idx_) => (
          <div
            key={_idx_}
            id={artist._id}
            className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3 md:mt-8 mt-6 shadow-md rounded-2xl"
            style={{
              backgroundColor: themeMode ? "" : "#242526",
            }}>
            <div
              className={`p-5 rounded-2xl ${hoveredCard === `${_idx_}` && (themeMode ? "artists-body" : "artists-body-dark")}`}
              style={{
                transition: "0.5s ease-in-out",
              }}
              onMouseEnter={() => setHoveredCard(`${_idx_}`)}
              onMouseLeave={() => setHoveredCard(null)}>
              <div className="flex items-start w-full">
                <div className="" onClick={() => handleClick(artist.id)}>
                  <Avatar
                    src={artist?.profileImg || avatar}
                    className="md:w-[118px] w-[80px]  md:h-[80px]  h-[50px] rounded-full"
                    size={{ base: "xl", md: "2xl", lg: "3xl" }}
                    width={118}
                    height={118}
                  />
                </div>
                <div className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
                  <div
                    className={`artist-name md:text-xl text-md capitalize ${!themeMode && "title-dark-color"}`}>
                    {artist.name}
                  </div>
                  <div className="artist-description ">
                    {artist.description}
                  </div>
                </div>
              </div>
              {artist.products.length > 0 && (
                <div
                  className={`md:pr-16 transition-all ease-in-out ${hoveredCard === _idx_.toString() ? "md:h-[350px] h-72" : "h-0 overflow-hidden"}`}>
                  {
                    <ArtistsCarousel
                      cardNum={cardNum}
                      cardData={artist.products}
                    />
                  }
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artists;
