import React, { useEffect, useState } from "react";
import DetailButton from "../../../Components/Buttons/DetailButton";
import ProductCard1 from "../../../Components/Card/ProductCard1";
import Carousel from "../../../Components/Carousel";
import "../../mainPageStyle.css";

interface CarouselProps {
  cardNum: number;
  cardData: {
    title: string;
    feature: string;
    date: string;
    img: string;
  }[];
}

interface DataType {
  title: string;
  feature: string;
  date: string;
  img: string;
}

const CarouselComponent: React.FC<CarouselProps> = (props) => {
  return (
    <div>
      {props.cardNum && props.cardNum !== 1 && (
        <div>
          {Math.ceil(props.cardData.length / 2 / props.cardNum) !== 1 && (
            <Carousel arrowBtn={true}>
              {[
                ...Array(Math.ceil(props.cardData.length / 2 / props.cardNum)),
              ].map((_, idx) => (
                <div key={`carousel-grid-${idx}-0`} className="px-2">
                  <div
                    className={`grid ${props.cardNum === 3 && "grid-cols-3"} ${props.cardNum === 2 && "grid-cols-2"} gap-2.5 py-5`}
                  >
                    {[...Array(Math.ceil(props.cardNum * 2))].map(
                      (_, index) =>
                        props.cardData[idx * props.cardNum * 2 + index] && (
                          <div key={`card-${index}-0`} className="w-full">
                            <ProductCard1
                              type="horizontal"
                              img={
                                props.cardData[idx * props.cardNum * 2 + index]
                                  .img
                              }
                              feature={
                                props.cardData[idx * props.cardNum * 2 + index]
                                  .feature
                              }
                              title={
                                props.cardData[idx * props.cardNum * 2 + index]
                                  .title
                              }
                              date={
                                props.cardData[idx * props.cardNum * 2 + index]
                                  .date
                              }
                            />
                          </div>
                        )
                    )}
                  </div>
                </div>
              ))}
            </Carousel>
          )}
          {Math.ceil(props.cardData.length / 2 / props.cardNum) === 1 && (
            <div className="px-2">
              <div
                className={`grid ${props.cardNum === 3 && "grid-cols-3"} ${props.cardNum === 2 && "grid-cols-2"} gap-4 py-6`}
              >
                {[...Array(Math.ceil(props.cardNum * 2))].map(
                  (_, index) =>
                    props.cardData[index] && (
                      <div key={`card-${index}-0`} className="w-full">
                        <ProductCard1
                          type="horizontal"
                          img={props.cardData[index].img}
                          feature={props.cardData[index].feature}
                          title={props.cardData[index].title}
                          date={props.cardData[index].date}
                        />
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {props.cardNum && props.cardNum === 1 && (
        <div className="mt-4">
          {Math.ceil(props.cardData.length / 4) === 1 ? (
            <div className="px-2 py-4">
              <div
                className="flex flex-col gap-3"
                style={{ width: "100%", height: "100%" }}
              >
                {[...Array(4)].map((_, index) => {
                  if (props.cardData[index]) {
                    return (
                      <ProductCard1
                        key={`news-carousel-${index}-2`}
                        type="vertical"
                        img={props.cardData[index].img}
                        feature={props.cardData[index].feature}
                        title={props.cardData[index].title}
                        date={props.cardData[index].date}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ) : (
            <Carousel>
              {props.cardData &&
                [...Array(Math.ceil(props.cardData.length / 4))].map(
                  (_, idx) => (
                    <div key={`carousel-grid-${idx}-0`} className="px-2 py-6">
                      <div
                        className="flex flex-col gap-3"
                        style={{ width: "100%", height: "100%" }}
                      >
                        {[...Array(4)].map((_, index) => {
                          if (props.cardData[idx * 4 + index]) {
                            return (
                              <ProductCard1
                                key={`news-carousel-${index}-2`}
                                type="vertical"
                                img={props.cardData[idx * 4 + index].img}
                                feature={
                                  props.cardData[idx * 4 + index].feature
                                }
                                title={props.cardData[idx * 4 + index].title}
                                date={props.cardData[idx * 4 + index].date}
                              />
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )
                )}
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
