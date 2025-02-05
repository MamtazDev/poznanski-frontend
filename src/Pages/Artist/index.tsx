import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import PaginationBar from "../../Components/PaginationBar";
import { fileUrl } from "../../Constant/config";
import ArtistsCarousel from "../Home/Artists/Carousel";
import "../mainPageStyle.css";
import { useNavigate } from "react-router-dom";

interface ArtistsData {
  id: string;
  _id?: string;
  name: string;
  img: string;
  description: string;
  products: [{
    title: string,
    location: string;
    date: string;
    category: string;
    img: string;
  }];
}

interface InputArtistsData {
  _id: string;
  name: string;
  profileImg: string;
  description: string;
}

interface Products {
  id: string;
  _id: string;
  title: string;
  img: string;
  date: string;
  category: string;
  location: string;
}

// interface InputProducts {
//   _id: string;
//   title: string;
//   img: string;
//   date: Date;
//   category: string;
//   location: string;
// }

const ArtistMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const navigate = useNavigate();
  const [cardNum, setCardNum] = useState<number>(4);
  const [state, setState] = useState<boolean>(false);
  const [artists, setArtists] = useState<ArtistsData[]>([]);
  // const [artist, setArtist] = useState<ArtistsData>({
  //   id: "",
  //   name: "",
  //   img: "",
  //   description: "",
  //   products:[{title: "",
  //     location: "",
  //     date: "",
  //     category: "",
  //     img: "",
  //   }]
  // });
  // const [cardData, setCardData] = useState<Products[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const [filterText, setFilterText] = useState<string>("");
  const [lineNum, setLineNum] = useState<number>(3);
  const [filterCardNum, setFilterCardNum] = useState<number>(4);
  const [filters, setFilters] = useState({
    sort: "A to Z",
    limit: 7,
    startDate: "",
    endDate: "",
    order: "desc"
  });


  useEffect(() => {
    console.log("hover:", hoveredCard);
  }, [hoveredCard]);



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

  // useEffect(() => {
  //   setLoading(true);
  //   apiGetReq("/artist/data", {
  //     rowsPerPage: filterText ? lineNum * filterCardNum : lineNum,
  //     curPage: selectedPage,
  //     filter: filterText,
  //   })
  //     .then((res) => {
  //       const newData: ArtistsData[] = res.products.map((item: InputArtistsData) => ({
  //         id: item._id,
  //         name: item.name,
  //         img: fileUrl + item.profileImg,
  //         description: item.description,
  //       }));

  //       const totalPages = Math.ceil(res.all / lineNum);
  //       setPages(totalPages);
  //       setArtists(newData);
  //       setLoading(false);
  //     })
  //     .catch(() => setLoading(false));
  // }, [selectedPage, filterText, filterCardNum, lineNum]);

  // useEffect(() => {
  //   apiGetReq("/artist/top", {}).then((res) => {
  //     setArtist({
  //       id: res.artist[0]._id,
  //       name: res.artist[0].name,
  //       img: fileUrl + res.artist[0].profileImg,
  //       description: res.artist[0].description,
  //     });

  //     const newData: Products[] = res.products.map((item: InputProducts) => {
  //       const inputDate = new Date(item.date);
  //       const formattedDate = `${inputDate.getDate()}/${
  //         inputDate.getMonth() + 1
  //       }/${inputDate.getFullYear()}`;

  //       return {
  //         id: item._id,
  //         title: item.title,
  //         category: item.category,
  //         date: formattedDate,
  //         location: item.location,
  //         img: fileUrl + item.img,
  //       };
  //     });

  //     setCardData(newData);
  //   });
  // }, []);

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
          description: item.artist.description,
          products: item.products
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
      artist.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleClick = (id: string) => {
    navigate(`/artist/${id}`);
  };


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
            <FilterInput type={type} filterText={filterText} setFilterText={setFilterText} setFilters={setFilters} filters={filters} />
          </div>
          {/* id wise data add here */}
          {
            filteredArtists.map((artist, _idx_) => (
              <div
                id={artist._id}

                className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3 md:mt-20 mt-6">
                <div
                  className={`p-5 ${hoveredCard === `${_idx_}` && (themeMode ? "artists-body" : "artists-body-dark")}`}
                  style={{
                    borderRadius: "20px",
                    transition: "1s ease-in-out",
                  }}
                  onMouseEnter={() => setHoveredCard(`${_idx_}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-start w-full">
                    <div className="md:block hidden" onClick={() => handleClick(artist.id)}>
                      <Avatar size={window.innerWidth < 768 ? "lg" : "2xl"} src={artist.img} />
                    </div>
                    <div className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
                      <div
                        className={`artist-name md:text-xl text-md ${!themeMode && "title-dark-color"}`}
                      >
                        {artist.name}
                      </div>
                      <div className="artist-description ">
                        {artist.description}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`md:pr-16 transition-all ease-in-out ${hoveredCard === _idx_.toString() ? "h-72" : "h-0 overflow-hidden"}`}
                  >
                    {artist.products.length > 0 && <ArtistsCarousel cardNum={cardNum} cardData={artist.products} />}
                  </div>
                </div>
              </div>
            ))
          }
          <div className="mt-8">
            <PaginationBar selectedPage={selectedPage} setSelectedPage={setSelectedPage} pages={pages} entriesPerPage={0} setEntriesPerPage={function (value: React.SetStateAction<number>): void {
              throw new Error("Function not implemented.");
            }} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtistMainPage;
