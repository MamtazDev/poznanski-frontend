import { Button } from "@chakra-ui/react";
import moment from "moment";

const BookCard = ({ item, themeMode, idx }: any) => {

  // console.log(item, "item")

  return (
    <div className={`py-4 ${idx !== 0 && "ticket-top-border"}`}>
      <div
        className="hidden md:flex   items-center justify-between mx-auto px-10"
        style={{ height: 75 }}>
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
        {item.name && (
          <div
            className={`ticket-type text-center capitalize ${!themeMode && "title-dark-color"}`}>
            {item.name}
          </div>
        )}

        {item.category && (
          <div className="flex justify-center items-center">
            <div
              className={`ticket-category ${!themeMode && "btn-dark-bg-color"}`}>
              {item.category}
            </div>
          </div>
        )}

        <div className="flex justify-end">
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
            backgroundColor={themeMode ? "#FFF" : "#242526"}>
            Buy Ticket
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:hidden px-3">
        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className={`font-medium "}`} style={{ color: themeMode ? "#6D6E76" : "#2FC4B2" }}>
            {moment(item.timeframe.start).format("D MMMM")}
          </div>
          <div style={{ color: themeMode ? "#6D6E76" : "#2FC4B2" }}>
            {moment(item.timeframe.start).format(" h:mm A")} - {moment(item.timeframe.end).format("h:mm A")}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div
            className={`text-base font-medium ${!themeMode && "title-dark-color"}`}>
            {item.name}
          </div>

          {item.category && (
            <div className="px-2 py-1 text-xs rounded-lg bg-purple-100 text-purple-700">
              {item.category}
            </div>
          )}
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
            backgroundColor={themeMode ? "#FFF" : "#242526"}>
            Buy Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
