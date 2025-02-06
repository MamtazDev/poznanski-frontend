// import React, { useEffect, useState } from 'react'
// import avatar from "../../assets/png/profileImage2.png"
// import Layout from '../../Components/Layout';
// import BreadCrumb from '../../Components/BreadCrumb';
// import { PageBasicProps } from '../../AppMain';
// import { GoDotFill } from "react-icons/go";
// import CommonTitleText from '../../Components/CommonTitleText/CommonTitleText';
// import useSWR from 'swr';
// import DetailButton from '../../Components/Buttons/DetailButton';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Image } from '@chakra-ui/react';
// import { Link, useParams } from 'react-router-dom';
// import { Pagination } from 'swiper/modules';
// import Event from './Event';
// interface Product {
//   id: string;
//   title: string;
//   img: string;
//   category: string;
//   date: string;
//   link: string;
//   location: string;
//   artist: string;
//   star: number;
// }
// const ArtistDetailsPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {

//   const [newsData, setNewsData] = useState<any[]>([]);
//   const [tvRadioData, settvRadioData] = useState<any[]>([]);
//   const [albumData, setAlbumData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { id } = useParams<{ id: string }>(); // Get artist ID from URL params
//   const [artist, setArtist] = useState<any>(null);
//   // const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetcher function
//   const fetcher = async (url: string) => {
//     try {
//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch artist data");
//       const data = await response.json();
//       return data;
//     } catch (err) {
//       console.error("Error fetching artist data:", err);
//       throw err;
//     }
//   };

//   // Fetch artist data using useSWR
//   const { data, error: swrError } = useSWR(
//     id ? `http://localhost:8000/api/artist/${id}` : null,
//     fetcher
//   );

//   // Update local state when data is available
//   useEffect(() => {
//     if (data) {
//       console.log("Fetched artist data:", data);
//       setArtist(data.artist);
//       setLoading(false);
//     }
//   }, [data]);



//   // Fetching news data
//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/news/all");
//         const result = await response.json();

//         if (result && Array.isArray(result.news)) {
//           setNewsData(result.news);
//         } else {
//           console.error("Unexpected API response format:", result);
//           setNewsData([]);
//         }
//       } catch (error) {
//         console.error("Error fetching news data:", error);
//         setNewsData([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNews();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch("http://localhost:8000/api/radio");
//         const data = await response.json();
//         settvRadioData(data.records);
//         console.log(data, "radio data")
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch("http://localhost:8000/api/album");
//         const data = await response.json();
//         setAlbumData(data.albums);
//         console.log(data, "radio data")
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle errors
//   useEffect(() => {
//     if (swrError) {
//       setError("Error fetching artist data.");
//       setLoading(false);
//     }
//   }, [swrError]);

//   // Loading and error handling

//   const [showFullDescription, setShowFullDescription] = useState(false);

//   // Function to toggle description view
//   const toggleDescription = () => {
//     setShowFullDescription(!showFullDescription);
//   };

//   // Get artist description
//   const description = artist?.description || '';
//   const words = description.split(' ');

//   if (loading) return <div>Loading artist details...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;



//   return (
//     <div>
//       <Layout themeMode={themeMode} type={type}>
//         <div className="flex justify-center">
//           <div className="container">
//             {!type && (
//               <div className="md:mt-12 mt-8">
//                 <BreadCrumb />
//               </div>
//             )}

//             <div className='flex gap-4 items-center mt-5'>
//               <img src={artist?.profileImg || avatar} className='w-[100px] h-[100px] rounded-full' alt='img' />
//               <div>
//                 <h2 className={` text-5xl font-bold`}
//                   style={{
//                     color: themeMode ? "#252733" : "#FFF"
//                   }}> {artist?.name || "Unknown Artist"}</h2>
//                 <p className='flex gap-1 items-center font-medium' style={{ color: themeMode ? "#252733" : "#BBBCC0", }}>Singer
//                   <span className='flex gap-2 items-center' >
//                     <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9", }} /> 125 Songs
//                   </span>
//                 </p>
//               </div>
//             </div>
//             {/* details */}
//             <div className='mt-12'>
//               <h2 className='text-xl font-semibold' style={{ color: themeMode ? "#252733" : "#FFF" }}>Details</h2>
//               <div className='p-6 rounded-2xl shadow-lg mt-6' style={{ backgroundColor: themeMode ? "#FFF" : "#242526" }}>
//                 <p style={{ color: themeMode ? "#6D6E76" : "#BBBCC0" }}>
//                   {showFullDescription ? description : words.slice(0, 50).join(' ') + (words.length > 50 ? '...' : '')}
//                 </p>
//                 {words.length > 50 && (
//                   <button
//                     className='mt-4 font-bold'
//                     style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}
//                     onClick={toggleDescription}
//                   >
//                     {showFullDescription ? 'View Less' : 'View More'}
//                   </button>
//                 )}
//               </div>
//             </div>
//             {/* news */}
//             <CommonTitleText title='News' data={newsData} />
//             <CommonTitleText title='TV/Radio' data={tvRadioData} />
//             <CommonTitleText title='Albums' data={albumData} />
//             <Event themeMode={themeMode} type={type} />
//           </div>
//         </div>
//       </Layout>
//     </div>
//   )
// }

// export default ArtistDetailsPage

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import avatar from "../../assets/png/profileImage2.png";
import Layout from '../../Components/Layout';
import BreadCrumb from '../../Components/BreadCrumb';
import CommonTitleText from '../../Components/CommonTitleText/CommonTitleText';
import DetailButton from '../../Components/Buttons/DetailButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { PageBasicProps } from '../../AppMain';
import { GoDotFill } from 'react-icons/go';

const ArtistDetailsPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<any>(null);
  const [radios, setRadios] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [newsVideos, setNewsVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data using SWR
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
      setArtist(data.artist);
      setRadios(data.radios || []);
      setAlbums(data.album || []);
      setNewsVideos(data.newsVideos || []);
      setLoading(false);
    }
  }, [data]);
  const [showFullDescription, setShowFullDescription] = useState(false);

//  Function to toggle description view
  const toggleDescription = () => {
     setShowFullDescription(!showFullDescription);
   };

  // Get artist description
   const description = artist?.description || '';
  const words = description.split(' ');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data.</div>;

  return (
    <Layout>
      {/* {!type && (
              <div className="md:mt-12 mt-8">
               <BreadCrumb />
             </div>
           )} */}
      <div className='flex gap-4 items-center mt-5'>
            <img src={artist?.profileImg || avatar} className='w-[100px] h-[100px] rounded-full' alt='img' />
             <div>
              <h2 className={` text-5xl font-bold`}
                style={{
                    color: themeMode ? "#252733" : "#FFF"
                }}> {artist?.name || "Unknown Artist"}</h2>
                <p className='flex gap-1 items-center font-medium' style={{ color: themeMode ? "#252733" : "#BBBCC0", }}>Singer
                 <span className='flex gap-2 items-center' >
                    <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9", }} /> 125 Songs
                  </span>
                </p>
              </div>
           </div>
           <div className='mt-12'>
            <h2 className='text-xl font-semibold' style={{ color: themeMode ? "#252733" : "#FFF" }}>Details</h2>
            <div className='p-6 rounded-2xl shadow-lg mt-6' style={{ backgroundColor: themeMode ? "#FFF" : "#242526" }}>
              <p style={{ color: themeMode ? "#6D6E76" : "#BBBCC0" }}>
                {showFullDescription ? description : words.slice(0, 50).join(' ') + (words.length > 50 ? '...' : '')}
                </p>
               {words.length > 50 && (
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
      {/* Radios Section */}
      {radios.length > 0 && (
        <div className="radios-section">
          {/* <CommonTitleText title="Radios" data="data"/> */}
          <Swiper modules={[Pagination]} pagination={{ clickable: true }}>
            {radios.map((radio) => (
              <SwiperSlide key={radio._id}>
                <div className="radio-card">
                  <img src={radio.thumbnail} alt={radio.title} />
                  <h3>{radio.title}</h3>
                  <p>{radio.description}</p>
                  {/* <DetailButton
                    link={radio.youTube}
                    text="Listen Now"
                  /> */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Albums Section */}
      {albums.length > 0 && (
        <div className="albums-section">
          {/* <CommonTitleText title="Albums" data='data'/> */}
          {albums.map((album) => (
            <div key={album._id} className="album-card">
              <h3>{album.title}</h3>
              {/* Add more album details as needed */}
            </div>
          ))}
        </div>
      )}

      {/* News Videos Section */}
      {newsVideos.length > 0 && (
        <div className="news-section">
          {/* <CommonTitleText title="News Videos" data=""/> */}
          {newsVideos.map((news) => (
            <div key={news._id} className="news-card">
              <h3>{news.title}</h3>
              <p>{news.description}</p>
              {/* <DetailButton
                link={news.youTube}
                text="Watch Now" */}
              {/* /> */}
            </div>
          ))}
        </div>
      )}

      {/* If no data exists */}
      {radios.length === 0 && albums.length === 0 && newsVideos.length === 0 && (
        <div>No data available for this artist.</div>
      )}
    </Layout>
  );
};

export default ArtistDetailsPage;
