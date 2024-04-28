import React, { useState } from "react";
import DetailButton from "../../../Components/Buttons/DetailButton";
import TVCard from "../../../Components/Card/TVCard";
import Carousel from "../../../Components/Carousel";
import "./style.css";

interface CarouselProps {
  cardNum: number;
  cardData: {
    title: string;
    feature: string;
    img: string;
    link: string;
  }[];
}

const CarouselComponent: React.FC<CarouselProps> = ({ cardNum, cardData }) => {
  return (
    <div>
      {cardNum &&
        cardNum !== 1 &&
        (Math.ceil(cardData.length / 2 / cardNum) === 1 ? (
          <div className={`grid  ${"grid-cols-" + cardNum} gap-3.5 px-2 py-5`}>
            {[...Array(Math.ceil(cardNum * 2))].map(
              (_, index) =>
                cardData[index] && (
                  <div key={`card-${index}-0`} className="w-full">
                    <TVCard
                      type="horizontal"
                      img={cardData[index].img}
                      feature={cardData[index].feature}
                      title={cardData[index].title}
                      link={cardData[index].link}
                    />
                  </div>
                )
            )}
          </div>
        ) : (
          <Carousel arrowBtn={true}>
            {[...Array(Math.ceil(cardData.length / 2 / cardNum))].map(
              (_, idx) => (
                <div>
                  <div
                    className={`grid  ${"grid-cols-" + cardNum} gap-3.5 px-2 py-5`}
                  >
                    {[...Array(Math.ceil(cardNum * 2))].map(
                      (_, index) =>
                        cardData[idx * cardNum * 2 + index] && (
                          <div key={`card-${index}-0`} className="w-full">
                            <TVCard
                              type="horizontal"
                              img={cardData[idx * cardNum * 2 + index].img}
                              feature={
                                cardData[idx * cardNum * 2 + index].feature
                              }
                              title={cardData[idx * cardNum * 2 + index].title}
                              link={cardData[idx * cardNum * 2 + index].link}
                            />
                          </div>
                        )
                    )}
                  </div>
                </div>
              )
            )}
          </Carousel>
        ))}
      {cardNum && cardNum === 1 && (
        <div className="mt-4">
          {Math.ceil(cardData.length / 4) === 1 ? (
            <div className="px-2 py-3">
              <div
                className="flex flex-col gap-4"
                style={{ width: "100%", height: "100%" }}
              >
                {[...Array(4)].map((_, index) => {
                  if (cardData[index]) {
                    return (
                      <TVCard
                        key={`tv-carousel-${index}-2`}
                        type="vertical"
                        img={cardData[index].img}
                        feature={cardData[index].feature}
                        title={cardData[index].title}
                        link={cardData[index].link}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ) : (
            cardData && (
              <Carousel>
                {[...Array(Math.ceil(cardData.length / 4))].map((_, idx) => (
                  <div
                    key={`carousel-grid-${idx}-0`}
                    className="keen-slider__slide px-2 py-6"
                  >
                    <div
                      className="flex flex-col gap-4"
                      style={{ width: "100%", height: "100%" }}
                    >
                      {[...Array(4)].map((_, index) => {
                        if (cardData[idx * 4 + index]) {
                          return (
                            <TVCard
                              key={`tv-carousel-${index}-2`}
                              type="vertical"
                              img={cardData[idx * 4 + index].img}
                              feature={cardData[idx * 4 + index].feature}
                              title={cardData[idx * 4 + index].title}
                              link={cardData[idx * 4 + index].link}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
              </Carousel>
            )
          )}

          <div className="w-full mt-6">
            <DetailButton text="See All News" btnType="mobile" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselComponent;
