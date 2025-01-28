import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import React, { useState } from "react";
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
    // link?: string;
  }[];
}

const ArtistsCarousel: React.FC<CarouselProps> = ({ cardNum, cardData }) => {
  const [newLoaded, setNewLoaded] = useState(false);
  const [newSliderRef, newInstanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      created() {
        setNewLoaded(true);
      },
      loop: true,
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

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
                <div className={`grid  ${"grid-cols-" + cardNum} gap-4 py-5`}>
                  {[...Array(Math.ceil(cardNum))].map(
                    (_, index) =>
                      cardData[idx * cardNum + index] && (
                        <div key={`card-${index}-0`} className="w-full">
                          <MaterialCard
                            type="horizontal"
                            img={cardData[idx * cardNum + index].img}
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
          {newLoaded && newInstanceRef.current && (
            <>
              <Arrow
                onClick={(e: any) =>
                  e.stopPropagation() || newInstanceRef.current?.next()
                }
                // disabled={
                //   newCurrentSlide ===
                //   newInstanceRef.current.track.details.slides.length - 1
                // }
                disabled={false}
              />
            </>
          )}
        </div>
      )}
      {cardNum && cardNum === 1 && (
        <div className="mt-4 w-full gap-3 flex-col flex">
          {cardData[0] && (
            <MaterialCard
              type="vertical"
              img={cardData[0]?.img}
              feature={cardData[0].category}
              title={cardData[0].title}
              date={cardData[0].date}
              location={cardData[0].location}
            />
          )}
          {cardData[1] && (
            <MaterialCard
              type="vertical"
              img={cardData[1]?.img}
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
