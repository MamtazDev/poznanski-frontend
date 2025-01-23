import { IconButton } from "@chakra-ui/react";
import React, { useState, ChangeEvent } from "react";
import { Input } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import {
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
  BsChevronRight,
  BsChevronLeft,
} from "react-icons/bs";

interface PaginationProps {
  selectedPage: number;
  setSelectedPage: React.Dispatch<React.SetStateAction<number>>;
  goToPage?: (page: number) => void;
  prevPage?: () => void;
  nextPage?: () => void; // Make nextPage optional
  pages: number;
  totalPages?: number; // Add totalPages here
  entriesPerPage: number;
  setEntriesPerPage: React.Dispatch<React.SetStateAction<number>>;

}
const PaginationBar: React.FC<PaginationProps> = ({
  selectedPage,
  setSelectedPage,
  pages,
  goToPage,
  prevPage,
  nextPage,
  setEntriesPerPage,
  entriesPerPage,

}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const handleDecrease = () => {
    if (selectedPage > 1) {
      const value = selectedPage - 1;
      // setSelectedPage(value);
      prevPage?.();
    }

  };

  const handleIncrease = () => {
    if (selectedPage < pages) {
      const value = selectedPage + 1;
      // Call nextPage only if it exists
      nextPage?.();
    }
  };


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedPage(Number(e.target.value));
    goToPage?.(Number(e.target.value));
  };


  const handleEntriesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setSelectedPage(1); // Reset to first page when entries per page change
  };


  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <span className={`${themeMode ?"text-[#252733]" : " text-white"}`}>Show</span>
        <select
          value={entriesPerPage}
          onChange={handleEntriesChange}
          className={`border border-[#E9EBF0] rounded-sm px-2 py-1 ${themeMode ?"text-[#252733] bg-red-300" : " text-white bg-[#242526]"}`}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span className={`${themeMode ?"text-[#252733]" : " text-white"}`}>entries</span>
      </div>
      <div className="flex gap-2">
        <IconButton
          aria-label="PrevBtn"
          variant={themeMode ? "outline" : ""}
          icon={
            <BsChevronDoubleLeft
              size={12}
              color={!themeMode ? "white" : "#6D6E76"}
            />
          }
          isDisabled={selectedPage === 1 || selectedPage < 1 ? true : false}
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          color={themeMode ? "#252733" : "#FFF"}
          border={themeMode ? "border: 1px solid #E9EBF0" : "unset"}
          width="40px"
          height="30px"
          onClick={() => setSelectedPage(1)}
        />
        <IconButton
          aria-label="PrevBtn"
          variant={themeMode ? "outline" : ""}
          isDisabled={selectedPage === 1 || selectedPage < 1 ? true : false}
          icon={
            <BsChevronLeft size={12} color={!themeMode ? "white" : "#6D6E76"} />
          }
          color={themeMode ? "#FFF" : "#252733 "}
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          border={themeMode ? "1px solid #E9EBF0" : "unset"}
          width="40px"
          height="30px"
          onClick={() => handleDecrease()}
        />
        <div>
          <Input
            value={selectedPage}
            width={"55px"}
            height={"30px"}
            onChange={handleChange}
            backgroundColor={themeMode ? "#FFF" : "#242526"}
            color={themeMode ? "#252733" : "#FFF"}
            border={themeMode ? "1px solid #E9EBF0" : "unset"}
            textAlign="center"
          />
        </div>
        <div
          className={`flex items-center ${themeMode ? "entire-page" : "entire-page-2"}`}
        >
          of {pages}
        </div>
        <IconButton
          aria-label="PrevBtn"
          variant={themeMode ? "outline" : ""}
          isDisabled={
            selectedPage === pages || selectedPage > pages ? true : false
          }
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          color={themeMode ? "#252733" : "#FFF"}
          border={themeMode ? "1px solid #E9EBF0" : "unset"}
          width="40px"
          height="30px"
          icon={
            <BsChevronRight
              size={12}
              color={!themeMode ? "white" : "#6D6E76"}
            />
          }
          onClick={() => handleIncrease()}
        />
        <IconButton
          aria-label="PrevBtn"
          variant={themeMode ? "outline" : ""}
          icon={
            <BsChevronDoubleRight
              size={12}
              color={!themeMode ? "white" : "#6D6E76"}
            />
          }
          isDisabled={
            selectedPage === pages || selectedPage > pages ? true : false
          }
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          color={themeMode ? "#252733" : "#FFF"}
          border={themeMode ? "1px solid #E9EBF0" : "unset"}
          width="40px"
          height="30px"
          onClick={() => setSelectedPage(pages)}
        />
      </div>
    </div>
  );
};

export default PaginationBar;
