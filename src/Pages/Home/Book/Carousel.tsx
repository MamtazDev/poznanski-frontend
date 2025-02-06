import React, { useEffect } from "react";
import { Button } from "@chakra-ui/react";
import DetailButton from "../../../Components/Buttons/DetailButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import Arrow from "../../../Components/ArrowBtn/VerticalArrowBtn";
import Carousel from "../../../Components/Carousel";
import "./style.css";

interface TicketProps {
  state: boolean;
  data: {
    month: string;
    date: string;
    category: string;
    type: string;
    timeframe: string;
  }[];
}

const BookVerticalCarousel: React.FC<TicketProps> = ({ state, data }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [ticketDotCurrentSlide, setTicketDotCurrentSlide] = React.useState(0);
  const [ticketLoaded, setTicketLoaded] = React.useState(false);
  const [ticketDotLoaded, setTicketDotLoaded] = React.useState(false);
  const [nowState, setNowState] = React.useState<boolean>(state);

  useEffect(() => {
    setNowState(state);
  }, [state]);

  return (
    <div className="">
      {!nowState ? (
        <div className="mt-10">
          <Carousel verticalMode={true} verticalBtn={true}>
            {[...Array(Math.ceil(data.length / 6))].map((_, index) => (
                <div key={`ticket-card-${index}`}>
                  <div
                    className={`${themeMode ? "book-back" : "book-back-dark"}`}
                    style={{ height: "450px" }}
                  >
                    {[...Array(6)].map((_, idx) =>
                      data[index * 6 + idx] ? (
                        <div
                        key={idx}
                          className={`grid grid-cols-4 ${idx !== 5 && "ticket-bottom-border"} items-center px-3`}
                          style={{ height: 75 }}
                        >
                          <div className="flex items-center">
                            <div
                              className={`ticket-date pr-2 ${!themeMode && "text-dark-color"}`}
                            >
                              {data[index * 6 + idx].date}
                            </div>
                            <div
                              className={`ticket-month ${!themeMode && "text-dark-color"}`}
                            >
                              <div>{data[index * 6 + idx].month}</div>
                              <div>{data[index * 6 + idx].timeframe}</div>
                            </div>
                          </div>
                          <div
                            className={`ticket-type ${!themeMode && "title-dark-color"}`}
                          >
                            {data[index * 6 + idx].type}
                          </div>
                          <div className="flex  justify-center items-center">
                            <div
                              className={`ticket-category ${!themeMode && "btn-dark-bg-color"}`}
                            >
                              {data[index * 6 + idx].category}
                            </div>
                          </div>
                          <div>
                            <Button
                              size="md"
                              height="30px"
                              width="105px"
                              border="2px"
                              borderColor={themeMode ? "#5A1073" : "#2FC4B2"}
                              borderWidth="1px"
                              borderRadius="5px"
                              color={themeMode ? "#5A1073" : "#2FC4B2"}
                              fontFamily="Urbanist"
                              fontSize="14px"
                              fontWeight="600"
                              backgroundColor={themeMode ? "#FFF" : "#242526"}
                            >
                              Buy Ticket
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </Carousel>
        </div>
      ) : (
        <div className="mt-4">
          <div>
            {Math.ceil(data.length / 4) === 1 ? (
              <div className={`${themeMode ? "book-back" : "book-back-dark"}`}>
                {[...Array(4)].map((_, idx) => {
                  if (data[idx]) {
                    return (
                      <div
                        key={`book-carousel-${idx}-${0}-2`}
                        className={`${idx !== 0 && "ticket-top-border"} p-3`}
                      >
                        <div className={`flex justify-between `}>
                          <div
                            className={`ticket-date-2 ${!themeMode && "title-dark-color"}`}
                          >
                            {data[idx].date} {data[idx].month}
                          </div>
                          <div
                            className={`ticket-timeframe ${!themeMode && "title-dark-color"}`}
                          >
                            {data[idx].timeframe}
                          </div>
                        </div>
                        <div className="flex justify-between mt-3">
                          <div
                            className={`ticket-type-2 ${!themeMode && "title-dark-color"}`}
                          >
                            {data[idx].type}
                          </div>
                          <div
                            className={`ticket-category-2 ${!themeMode && "btn-dark-bg-color"}`}
                          >
                            {data[idx].category}
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="outlined"
                            size="md"
                            height="32px"
                            width="100%"
                            border="2px"
                            borderColor={themeMode ? "#5A1073" : "#2FC4B2"}
                            borderWidth="1px"
                            borderRadius="8px"
                            color={themeMode ? "#5A1073" : "#2FC4B2"}
                            fontFamily="Urbanist"
                            fontSize="12px"
                            fontWeight="600"
                            backgroundColor={themeMode ? "#FFF" : "#242526"}
                            _active={
                              themeMode
                                ? {
                                    background: "#5A1073",
                                    color: "#FFF",
                                  }
                                : {
                                    background: "#2FC4B2",
                                    color: "#5A1073",
                                  }
                            }
                          >
                            Buy Ticket
                          </Button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <Carousel>
                {data &&
                  [...Array(Math.ceil(data.length / 4))].map((_, index) => (
                    <div key={`ticket-grid-${index}-0`}>
                      <div
                        className={`my-5 ${themeMode ? "book-back" : "book-back-dark"}`}
                      >
                        {[...Array(4)].map((_, idx) => {
                          if (data[index * 4 + idx]) {
                            return (
                              <div
                                key={`book-carousel-${idx}-${index}-2`}
                                className={`${idx !== 0 && "ticket-top-border"} p-3`}
                              >
                                <div className={`flex justify-between `}>
                                  <div
                                    className={`ticket-date-2 ${!themeMode && "title-dark-color"}`}
                                  >
                                    {data[index * 4 + idx].date}{" "}
                                    {data[index * 4 + idx].month}
                                  </div>
                                  <div
                                    className={`ticket-timeframe ${!themeMode && "title-dark-color"}`}
                                  >
                                    {data[index * 4 + idx].timeframe}
                                  </div>
                                </div>
                                <div className="flex justify-between mt-3">
                                  <div
                                    className={`ticket-type-2 ${!themeMode && "title-dark-color"}`}
                                  >
                                    {data[index * 4 + idx].type}
                                  </div>
                                  <div
                                    className={`ticket-category-2 ${!themeMode && "btn-dark-bg-color"}`}
                                  >
                                    {data[index * 4 + idx].category}
                                  </div>
                                </div>
                                <div className="mt-3 flex justify-end">
                                  <Button
                                    variant="outlined"
                                    size="md"
                                    height="32px"
                                    width="100%"
                                    border="2px"
                                    borderColor={
                                      themeMode ? "#5A1073" : "#2FC4B2"
                                    }
                                    borderWidth="1px"
                                    borderRadius="8px"
                                    color={themeMode ? "#5A1073" : "#2FC4B2"}
                                    fontFamily="Urbanist"
                                    fontSize="12px"
                                    fontWeight="600"
                                    backgroundColor={
                                      themeMode ? "#FFF" : "#242526"
                                    }
                                    _active={
                                      themeMode
                                        ? {
                                            background: "#5A1073",
                                            color: "#FFF",
                                          }
                                        : {
                                            background: "#2FC4B2",
                                            color: "#5A1073",
                                          }
                                    }
                                  >
                                    Buy Ticket
                                  </Button>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
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

export default BookVerticalCarousel;
