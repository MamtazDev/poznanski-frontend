import React, { useEffect, useRef, useState, MutableRefObject } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import Arrow from "../ArrowBtn/HorizontalArrowBtn";
import VerticalArrow from "../ArrowBtn/VerticalArrowBtn";
import "./style.css";

interface CustomDotProps {
  index: number;
  onClick: (event: React.MouseEvent<HTMLDivElement>, index: number) => void;
  active: boolean;
  themeMode: boolean;
}

interface CarouselProps {
  children: React.ReactNode;
  autoSpeed?: number;
  arrowBtn?: boolean;
  verticalMode?: boolean;
  verticalBtn?: boolean;
  sildesToShow?: number;
  adaptiveHeight?: boolean;
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const CustomDot: React.FC<CustomDotProps> = ({
  index,
  onClick,
  active,
  themeMode,
}) => {
  const [type, setType] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setType(true);
      } else {
        setType(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default behavior
    onClick(event, index); // Invoke the onClick callback with the index
  };
  return (
    <div
      className={`${type ? (active ? "dot-active-size-2" : "dot-size-2") : active ? "dot-active-size-1" : "dot-size-1"} ${themeMode ? "slick-dot" : "slick-dot-dark"} ${themeMode ? (active ? "slick-dot-active" : "") : active ? "slick-dot-active-dark" : ""}`}
      onClick={(e) => handleClick(e)}
    />
  );
};

const CustomNextArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return <Arrow onClick={onClick} disabled={false} />;
};

const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return <Arrow left onClick={onClick} disabled={false} />;
};

const Carousel: React.FC<CarouselProps> = ({
  children,
  arrowBtn,
  autoSpeed,
  verticalBtn,
  verticalMode,
  sildesToShow,
  adaptiveHeight,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  let sliderRef: MutableRefObject<Slider | null> = useRef<Slider | null>(null);

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext(); // Access slickPrev through current property
    }
  };
  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev(); // Access slickPrev through current property
    }
  };

  const handleClickDot = (
    event: React.MouseEvent<HTMLDivElement>,
    n: number
  ) => {
    event.preventDefault();
    setActiveSlide(n);
  };

  const settings = {
    dots: true,
    infinite: true,
    className: "left",
    speed: 1000, // Adjust speed as needed
    slidesToShow: sildesToShow || 1, // Display 7 slides per page
    slidesToScroll: sildesToShow || 1,
    autoplay: true,
    arrows: arrowBtn,
    pauseOnHover: true,
    autoplaySpeed: autoSpeed ? autoSpeed : 5000, // Change slide every 3 seconds
    vertical: verticalMode,
    verticalSwiping: false,
    swipeToSlide: false,
    adaptiveHeight: adaptiveHeight,
    beforeChange: (current: number, next: number) => setActiveSlide(next),
    afterChange: (current: number) => setActiveSlide(current),
    customPaging: (i: number) => (
      <CustomDot
        index={i}
        onClick={handleClickDot}
        active={i === activeSlide}
        themeMode={themeMode}
      />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div className="flex">
        <div className={`dot-list ${verticalMode && "dot-vertical-list"}`}>
          {dots}
        </div>
      </div>
    ),
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };
  return (
    <div>
      {verticalBtn ? (
        <div className="relative h-10">
          <VerticalArrow top disabled={false} onClick={previous} />
        </div>
      ) : (
        <></>
      )}
      <Slider
        ref={(slider) => {
          sliderRef.current = slider;
        }}
        {...settings}
      >
        {children}
      </Slider>
      {verticalBtn ? (
        <div className="relative h-6">
          <VerticalArrow disabled={false} onClick={next} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Carousel;
