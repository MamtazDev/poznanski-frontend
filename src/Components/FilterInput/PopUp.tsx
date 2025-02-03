import { useState } from "react";

const PopUp = ({ handleClosePopup, themeMode,setFilters,filters }: any) => {
  console.log(themeMode, "popupppppp");
  const [quantity, setQuantity] = useState<number>(10);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string | null>("A to Z");


  const handleSortSelection = (sortOption: string) => {
    setSelectedSort(sortOption);
  };


  const handleApplyFilters = () => {
    const updatedFilters = {
      sort: selectedSort ?? "A to Z",
      quantity: quantity,
      startDate: startDate,
      endDate: endDate,
    };
    setFilters(updatedFilters);
    console.log("Applied Filters:", updatedFilters);
    handleClosePopup();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex justify-center items-center" onClick={handleClosePopup}>
      <div onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[750px] rounded-lg shadow-lg p-6 relative ${themeMode ? "bg-white" : "bg-black"}`}
      >
        <button
          onClick={handleClosePopup}
          className={`absolute top-4 right-4 text-gray-500 `}
        >
          ✖
        </button>
        <h2
          className={`text-xl font-semibold mb-6 text-center ${themeMode ? "text-black" : "text-white"}`}
        >
          Filters
        </h2>

        <div className="mb-8">
          <label
            className={`text-sm font-bold mb-[10px] flex items-start ${themeMode ? "text-[#252733]" : "text-white"}`}
          >
            Sort by
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSortSelection("A to Z")}
              className={`flex-1 p-2 text-center rounded-md ${
                selectedSort === "A to Z"
                  ? "bg-[#5A1073] text-white"
                  : `border border-gray-300 ${themeMode ? "text-black" : "text-white"}`
              }`}
            >
              <span> A to Z</span>
            </button>
            <button
              onClick={() => handleSortSelection("Z to A")}
              className={`flex-1 p-2 text-center rounded-md ${
                selectedSort === "Z to A"
                  ? "bg-[#5A1073] text-white"
                  : `border border-gray-300 ${themeMode ? "text-black" : "text-white"}`
              }`}
            >
              Z to A
            </button>
          </div>
        </div>

        <div className="mb-8">
          <label
            className={`text-sm font-bold mb-[10px] flex items-start ${themeMode ? "text-[#252733]" : "text-white"}`}
          >
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-bold ${themeMode ? "text-[#252733]" : "text-white"}`}
            >
              10
            </span>
            <input
              type="range"
              min="10"
              step ="5"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="flex-1 accent-[#5A1073] h-[6px] bg-[#F0EFF4] rounded-full appearance-none"
              style={{
                background: `linear-gradient(to right, #5A1073 ${((quantity - 10) / 90) * 100}%, #F0EFF4 ${((quantity - 10) / 90) * 100}%)`,
              }}
            />
            <span
              className={`text-sm font-bold ${themeMode ? "text-[#252733]" : "text-white"}`}
            >
              100
            </span>
          </div>
          <div
            className={`text-center mt-2 text-sm font-bold ${themeMode ? "text-[#252733]" : "text-white"}`}
          >
            {quantity}
          </div>
        </div>
        <div className="mb-8">
          <label
            className={`text-sm font-bold mb-[10px] flex items-start ${themeMode ? "text-[#252733]" : "text-white"}`}
          >
            Date
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`flex-1 border rounded-[8px] p-2 text-sm focus:ring-2  focus:outline-none ${themeMode ? "bg-white border-[#D9D9D9] focus:ring-[#5A1073]" : "bg-gray-400 border-gray-600"}`}
            />
            <span
              className={`text-sm font-bold ${themeMode ? "text-[#252733]" : "text-white"}`}
            >
              -
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`flex-1 border rounded-[8px] p-2 text-sm focus:ring-2 focus:outline-none ${themeMode ? "bg-white border-[#D9D9D9] focus:ring-[#5A1073]" : "bg-gray-400 border-gray-600"}`}
            />
          </div>
        </div>

        <div className="flex gap-8 justify-end mt-12">
          <button
            className={`px-6 py-2 ${themeMode ? "text-[#252733]" : "text-white"}`}
            onClick={handleClosePopup}
          >
            Cancel
          </button>
          <button className={`px-6 py-2 text-white bg-[#5A1073] rounded-md`} onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
