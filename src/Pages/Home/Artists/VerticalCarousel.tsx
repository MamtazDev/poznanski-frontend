import React, { useEffect, useState } from "react";
import { Avatar, Spinner } from "@chakra-ui/react";
import DetailButton from "../../../Components/Buttons/DetailButton";
import "./style.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import Arrow from "../../../Components/ArrowBtn/VerticalArrowBtn";
import ArtistsCarousel from "./Carousel";
import Carousel from "../../../Components/Carousel";

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
interface TicketProps {
  state: boolean;
  cardNum: number;
  cardData: ArtistsData[];
  all: number;
  curPage: number;
  setCurPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
}

const VerticalCarousel: React.FC<TicketProps> = ({
  state,
  cardNum,
  cardData,
  all,
  curPage,
  setCurPage,
  loading,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
  }, [hoveredCard]);

  const handleNext = () => {
    if (curPage < all / 3) {
      setCurPage(curPage + 1);
    } else {
      setCurPage(1);
    }
  };

  return (
    <div>
      {!state ? (
        <div className="mt-10">
          <div
            style={{
              minHeight: "504px",
              display: "flex",
              flexDirection: "column",
            }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "252px",
                }}>
                <Spinner size="lg" color={themeMode ? "#5A1073" : "#3BD6C6"} />
              </div>
            ) : (
              cardData.map((cardElement, _idx_) => (
                <div
                  key={_idx_}
                  className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
                  <div
                    className={`p-5 ${hoveredCard === `${_idx_}` && (themeMode ? "artists-body" : "artists-body-dark")}`}
                    style={{
                      borderRadius: "20px",
                      transition: "1s ease-in-out",
                    }}
                    onMouseEnter={() => setHoveredCard(`${_idx_}`)}
                    onMouseLeave={() => setHoveredCard(null)}>
                    <div className="flex items-start w-full">
                      <div className="md:block hidden">
                        <Avatar
                          size="2xl"
                          src={cardElement.artist.profileImg}
                        />
                      </div>
                      <div className="md:hidden block">
                        <Avatar size="lg" src={cardElement.artist.profileImg} />
                      </div>
                      <div className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
                        <div
                          className={`artist-name md:text-xl text-md ${!themeMode && "title-dark-color"}`}>
                          {cardElement.artist.name}
                        </div>
                        <div className="artist-description ">
                          {cardElement.artist.description}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`md:pr-16 transition-all ease-in-out ${hoveredCard === _idx_.toString() ? "h-72" : "h-0 overflow-hidden"}`}>
                      {cardElement?.products.length && (
                        <ArtistsCarousel
                          cardNum={cardNum}
                          cardData={cardElement.products}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center gap-1 mt-5">
            {all &&
              [...Array(Math.ceil(all / 3))].map((_, idx) => (
                <div
                  key={`artist-web-dot-${idx}`}
                  className={`${curPage === idx + 1 ? "dot-active-size-1" : "dot-size-1"}`}
                  style={{
                    backgroundColor:
                      curPage === idx + 1
                        ? themeMode
                          ? "#5A1073"
                          : "#3BD6C6"
                        : themeMode
                          ? "#E8ECFE"
                          : "#51525C",
                  }}></div>
              ))}
          </div>
          <div className="relative">
            <Arrow disabled={false} onClick={handleNext} />
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div>
            {Math.ceil(cardData.length / 3) === 1 ? (
              <div key={`artist-0-2`}>
                <div className="flex flex-col md:gap-6 gap-2 md:mt-12 mt-6">
                  <div className="flex flex-col gap-1 py-4">
                    {[...Array(3)].map(
                      (_, index) =>
                        cardData[index]?.artist && (
                          <div
                            className={`p-6 ${hoveredCard === `0-${index}` && (themeMode ? "artists-body" : "artists-body-dark")}`}
                            style={{ borderRadius: "16px" }}
                            onMouseEnter={() => setHoveredCard(`0-${index}`)}
                            onMouseLeave={() => setHoveredCard(null)}>
                            <div
                              key={`artist-home-carousel-${index}-2`}
                              className="flex items-start w-full">
                              <div className="md:block hidden">
                                <Avatar
                                  size="2xl"
                                  src={cardData[index].artist.profileImg}
                                />
                              </div>
                              <div className="md:hidden block">
                                <Avatar
                                  size="lg"
                                  src={cardData[index].artist.profileImg}
                                />
                              </div>
                              <div className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
                                <div
                                  className={`artist-name-2 md:text-xl text-md ${!themeMode && "title-dark-color"}`}>
                                  {cardData[index].artist.name}
                                </div>
                                <div className="artist-description-2">
                                  {cardData[index].artist.description}
                                </div>
                              </div>
                            </div>
                            {hoveredCard === `0-${index}` ? (
                              <div className="md:pr-16">
                                {cardData[index]?.products.length && (
                                  <ArtistsCarousel
                                    cardNum={cardNum}
                                    cardData={cardData[index].products}
                                  />
                                )}
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Carousel>
                {[...Array(Math.ceil(cardData.length / 3))].map((_, idx) => (
                  <div key={`artist-${idx}-2`}>
                    <div className="flex flex-col md:gap-6 gap-2 md:mt-12 mt-6">
                      <div className="flex flex-col gap-1 py-4">
                        {[...Array(3)].map(
                          (_, index) =>
                            cardData[idx * 3 + index]?.artist && (
                              <div
                                className={`p-6 ${hoveredCard === `${idx}-${index}` && (themeMode ? "artists-body" : "artists-body-dark")}`}
                                style={{ borderRadius: "16px" }}
                                onMouseEnter={() =>
                                  setHoveredCard(`${idx}-${index}`)
                                }
                                onMouseLeave={() => setHoveredCard(null)}>
                                <div
                                  key={`artist-home-carousel-${index}-2`}
                                  className="flex items-start w-full">
                                  <div className="md:block hidden">
                                    <Avatar
                                      size="2xl"
                                      src={
                                        cardData[idx * 3 + index].artist
                                          .profileImg
                                      }
                                    />
                                  </div>
                                  <div className="md:hidden block">
                                    <Avatar
                                      size="lg"
                                      src={
                                        cardData[idx * 3 + index].artist
                                          .profileImg
                                      }
                                    />
                                  </div>
                                  <div className="flex flex-col md:ml-4 ml-2 gap-1 md:gap-3">
                                    <div
                                      className={`artist-name-2 md:text-xl text-md ${!themeMode && "title-dark-color"}`}>
                                      {cardData[idx * 3 + index].artist.name}
                                    </div>
                                    <div className="artist-description-2">
                                      {
                                        cardData[idx * 3 + index].artist
                                          .description
                                      }
                                    </div>
                                  </div>
                                </div>
                                {hoveredCard === `${idx}-${index}` ? (
                                  <div className="md:pr-16">
                                    {cardData[idx * 3 + index]?.products
                                      .length && (
                                      <ArtistsCarousel
                                        cardNum={cardNum}
                                        cardData={
                                          cardData[idx * 3 + index].products
                                        }
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
          <div className="w-full mt-6">
            <DetailButton text="See All Ticket" btnType="mobile" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VerticalCarousel;
