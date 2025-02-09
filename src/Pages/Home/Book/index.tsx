import React, { useState, useEffect } from "react";
import ContentTitle from "../../../Components/ContentTitle";
import DetailButton from "../../../Components/Buttons/DetailButton";
import BookVerticalCarousel from "./Carousel";
import { Button, Select } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import { apiGetReq } from "../../../Constant/api-functions";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { apiBaseUrl } from "../../../Constant/config";

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

  // useEffect(() => {
  //   setLoading(true);
  //   apiGetReq(`${apiBaseUrl}/concert`, { filter })
  //     .then((res) => {
  //       console.log("API Response:", res); // Log the entire API response
  //       if (res.success) {
  //         let newData: ticketData[] = [];
  //         res.concert.map((item: inputData) => {
  //           const inputDate1: Date = new Date(item.timeframe.start);
  //           const inputDate2: Date = new Date(item.timeframe.end);
  //           const formattedTimeframe =
  //             inputDate1.getUTCHours() +
  //             ":" +
  //             (inputDate1.getUTCMinutes() < 10 ? "0" : "") +
  //             inputDate1.getUTCMinutes() +
  //             "-" +
  //             inputDate2.getUTCHours() +
  //             ":" +
  //             (inputDate2.getUTCMinutes() < 10 ? "0" : "") +
  //             inputDate2.getUTCMinutes();
  //           var month = new Intl.DateTimeFormat("en-US", {
  //             month: "long",
  //           }).format(inputDate1);
  //           const temp: ticketData = {
  //             id: item._id,
  //             type: item.name,
  //             category: item.category,
  //             month: `${month}`,
  //             date: `${inputDate1.getDate()}`,
  //             timeframe: formattedTimeframe,
  //           };
  //           newData.push(temp);
  //         });
  //         console.log("Mapped Data hhhhhhhhh:", newData); // Check the mapped data
  //         setData(newData);
  //       } else {
  //         console.error("API Response success is false");
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log("API Error:", err); // Log the error if any
  //       setLoading(false);
  //     });
  // }, [filter]);
  

  useEffect(() => {
    setLoading(true);
  
    fetch("http://localhost:8000/api/concert")
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response hhhh:", data);
  
        if (data.success) {
          const featuredItems = data.isFeatured.map((item: any) => ({
            id: item._id,
            type: item.name,
            category: item.location,
            name:item.name,
            month: new Date(item.timeframe.start).toLocaleString("en-US", { month: "long" }),
            date: new Date(item.timeframe.start).getDate().toString(),
            timeframe: `${new Date(item.timeframe.start).getUTCHours()}:${new Date(item.timeframe.start).getUTCMinutes()} - ${new Date(item.timeframe.end).getUTCHours()}:${new Date(item.timeframe.end).getUTCMinutes()}`,
          }));
  
          setData(featuredItems);
          console.log("Featured Data:", featuredItems);
        }
  
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching concerts:", error);
        setLoading(false);
      });
  }, []);
  

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

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return data.length > 0 ? (
    <div className="flex justify-center">
      <div className="md:mt-36 md:pt-1.5 mt-20 container">
        <div className="flex justify-between">
          <div className="flex justify-center">
            <div>
              <ContentTitle
                titleType="BUY TICKETS"
                title="Book Your Spot In Event"
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
          {/* <BookVerticalCarousel state={mobileState} data={data} /> */}
          {data?.map((item, idx) => (
                    <Card idx={idx} themeMode={themeMode} item={item} />
                  ))}
        </div>
      </div>
    </div>
  ) : (
    <div>No data available</div> 
  );
};

export default Book;

const Card = ({ item, themeMode, idx }: any) => {
  console.log(item);

  return (
    <div>
      <div
        className={`grid grid-cols-4 ${idx !== 0 && "ticket-top-border"} items-center px-3 shadow-md rounded-2xl`}
        style={{ height: 75 }}
      >
        <div className="flex items-center">
          <div
            className={`ticket-date pr-2 ${!themeMode && "text-dark-color"}`}
          >
            {item.date}
          </div>
          <div className={`ticket-month ${!themeMode && "text-dark-color"}`}>
            <div>{item.month}</div>
            <div>{item.timeframe}</div>
          </div>
        </div>
        <div
          className={`ticket-type text-center ${!themeMode && "title-dark-color"}`}
        >
          {item.name}
        </div>
        <div className="flex  justify-center items-center">
          <div
            className={`ticket-category ${!themeMode && "btn-dark-bg-color"}`}
          >
            {item.category}
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
    </div>
  );
};
