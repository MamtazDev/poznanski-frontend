import moment from "moment";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const CardComp = ({ item, themeMode, idx }: any) => {


  return (
    <div className={`p-4 ${idx !== 0 && "ticket-top-border"}`}>
      <div className="hidden md:grid grid-cols-4 items-center px-3" style={{ height: 48 }}>
        <div className="flex items-center gap-3">
          {/* Date */}
          <div className={` text-4xl font-semibold `} style={{ color: themeMode ? "#5A1073" : "#2FC4B2" }}>
            {moment(item.timeframe.start).format("DD")}
          </div>

          {/* Month & Time in Column Layout */}
          <div className={`flex flex-col text-xs `} style={{ color: themeMode ? "#6D6E76" : "#2FC4B2" }}>
            <span>{moment(item.timeframe.start).format("MMMM")}</span>
            <span>
              {moment(item.timeframe.start).format("h:mm A")} - {moment(item.timeframe.end).format("h:mm A")}
            </span>
          </div>
        </div>

        <div className={`ticket-type text-center capitalize line-clamp-1 ${!themeMode && "title-dark-color"}`}>
          {item.name}
        </div>
        <div className="flex justify-center items-center">
          <div className={`ticket-category ${!themeMode && "btn-dark-bg-color"}`}>
            {item.location}
          </div>
        </div>
        <div className="flex justify-end">
          {/* <Button
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
            onClick={() => console.log("")}
          >
            Buy Ticket
          </Button> */}
           <a
    href={item.ticket}
    className={`inline-flex items-center justify-center text-[14px] font-semibold font-[Urbanist] border ${themeMode ? 'border-[#5A1073] text-[#5A1073] bg-white' : 'border-[#2FC4B2] text-[#2FC4B2] bg-[#242526]'} h-[30px] w-[105px] rounded-[5px]`}
  >
    Buy Ticket
  </a>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className={`font-medium "}`}>
            {moment(item.timeframe.start).format("D MMMM")}
          </div>
          <div className={`${!themeMode && "text-dark-color"}`}>
            {moment(item.timeframe.start).format(" h:mm A")} - {moment(item.timeframe.end).format("h:mm A")}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className={`text-base font-medium line-clamp-2 ${!themeMode && "title-dark-color"}`}>
            {item.name}
          </div>

          <div className="px-2 py-1 text-xs font-semibold rounded-full  text-[#5A1073]" style={{
            backgroundColor : themeMode?"#E8ECFE":"#2FC4B2"
          }}>
            {item.location}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            size="md"
            height="35px"
            width="100%"
            border="2px"
            borderColor={themeMode ? "#5A1073" : "#2FC4B2"}
            borderWidth="1px"
            borderRadius="8px"
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

export default CardComp;
