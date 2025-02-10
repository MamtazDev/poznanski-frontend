import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import React, { useState, useEffect } from "react";
import Arrow from "../../../Components/ArrowBtn/HorizontalArrowBtn";
import MaterialCard from "../../../Components/Card/MaterialCard2";
import "./style.css";

interface CarouselProps {
  cardNum: number;
  cardData: {
    title: string;
    category: string;
    img: string;
    date: string;
    location: string;
    youTube?: string | undefined;
  }[];
}

const ArtistsCarousel: React.FC<CarouselProps> = ({ cardNum, cardData }) => {
  const [newLoaded, setNewLoaded] = useState(false);
  const [newSliderRef, newInstanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    created() {
      setNewLoaded(true);
    },
  });

  useEffect(() => {
  }, [newInstanceRef, newLoaded]);

  return (
    <div className="w-full">
      {cardNum && cardNum !== 1 && (
        <div
          className="flex navigation-wrapper mt-10"
          style={{ width: "100%", height: "100%" }}
        >
          <div ref={newSliderRef} className="keen-slider">
            {[...Array(Math.ceil(cardData.length / cardNum))].map((_, idx) => (
              <div
                key={`carousel-grid-${idx}-0`}
                className="keen-slider__slide px-2"
              >
                <div className={`grid ${"grid-cols-" + cardNum} gap-4 py-5`}>
                  {[...Array(Math.ceil(cardNum))].map(
                    (_, index) =>
                      cardData[idx * cardNum + index] && (
                        <div key={`card-${index}-0`} className="w-full">
                          <MaterialCard
                            type="horizontal"
                            youTube={cardData[idx * cardNum + index].youTube ?? ""}
                            feature={cardData[idx * cardNum + index].category}
                            title={cardData[idx * cardNum + index].title}
                            date={cardData[idx * cardNum + index].date}
                            location={cardData[idx * cardNum + index].location}
                          />
                        </div>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Arrows for Navigation */}
          {newLoaded && newInstanceRef.current && (
            <>
              <Arrow
                onClick={() => newInstanceRef.current?.prev()}
                disabled={false}
              />
              <Arrow
                onClick={() => newInstanceRef.current?.next()}
                disabled={false}
              />
            </>
          )}
        </div>
      )}

      {/* Single Card Display */}
      {cardNum === 1 && (
        <div className="mt-4 w-full gap-3 flex-col flex">
          {cardData[0] && (
            <MaterialCard
            youTube={cardData[0].youTube ?? ""}
              type="vertical"
              feature={cardData[0].category}
              title={cardData[0].title}
              date={cardData[0].date}
              location={cardData[0].location}
            />
          )}
          {cardData[1] && (
            <MaterialCard
            youTube={cardData[0].youTube ?? ""}
              type="vertical"
              // img={cardData[1]?.img}
              feature={cardData[1].category}
              title={cardData[1].title}
              date={cardData[1].date}
              location={cardData[1].location}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistsCarousel;
