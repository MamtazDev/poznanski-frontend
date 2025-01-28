import { useState, useRef, useEffect, type FC } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearchStateChange: (isExpanded: boolean) => void;
  themeMode?: boolean;
  isSmallDevice: boolean;
}

const SearchBar: FC<SearchBarProps> = ({
  onSearchStateChange,
  themeMode,
  isSmallDevice,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const navigate = useNavigate();
  // const options: string[] = [
  //   "Natasha Djalrio",
  //   "John Doe",
  //   "Jane Smith",
  //   "Michael Brown",
  //   "Sarah Wilson",
  // ];

  console.log("t", themeMode);

  useEffect(() => {
    // Fetch recent searches from localStorage on component mount
    const storedSearches = JSON.parse(
      localStorage.getItem("searchQuery") || "[]"
    );
    setOptions(storedSearches);
  }, []);

  const handleSearchClick = () => {
    const newExpandedState = !isExpanded;
    setShowDropdown(newExpandedState);
    setIsExpanded(newExpandedState);
    onSearchStateChange(newExpandedState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchText.trim()) {
      // Retrieve the current searchQuery from localStorage or initialize as an empty array
      const currentSearchQueries = JSON.parse(
        localStorage.getItem("searchQuery") || "[]"
      );

      // Append the new searchText to the array
      currentSearchQueries.push(searchText.trim());

      // Save the updated array back to localStorage
      localStorage.setItem("searchQuery", JSON.stringify(currentSearchQueries));

      // Redirect to /search page with the query parameter
      navigate(`/search?query=${encodeURIComponent(searchText)}`);

      // Reset the search state
      setIsExpanded(false);
      setShowDropdown(false);
      onSearchStateChange(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsExpanded(false);
        onSearchStateChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSearchStateChange]);

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${
        isExpanded ? "w-full" : isSmallDevice ? "w-10" : "w-[482px]"
      }`}
      ref={searchBarRef}
    >
      {isSmallDevice && !isExpanded ? (
        <div
          className="cursor-pointer flex items-center justify-center w-10 h-10"
          onClick={handleSearchClick}
        >
          {/* Small device search icon */}
        </div>
      ) : (
        <div
          className={`border py-3 pl-4 pr-3 rounded-md ${themeMode ? "bg-white border-[#BBBCC0]" : "bg-[#14151C] border-[#51525C]"}`}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M12.8333 4.58398H18.3333"
                stroke="#51525C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.8333 7.33398H15.5833"
                stroke="#51525C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19.2499 10.5423C19.2499 15.3548 15.3541 19.2507 10.5416 19.2507C5.72909 19.2507 1.83325 15.3548 1.83325 10.5423C1.83325 5.72982 5.72909 1.83398 10.5416 1.83398"
                stroke="#51525C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20.1666 20.1673L18.3333 18.334"
                stroke="#51525C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              className={`ml-2.5 w-full h-full bg-transparent font-sans font-normal outline-none ${themeMode ? "text-gray-700" : "text-white"}`}
              placeholder="Search Anything"
              value={searchText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                setShowDropdown(true);
                setIsExpanded(true);
                onSearchStateChange(true);
              }}
            />
            {isExpanded && (
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setShowDropdown(false);
                  setSearchText("");
                  onSearchStateChange(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="26"
                  viewBox="0 0 27 26"
                  fill="none"
                >
                  <path
                    d="M6.61914 19.5L19.859 6.5M6.61914 6.5L19.859 19.5"
                    stroke="#6D6E76"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      {showDropdown && (
        <ul className="absolute z-10 mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options
            .filter((option) =>
              option.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((option, index) => (
              <li
                key={index}
                className={`flex justify-between items-center px-4 py-2 cursor-pointer ${themeMode ? "bg-white text-black" : "bg-black text-white"}`}
                onClick={() => {
                  setSearchText(option);
                  setShowDropdown(false);
                  setIsExpanded(false);
                  onSearchStateChange(false);
                }}
              >
                {option}
                <Link to={`/search?query=${option}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                  >
                    <path
                      d="M5.41602 3.7915L20.5827 18.9582"
                      stroke="#6D6E76"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5.41602 14.9173V3.7915H16.5418"
                      stroke="#6D6E76"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
