import React, { useRef } from 'react'
import Layout from '../../Components/Layout'
import { PageBasicProps } from '../../AppMain'
import BreadCrumb from '../../Components/BreadCrumb'
import topartist from "../../assets/svg/top-artist.svg"
import topastistsinger from "../../assets/png/top-astist-singer.png"
import singer from "../../assets/svg/artists1.svg"
import { GoDotFill } from 'react-icons/go'
import { IoLocationOutline } from "react-icons/io5";
import { BsCalendar2Date } from 'react-icons/bs'
import CommentSection from './CommentSection'
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
const TopArtist: React.FC<PageBasicProps> = ({ themeMode, type }) => {

  // Swiper reference
  const swiperRef = useRef<SwiperInstance | null>(null);

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
  return (

    <Layout themeMode={themeMode} type={type}>
      <div className="flex justify-center">
        <div className="container">
          {!type && (
            <div className="md:mt-12 mt-8">
              <BreadCrumb />
            </div>
          )}
          <h2 className={` text-5xl font-bold mt-5`}
            style={{
              color: themeMode ? "#252733" : "#FFF"
            }}>Our Top Artists</h2>

          <img src={topartist} className='w-full mt-12' alt='img' />
          <div className='mt-7 flex gap-3 items-center'>
            <img src={topastistsinger} alt='img' />
            <div>
              <h2 className='text-2xl font-semibold' style={{
                color: themeMode ? "#252733" : "#FFF"
              }}>Smells Like Teen Spirit</h2>
              <p style={{
                color: themeMode ? "#6D6E76" : "#fff"
              }}>Moj Youtube Mix</p>
            </div>
          </div>
          <div className='p-6 rounded-2xl shadow-lg mt-6' style={{ backgroundColor: themeMode ? "#FFF" : "#242526" }}>
            <p className='flex gap-1 items-center font-medium' style={{ color: themeMode ? "#252733" : "#BBBCC0", }}>4.9k Views
              <span className='flex gap-2 items-center' >
                <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9", }} /> 4 Hours Ago
              </span>
            </p>
            <p style={{ color: themeMode ? "#6D6E76" : "#BBBCC0" }}>Classical music is not confined to the past; it continues to evolve and find new expressions in the modern world. Composers are infusing classical elements into their works, creating a fusion of old and new that appeals to a diverse range of listeners. </p>
            <button className='mt-4 font-bold' style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}>view more</button>
          </div>

          <div className='mt-12'>
            <h1 className='text-xl font-semibold ' style={{ color: themeMode ? "black" : "#fff" }}>Related Videos</h1>
            {/* card */}
            <div className="w-full mt-10 relative">
              {/* Swiper Component */}
              <Swiper
                onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                slidesPerView={4}
                spaceBetween={30}
                loop={true}

                breakpoints={{
                  1200: { slidesPerView: 3 },
                  900: { slidesPerView: 2 },
                  600: { slidesPerView: 1 },
                  425: { slidesPerView: 1 },
                }}
              >
                {[1, 2, 3, 4].map((_, index) => (
                  <SwiperSlide key={index}>
                    <div className='p-5 rounded-3xl mt-6'
                      style={{
                        backgroundColor: themeMode ? "#FFF" : "#242526",
                        color: themeMode ? "black" : "#fff",
                        borderRadius: "25px",
                        border: `2px solid ${themeMode ? "#f8f8ff" : "#242526"}`
                      }}>
                      <img src={singer} alt='img' className='w-full' />
                      <button className='py-1 px-5 text-center rounded-full font-semibold mt-4'
                        style={{
                          backgroundColor: themeMode ? "#E8ECFE" : "#3BD6C6",
                          color: themeMode ? "#5A1073" : "#5A1073"
                        }}>Wildlife</button>
                      <p className='mt-2 text-lg font-semibold' >Drake Ignites the Stage with Spectacular New Concert Experience!</p>
                      <div className='flex gap-2 items-center'>
                        <p className='flex gap-1 items-center' style={{
                          color: themeMode ? "#9B9CA1" : "#9B9CA1"
                        }}><IoLocationOutline /> New York</p>
                        <GoDotFill style={{ color: themeMode ? "#D9D9D9" : "D9D9D9", }} />
                        <p className='flex gap-1 items-center' style={{
                          color: themeMode ? "#9B9CA1" : "#9B9CA1"
                        }}><BsCalendar2Date />20/4/2023</p></div>
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
          <CommentSection themeMode={themeMode} type={type} />
        </div>
      </div>
    </Layout>

  )
}

export default TopArtist