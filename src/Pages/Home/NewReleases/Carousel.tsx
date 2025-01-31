import React from "react";
import DetailButton from "../../../Components/Buttons/DetailButton";
import NewReleaseCard from "../../../Components/Card/NewReleaseCard";
import Carousel from "../../../Components/Carousel";
import "./style.css";

interface CarouselProps {
  cardNum: number;
  cardData: {
    title: string;
    feature: string;
    img: string;
    date: string;
    link: string;
  }[];
}

const ReleaseCarousel: React.FC<CarouselProps> = ({ cardNum, cardData }) => {
  return (
    <div>
      {cardNum && cardNum !== 1 && (
        <div className="mt-16">
          {Math.ceil(cardData.length / cardNum) === 1 ? (
            <div className={`grid  ${"grid-cols-" + cardNum} gap-7 py-5`}>
              {[...Array(Math.ceil(cardNum))].map(
                (_, index) =>
                  cardData[index] && (
                    <div key={`card-${index}-0`} className="w-full">
                      <NewReleaseCard
                        data=''
                        youTube=''
                        img={cardData[index].img}
                        feature={cardData[index].feature}
                        title={cardData[index].title}
                        date={cardData[index].date}
                        link={cardData[index].link}
                      />
                    </div>
                  )
              )}
            </div>
          ) : (
            <Carousel arrowBtn={true}>
              {[...Array(Math.ceil(cardData.length / cardNum))].map(
                (_, idx) => (
                  <div key={`carousel-grid-${idx}-0`}>
                    <div
                      className={`grid  ${"grid-cols-" + cardNum} gap-7 py-5`}
                    >
                      {[...Array(Math.ceil(cardNum))].map(
                        (_, index) =>
                          cardData[idx * cardNum + index] && (
                            <div key={`card-${index}-0`} className="w-full">
                              <NewReleaseCard
                                data=''
                                youTube=''
                                img={cardData[idx * cardNum + index].img}
                                feature={
                                  cardData[idx * cardNum + index].feature
                                }
                                title={cardData[idx * cardNum + index].title}
                                date={cardData[idx * cardNum + index].date}
                                link={cardData[idx * cardNum + index].link}
                              />
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )
              )}
            </Carousel>
          )}
        </div>
      )}
      {cardNum && cardNum === 1 && (
        <div className="mt-6">
          {Math.ceil(cardData.length / 4) === 1 ? (
            <div
              className="flex flex-col gap-4 pt-6"
              style={{ width: "100%", height: "100%" }}
            >
              {[...Array(4)].map((_, index) => {
                if (cardData[index]) {
                  return (
                    <NewReleaseCard
                      data=''
                      key={`newRelease-caraousel-0-${index}-2`}
                      youTube=''
                      img={cardData[index].img}
                      feature={cardData[index].feature}
                      title={cardData[index].title}
                      date={cardData[index].date}
                      link={cardData[index].link}
                    />
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <Carousel>
              {cardData &&
                [...Array(Math.ceil(cardData.length / 4))].map((_, idx) => (
                  <div
                    key={`carousel-grid-${idx}-0`}
                    className="keen-slider__slide py-6 px-2"
                  >
                    <div
                      className="flex flex-col gap-4"
                      style={{ width: "100%", height: "100%" }}
                    >
                      {[...Array(5)].map((_, index) => {
                        if (cardData[idx * 5 + index]) {
                          return (
                            <NewReleaseCard
                              data=''
                              key={`newRelease-caraousel-${idx}-${index}-2`}
                              youTube=''
                              img={cardData[idx * 5 + index].img}
                              feature={cardData[idx * 5 + index].feature}
                              title={cardData[idx * 5 + index].title}
                              date={cardData[idx * 5 + index].date}
                              link={cardData[idx * 5 + index].link}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
            </Carousel>
          )}
          <div className="w-full mt-6">
            <DetailButton text="See All News" btnType="mobile" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleaseCarousel;
