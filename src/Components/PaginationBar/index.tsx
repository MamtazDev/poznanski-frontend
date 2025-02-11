import { IconButton, Input } from "@chakra-ui/react";
import React, { ChangeEvent } from "react";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

interface PaginationProps {
  selectedPage: number;
  setSelectedPage: React.Dispatch<React.SetStateAction<number>>;
  goToPage?: (page: number) => void;
  prevPage?: () => void;
  nextPage?: () => void;
  pages: number;
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
  entriesPerPage,
  setEntriesPerPage,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const handleDecrease = () => {
    if (selectedPage > 1) {
      setSelectedPage(selectedPage - 1);
      prevPage?.();
    }
  };

  const handleIncrease = () => {
    if (selectedPage < pages) {
      setSelectedPage(selectedPage + 1);
      nextPage?.();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const page = Math.min(Math.max(Number(e.target.value), 1), pages);
    setSelectedPage(page);
    goToPage?.(page);
  };

  const handleEntriesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setSelectedPage(1);
  };

  return (
    <div className="flex justify-between items-center w-full ">

      <div className="flex items-center space-x-2">
        <span className={`${themeMode ? "text-[#252733]" : "text-white"}`}>
          Show
        </span>
        <select
          value={entriesPerPage}
          onChange={handleEntriesChange}
          className={`border border-[#E9EBF0] rounded-sm px-2 py-1 ${themeMode ? "text-[#252733] bg-white" : "text-white bg-[#242526]"
            }`}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span className={`${themeMode ? "text-[#252733]" : "text-white"}`}>
          entries
        </span>
      </div>

      <div className="flex md:space-x-2 space-x-0.5">
        {/* <IconButton
          aria-label="First Page"
          variant={themeMode ? "outline" : ""}
          icon={
            <BsChevronDoubleLeft
              size={12}
              color={!themeMode ? "white" : "#6D6E76"}
            />
          }
          isDisabled={selectedPage === 1}
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          color={themeMode ? "#252733" : "#FFF"}
          border={themeMode ? "1px solid #E9EBF0" : "unset"}
          width="40px"
          height="30px"
          onClick={() => setSelectedPage(1)}
        /> */}
        <IconButton
          aria-label="Previous Page"
          variant={themeMode ? "outline" : ""}
          isDisabled={selectedPage === 1}
          icon={
            <BsChevronLeft size={12} color={!themeMode ? "white" : "#6D6E76"} />
          }
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          color={themeMode ? "#252733" : "#FFF"}
          border={themeMode ? "1px solid #E9EBF0" : "unset"}
          width="40px"
          height="30px"
          onClick={handleDecrease}
        />
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
        <div
          className={`flex items-center ${themeMode ? "text-[#252733]" : "text-white"
            }`}
        >
          of {pages}
        </div>
        <IconButton
          aria-label="Next Page"
          variant={themeMode ? "outline" : ""}
          isDisabled={selectedPage === pages}
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
          onClick={handleIncrease}
        />
        {/* <IconButton
          aria-label="Last Page"
          variant={themeMode ? "outline" : ""}
          icon={
            <BsChevronDoubleRight
              size={12}
              color={!themeMode ? "white" : "#6D6E76"}
            />
          }
          isDisabled={selectedPage === pages}
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          color={themeMode ? "#252733" : "#FFF"}
          border={themeMode ? "1px solid #E9EBF0" : "unset"}
          width="40px"
          height="30px"
          onClick={() => setSelectedPage(pages)}
        /> */}
      </div>
    </div>
  );
};

export default PaginationBar;
