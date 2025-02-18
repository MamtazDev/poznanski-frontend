import React, { useEffect, useState, useRef } from 'react';
import avatar from "../../assets/png/profileImage2.png";
import Layout from '../../Components/Layout';
import BreadCrumb from '../../Components/BreadCrumb';
import { PageBasicProps } from '../../AppMain';
import { GoDotFill } from "react-icons/go";
import CommonTitleText from '../../Components/CommonTitleText/CommonTitleText';
import useSWR from 'swr';
import Event from './Event';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoLocationOutline } from 'react-icons/io5';
import { BsCalendar2Date } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { openPlayer } from '../../reducers/PlayerReducer';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
interface Product {
  _id: string;
  songs: any;
  id: string;
  title: string;
  img: string;
  tags: string;
  date: string;
  link: string;
  location: string;
  youTube: string;
  artist: string;
  star: number;
}

const ArtistDetailsPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<any>(null);
  const [radios, setRadios] = useState<Product[]>([]); // FIXED TYPE ERROR
  const [albums, setAlbums] = useState<Product[]>([]);
  const [newsVideos, setNewsVideos] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleClick = (id: string) => {
     navigate(`/radio/${id}`);
   };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };


  const getYouTubeID = (url: string) => {
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    return videoId;
  };

  const handlePlay = (youTube: string) => {
    const videoId = getYouTubeID(youTube);
    if (videoId) {
      dispatch(openPlayer(videoId));
    } else {
      console.error("Invalid YouTube URL:", youTube);
    }
  };

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");
    return response.json();
  };
  const { data, error } = useSWR(
    id ? `http://localhost:8000/api/artist/${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      // console.log("Fetched data:", data);
      setArtist(data.artist || null);
      setRadios(Array.isArray(data.radios) ? data.radios : []);
      setAlbums(Array.isArray(data.album) ? data.album : []);
      setNewsVideos(Array.isArray(data.newsVideos) ? data.newsVideos : []);
      setMaterials(Array.isArray(data.materials) ? data.materials : []);
      setLoading(false);
    }
  }, [data]);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

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
  if (error) return <div>Error loading data.</div>;

  return (
    <div className='mt-5'>
      <Layout themeMode={themeMode} type={type}>
        <div className="flex justify-center">
          <div className="container">
            {!type && <BreadCrumb />}
            <div className='flex gap-4 items-center md:mt-5 mt-3'>
              <img src={artist?.profileImg || avatar} className='w-[100px] h-[100px] rounded-full' alt='img' />
              <div>
                <h2 className="lg:text-5xl text-3xl font-bold" style={{ color: themeMode ? "#252733" : "#FFF" }}>
                  {artist?.name || "Unknown Artist"}
                </h2>
                <p className='flex gap-1 items-center font-medium' style={{ color: themeMode ? "#252733" : "#BBBCC0" }}>
                  Singer
                  {/* <span className='flex gap-2 items-center'>
                    <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9" }} /> 125 Songs
                  </span> */}
                </p>
              </div>
            </div>
            {/* Details */}
            <div className='lg:mt-12 mt-6'>
              <h2 className='text-xl font-semibold' style={{ color: themeMode ? "#252733" : "#FFF" }}>Details</h2>
              <div className='p-6 rounded-2xl shadow-lg mt-6' style={{ backgroundColor: themeMode ? "#FFF" : "#242526" }}>
                <p style={{ color: themeMode ? "#6D6E76" : "#BBBCC0" }}>
                  {showFullDescription ? artist?.description : artist?.description?.split(' ').slice(0, 50).join(' ') + '...'}
                </p>
                {artist?.description?.split(' ').length > 50 && (
                  <button
                    className='mt-4 font-bold'
                    style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}
                    onClick={toggleDescription}
                  >
                    {showFullDescription ? 'View Less' : 'View More'}
                  </button>
                )}
              </div>
            </div>
            {albums?.length>0&&(
              <CommonTitleText
              data={albums.map(album => ({
                id: album._id || "",
                title: album.title,
                location: album.location,
                tags: album.tags,
                date: album.date,
                songs: album.songs
              }))}
              headTitle="Albums"
            />
        ) }

            {/* Radios Section */}
            {radios?.length > 0 && (
              <div className="lg:mt-12 mt-6 relative">
                <h2 className="text-xl font-semibold" style={{ color: themeMode ? "#252733" : "#FFF" }}>
                  Tv/Radio
                </h2>

                {/* Swiper Carousel */}
                <div className="w-full lg:mt-10 mt-5 relative">
                  <Swiper
                    onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                    slidesPerView={4}
                    spaceBetween={30}
                    loop={true}
                    breakpoints={{
                      1440: { slidesPerView: 4 },
                      1024: { slidesPerView: 3 },
                      768: { slidesPerView: 2 },
                      425: { slidesPerView: 1 },
                      375: { slidesPerView: 1 },
                    }}
                  >
                    {radios?.map((radio) => (
                      <SwiperSlide key={radio.id}>
                        <div className='p-5 rounded-3xl'
                          style={{
                            backgroundColor: themeMode ? "#FFF" : "#242526",
                            color: themeMode ? "black" : "#fff",
                            borderRadius: "25px",
                            border: `2px solid ${themeMode ? "#f8f8ff" : "#242526"}`
                          }}>
                          <div
                            className={`relative bg-gray-100 cursor-pointer h-48 rounded-md overflow-hidden ${!themeMode && "dark-bg-color"
                              }`}
                            onClick={() => handlePlay(radio.youTube)}
                          >
                            {/* YouTube Thumbnail */}
                            <img
                              src={radio.youTube ? `https://img.youtube.com/vi/${getYouTubeID(radio.youTube)}/hqdefault.jpg` : "default-thumbnail.jpg"}
                              className="w-full h-full object-cover"
                              alt="YouTube Thumbnail"
                            />
                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              {themeMode ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="58"
                                  height="57"
                                  viewBox="0 0 58 57"
                                  fill="none"
                                >
                                  <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                                  <path
                                    d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z"
                                    fill="white"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="55"
                                  height="55"
                                  viewBox="0 0 55 55"
                                  fill="none"
                                >
                                  <circle cx="27.5" cy="27.5" r="27.5" fill="#2FC4B2" />
                                  <path
                                    d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z"
                                    fill="#111217"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          {
                            radio.tags && <>
                            </>
                          }
                          <button className='py-1 px-5 text-center rounded-full font-semibold mt-4'
                            style={{
                              backgroundColor: themeMode ? "#E8ECFE" : "#3BD6C6",
                              color: themeMode ? "#5A1073" : "#5A1073"
                            }}>{radio.tags}</button>
                          {
                            radio.title && <>
                              <p className='mt-2 text-lg font-semibold' >{radio.title}</p>
                            </>
                          }

                          <div className='space-y-2'>
                            {
                              radio.location && <>
                                <p className='flex gap-1 items-center' style={{
                                  color: themeMode ? "#9B9CA1" : "#9B9CA1"
                                }}><IoLocationOutline /> {radio.location}</p>
                                <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9", }} />
                              </>
                            }
                            {radio.date && <>
                              <p className='flex gap-1 items-center' style={{
                                color: themeMode ? "#9B9CA1" : "#9B9CA1"
                              }}><BsCalendar2Date />{radio.date}</p>
                            </>}
                            {radio && <>
                              <button onClick={() => handleClick(radio._id)} className='flex gap-1 items-center'style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}>view details</button>
                            </>}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <div className="absolute top-1/2 left-[-40px] transform -translate-y-1/2 z-10">
                    <button onClick={handlePrev} className="swiper-button-prev">
                      <IoIosArrowBack className="text-3xl text-gray-600 hover:text-black" />
                    </button>
                  </div>

                  <div className="absolute top-1/2 right-[-40px] transform -translate-y-1/2 z-10">
                    <button onClick={handleNext} className="swiper-button-next">
                      <IoIosArrowForward className="text-3xl text-gray-600 hover:text-black" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <>
              {/* {
              newsVideos.length>0 &&(
                <div className="mt-12 relative">
                <h2 className="text-xl font-semibold" style={{ color: themeMode ? "#252733" : "#FFF" }}>
                  Tv/Radio
                </h2>


                <div className="w-full mt-10 relative">
                  <Swiper
                    onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                    slidesPerView={4}
                    spaceBetween={30}
                    loop={true}
                    breakpoints={{
                      1440: { slidesPerView: 4 },
                      1024: { slidesPerView: 3 },
                      768: { slidesPerView: 2 },
                      425: { slidesPerView: 1 },
                      375: { slidesPerView: 1 },
                    }}
                  >
                    {newsVideos.map((newsVideos,index) => (
                      <SwiperSlide key={index}>

                        <div className='p-5 rounded-3xl mt-6'
                          style={{
                            backgroundColor: themeMode ? "#FFF" : "#242526",
                            color: themeMode ? "black" : "#fff",
                            borderRadius: "25px",
                            border: `2px solid ${themeMode ? "#f8f8ff" : "#242526"}`
                          }}>
                          <div
                            className={`relative bg-gray-100 cursor-pointer h-48 rounded-md overflow-hidden ${!themeMode && "dark-bg-color"
                              }`}
                            onClick={() => handlePlay(newsVideos.youTube)}
                          >

                            <img
                              src={newsVideos.youTube ? `https://img.youtube.com/vi/${getYouTubeID(newsVideos.youTube)}/hqdefault.jpg` : "default-thumbnail.jpg"}
                              className="w-full h-full object-cover"
                              alt="YouTube Thumbnail"
                            />

                            <div className="absolute inset-0 flex items-center justify-center">
                              {themeMode ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="58"
                                  height="57"
                                  viewBox="0 0 58 57"
                                  fill="none"
                                >
                                  <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                                  <path
                                    d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z"
                                    fill="white"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="55"
                                  height="55"
                                  viewBox="0 0 55 55"
                                  fill="none"
                                >
                                  <circle cx="27.5" cy="27.5" r="27.5" fill="#2FC4B2" />
                                  <path
                                    d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z"
                                    fill="#111217"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          {
                            newsVideos.tags && <>
                            </>
                          }
                          <button className='py-1 px-5 text-center rounded-full font-semibold mt-4'
                            style={{
                              backgroundColor: themeMode ? "#E8ECFE" : "#3BD6C6",
                              color: themeMode ? "#5A1073" : "#5A1073"
                            }}>{newsVideos.tags}</button>
                          {
                            newsVideos.title && <>
                              <p className='mt-2 text-lg font-semibold' >{newsVideos.title}</p>
                            </>
                          }

                          <div className='space-y-2'>
                            {
                              newsVideos.location && <>
                                <p className='flex gap-1 items-center' style={{
                                  color: themeMode ? "#9B9CA1" : "#9B9CA1"
                                }}><IoLocationOutline /> {newsVideos.location}</p>
                                <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9", }} />
                              </>
                            }
                            {newsVideos.date && <>
                              <p className='flex gap-1 items-center' style={{
                                color: themeMode ? "#9B9CA1" : "#9B9CA1"
                              }}><BsCalendar2Date />{newsVideos.date}</p>
                            </>}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>


                  <div className="absolute top-1/2 left-[-40px] transform -translate-y-1/2 z-10">
                    <button onClick={handlePrev} className="swiper-button-prev">
                      <IoIosArrowBack className="text-3xl text-gray-600 hover:text-black" />
                    </button>
                  </div>

                  <div className="absolute top-1/2 right-[-40px] transform -translate-y-1/2 z-10">
                    <button onClick={handleNext} className="swiper-button-next">
                      <IoIosArrowForward className="text-3xl text-gray-600 hover:text-black" />
                    </button>
                  </div>
                </div>
              </div>
              )
            } */}
            </>
            <Event themeMode={themeMode} type={type} />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ArtistDetailsPage;