import { useState, useRef, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom"; // Ensure you are using react-router-dom for navigation

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
        <div className="border border-[#BBBCC0] py-3 pl-4 pr-3 rounded-md bg-white">
          <div className="flex items-center">
            {/* Search icon */}
            <input
              className="ml-2.5 w-full h-full bg-transparent text-gray-700 font-sans font-normal outline-none"
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
                {/* Close icon */}
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
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSearchText(option);
                  setShowDropdown(false);
                  setIsExpanded(false);
                  onSearchStateChange(false);
                }}
              >
                {option}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
