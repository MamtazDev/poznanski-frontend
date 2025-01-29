import React, { useState } from "react";
import DetailButton from "../../../Components/Buttons/DetailButton";
import MaterialCard from "../../../Components/Card/MaterialCard";
import Carousel from "../../../Components/Carousel/index";
import "./style.css";

interface CarouselProps {
  cardNum: number;
  cardData: {
    title: string;
    feature: string;
    date: string;
    img: string;
    location: string;
    link: string;
  }[];
}

const CarouselComponent: React.FC<CarouselProps> = ({ cardNum, cardData }) => {
  return (
    <div>
      {cardNum &&
        cardNum !== 1 &&
        (Math.ceil(cardData.length / 2 / cardNum) === 1 ? (
          <div
            className={`grid ${cardNum === 3 && "grid-cols-3"} ${cardNum === 2 && "grid-cols-2"} gap-2.5 py-1`}
          >
            {[...Array(Math.ceil(cardNum * 2))].map(
              (_, index) =>
                cardData[index] && (
                  <div key={`card-${index}-0`} className="w-full">
                    <MaterialCard
                      type="horizontal"
                      video={cardData[index].img}
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
            {[...Array(Math.ceil(cardData.length / 2 / cardNum))].map(
              (_, idx) => (
                <div className="px-2">
                  <div
                    className={`grid ${cardNum === 3 && "grid-cols-3"} ${cardNum === 2 && "grid-cols-2"} gap-2.5 pt-1 pb-5`}
                  >
                    {[...Array(Math.ceil(cardNum * 2))].map(
                      (_, index) =>
                        cardData[idx * cardNum * 2 + index] && (
                          <div key={`card-${index}-0`} className="w-full">
                            <MaterialCard
                              type="horizontal"
                              video={cardData[idx * cardNum * 2 + index].img}
                              feature={
                                cardData[idx * cardNum * 2 + index].feature
                              }
                              title={cardData[idx * cardNum * 2 + index].title}
                              date={cardData[idx * cardNum * 2 + index].date}
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
        <div>
          {Math.ceil(cardData.length / 4) === 1 ? (
            <div
              className="flex flex-col gap-4"
              style={{ width: "100%", height: "100%" }}
            >
              {[...Array(4)].map((_, index) => {
                if (cardData[index]) {
                  return (
                    <MaterialCard
                      key={`material-carousel-${index}-0-2`}
                      type="vertical"
                      video={cardData[index].img}
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
              {[...Array(Math.ceil(cardData.length / 4))].map((_, idx) => (
                <div className="pt-1 pb-6 px-2">
                  <div
                    className="flex flex-col gap-4"
                    style={{ width: "100%", height: "100%" }}
                  >
                    {[...Array(4)].map((_, index) => {
                      if (cardData[idx * 4 + index]) {
                        return (
                          <MaterialCard
                            key={`material-carousel-${index}-${idx}-2`}
                            type="vertical"
                            video={cardData[idx * 4 + index].img}
                            feature={cardData[idx * 4 + index].feature}
                            title={cardData[idx * 4 + index].title}
                            date={cardData[idx * 4 + index].date}
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
