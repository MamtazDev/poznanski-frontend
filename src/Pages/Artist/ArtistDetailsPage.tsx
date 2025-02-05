import React, { useEffect, useState } from 'react'
import avatar from "../../assets/png/profileImage2.png"
import Layout from '../../Components/Layout';
import BreadCrumb from '../../Components/BreadCrumb';
import { PageBasicProps } from '../../AppMain';
import { GoDotFill } from "react-icons/go";
import CommonTitleText from '../../Components/CommonTitleText/CommonTitleText';
import useSWR from 'swr';
import DetailButton from '../../Components/Buttons/DetailButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Pagination } from 'swiper/modules';
import Event from './Event';
interface Product {
  id: string;
  title: string;
  img: string;
  category: string;
  date: string;
  link: string;
  location: string;
  artist: string;
  star: number;
}
const ArtistDetailsPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {

 const [newsData, setNewsData] = useState<any[]>([]);
 const [tvRadioData, settvRadioData] = useState<any[]>([]);
 const [albumData, setAlbumData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  // Fetching news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/news/all");
        const result = await response.json();

        if (result && Array.isArray(result.news)) {
          setNewsData(result.news);
        } else {
          console.error("Unexpected API response format:", result);
          setNewsData([]);
        }
      } catch (error) {
        console.error("Error fetching news data:", error);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

   useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch("http://localhost:8000/api/radio");
          const data = await response.json();
          settvRadioData(data);
          console.log(data, "radio data")
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

   useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch("http://localhost:8000/api/album");
          const data = await response.json();
          setAlbumData(data);
          console.log(data, "radio data")
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);




  return (
    <div>
      <Layout themeMode={themeMode} type={type}>
        <div className="flex justify-center">
          <div className="container">
            {!type && (
              <div className="md:mt-12 mt-8">
                <BreadCrumb />
              </div>
            )}

            <div className='flex gap-4 items-center mt-5'>
              <img src={avatar} className='w-[100px] h-[100px]' alt='img' />
              <div>
                <h2 className={` text-5xl font-bold`}
                  style={{
                    color: themeMode ? "#252733" : "#FFF"
                  }}>Bowen Higgins</h2>
                <p className='flex gap-1 items-center font-medium' style={{ color: themeMode ? "#252733" : "#BBBCC0", }}>Singer
                  <span className='flex gap-2 items-center' >
                    <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9", }} /> 125 Songs
                  </span>
                </p>
              </div>
            </div>
            {/* details */}
            <div className='mt-12'>
              <h2 className='text-xl font-semibold' style={{ color: themeMode ? "#252733" : "#FFF" }}>Details</h2>
              <div className='p-6 rounded-2xl shadow-lg mt-6' style={{ backgroundColor: themeMode ? "#FFF" : "#242526" }}>
                <p style={{ color: themeMode ? "#6D6E76" : "#BBBCC0" }}>Classical music is not confined to the past; it continues to evolve and find new expressions in the modern world. Composers are infusing classical elements into their works, creating a fusion of old and new that appeals to a diverse range of listeners. </p>
                <button className='mt-4 font-bold' style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}>view more</button>
              </div>
            </div>
            {/* news */}
            <CommonTitleText title='News' data={newsData}/>
            <CommonTitleText title='TV/Radio' data={tvRadioData}/>
            <CommonTitleText title='Albums' data={albumData}/>
            <Event type={} themeMode={}/>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default ArtistDetailsPage