import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { PageBasicProps } from "../../AppMain";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import FilterInput from "../../Components/FilterInput";
import Layout from "../../Components/Layout";
import PaginationBar from "../../Components/PaginationBar";
import { apiBaseUrl, fileUrl } from "../../Constant/config";
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

interface filterProperties{
  sort: string,
  quantity: number,
    startDate: string,
    endDate: string,
    order: string,
    search: string | undefined
  }


const ArtistMainPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const navigate = useNavigate();
  const [cardNum, setCardNum] = useState<number>(4);
  const [state, setState] = useState<boolean>(false);
  const [artists, setArtists] = useState<ArtistsData[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const [filterText, setFilterText] = useState<string>("");
  const [lineNum, setLineNum] = useState<number>(3);
  const [filterCardNum, setFilterCardNum] = useState<number>(4);

   const [filters, setFilters] = useState<filterProperties>({
     sort: "A to Z",
     quantity: 5,
     startDate: "",
     endDate: "",
     order: "desc",
     search: ""
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
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch("http://localhost:8000/api/artist");
  //       const jsonData = await response.json();

  //       console.log("Fetched Data:", jsonData);

  //       const newArtists = jsonData.data.map((item: any) => ({
  //         id: item.artist._id,
  //         name: item.artist.name,
  //         img: fileUrl + item.artist.profileImg,
  //         description: item.artist.description,
  //         products: item.products
  //       }));

  //       console.log("Formatted Artists Data:", newArtists);

  //       setArtists(newArtists);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const fetchData = async (inputValue?: filterProperties) => {
    setLoading(true);
    console.log("inputValue.search", inputValue);
  
    let url = `${apiBaseUrl}/artist`;
    let searchQuery = [];
  
    if (inputValue?.search) {
      searchQuery.push(`search=${encodeURIComponent(inputValue.search)}`);
    }
  
    if (inputValue?.sort) {
      searchQuery.push(`order=${encodeURIComponent(inputValue.sort)}`);
    }
  
    if (inputValue?.quantity) {
      console.log("inputValue?.limit", inputValue?.quantity);
      searchQuery.push(`limit=${inputValue.quantity}`);
    }
  
    if (inputValue?.startDate) {
      searchQuery.push(`startDate=${encodeURIComponent(inputValue.startDate)}`);
    }
  
    if (inputValue?.endDate) {
      searchQuery.push(`endDate=${encodeURIComponent(inputValue.endDate)}`);
    }
  
    if (searchQuery.length > 0) {
      url = `${url}?${searchQuery.join("&")}`;
    }
  
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
  
      console.log("Fetched Data:", jsonData);
  
      const newArtists = jsonData.data.map((item: any) => ({
        id: item.artist._id,
        name: item.artist.name,
        img: fileUrl + item.artist.profileImg,
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
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (inputValue: string) => {
    console.log("Searched value: ", inputValue);
    console.log("Filters value: ", filters);
    fetchData(filters);
  };

  useEffect(() => {
    console.log("Filtered worked");
    fetchData(filters);
  }, [filters]);


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
            <FilterInput type={type} handler={handleSearch} filterText={filterText} setFilterText={setFilterText} setFilters={setFilters} filters={filters} />
          </div>
          {/* id wise data add here */}
          {
            artists.map((artist, _idx_) => (
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
        </div>
      </div>
    </Layout>
  );
};

export default ArtistMainPage;
