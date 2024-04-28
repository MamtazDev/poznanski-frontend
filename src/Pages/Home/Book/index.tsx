import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import BookVerticalCarousel from "./Carousel";
import { Select } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import { apiGetReq } from "../../../Constant/api-functions";
import { useNavigate } from "react-router-dom";
import "./style.css";

interface ticketData {
  id: string;
  type: string;
  month: string;
  date: string;
  category: string;
  timeframe: string;
}

interface inputData {
  _id: string;
  name: string;
  category: string;
  timeframe: {
    start: Date;
    end: Date;
  };
}

const Book: React.FC<{ filter: string }> = ({ filter }) => {
  const [mobileState, setMobileState] = useState<boolean>(false);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [data, setData] = useState<ticketData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiGetReq("/concert/book", { filter })
      .then((res) => {
        if (res.success) {
          let newData: ticketData[] = [];
          res.concert.map((item: inputData) => {
            const inputDate1: Date = new Date(item.timeframe.start);
            const inputDate2: Date = new Date(item.timeframe.end);
            const formattedTimeframe =
              inputDate1.getUTCHours() +
              ":" +
              (inputDate1.getUTCMinutes() < 10 ? "0" : "") +
              inputDate1.getUTCMinutes() +
              "-" +
              inputDate2.getUTCHours() +
              ":" +
              (inputDate2.getUTCMinutes() < 10 ? "0" : "") +
              inputDate2.getUTCMinutes();
            var month = new Intl.DateTimeFormat("en-US", {
              month: "long",
            }).format(inputDate1);
            const temp: ticketData = {
              id: item._id,
              type: item.name,
              category: item.category,
              month: `${month}`,
              date: `${inputDate1.getDate()}`,
              timeframe: formattedTimeframe,
            };
            newData.push(temp);
          });
          setData(newData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        throw err;
      });
  }, [filter]);

  useEffect(() => {
    const handleResize = () => {
      setMobileState(false);
      if (window.innerWidth < 768) setMobileState(true);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return data ? (
    <div className="flex justify-center ">
      <div className="md:mt-36 md:pt-1.5 mt-20 container">
        <div className="flex justify-between">
          <div className="flex justify-center">
            <div>
              <ContentTitle
                titleType="BUY TICKETS"
                title="Book Your Spot In Event "
              />
              <div className="flex flex-wrap md:mt-8 mt-3 md:gap-4 gap-2">
                <Select
                  variant="outlined"
                  rounded="full"
                  height={!mobileState ? "46px" : "28px"}
                  width={!mobileState ? "180px" : "150px"}
                  background={themeMode ? "#E8ECFE" : "#FFF"}
                  fontSize={!mobileState ? "16px" : "12px"}
                  placeholder="Weekdays"
                >
                  <option value="1">
                    <div className="p-4">Monday</div>
                  </option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                </Select>
                <Select
                  variant="outlined"
                  rounded="full"
                  height={!mobileState ? "46px" : "28px"}
                  width={!mobileState ? "180px" : "150px"}
                  background={themeMode ? "#E8ECFE" : "#FFF"}
                  fontSize={!mobileState ? "16px" : "12px"}
                  placeholder="Event Type"
                >
                  <option value="1">Concert Name</option>
                </Select>

                <Select
                  variant="outlined"
                  rounded="full"
                  height={!mobileState ? "46px" : "28px"}
                  width={!mobileState ? "180px" : "150px"}
                  background={themeMode ? "#E8ECFE" : "#FFF"}
                  fontSize={!mobileState ? "16px" : "12px"}
                  placeholder="Category"
                >
                  <option value="1">Wildlife</option>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex items-end">
            <div className="md:block hidden">
              <DetailButton
                text="See All Tickets"
                btnType="web"
                onClick={() => navigate("/concert")}
              />
            </div>
          </div>
        </div>
        <div className="md:mt-20 mt-10">
          {data?.length && (
            <BookVerticalCarousel state={mobileState} data={data} />
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Book;
