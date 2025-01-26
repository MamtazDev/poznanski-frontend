import React, { useState, useRef, useEffect } from "react";

export default function SearchBar() {
  const [searchText, setSearchText] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const searchBarRef = useRef<HTMLDivElement | null>(null);

  const options: string[] = [
    "Natasha Djalrio",
    "John Doe",
    "Jane Smith",
    "Michael Brown",
    "Sarah Wilson",
  ];

  const handleSearchClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchBarRef}>
      <div className="border border-[#BBBCC0] bg-white py-3 pl-4 pr-3 rounded-md">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
            viewBox="0 0 22 22"
            fill="none"
            className="cursor-pointer"
            onClick={handleSearchClick}
          >
            <path
              d="M12.8334 4.5835H18.3334"
              stroke="#BBBCC0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.8334 7.3335H15.5834"
              stroke="#BBBCC0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.25 10.5418C19.25 15.3543 15.3542 19.2502 10.5417 19.2502C5.72921 19.2502 1.83337 15.3543 1.83337 10.5418C1.83337 5.72933 5.72921 1.8335 10.5417 1.8335"
              stroke="#BBBCC0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.1667 20.1668L18.3334 18.3335"
              stroke="#BBBCC0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            className="ml-2.5 w-full h-full bg-transparent text-gray-700 font-sans font-normal outline-none"
            placeholder="Search Anything"
            value={searchText}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
          />
        </div>
      </div>
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
                onClick={() => setSearchText(option)}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                    className="cursor-pointer mr-2"
                    onClick={handleSearchClick}
                  >
                    <path
                      d="M12.8334 4.5835H18.3334"
                      stroke="#BBBCC0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.8334 7.3335H15.5834"
                      stroke="#BBBCC0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.25 10.5418C19.25 15.3543 15.3542 19.2502 10.5417 19.2502C5.72921 19.2502 1.83337 15.3543 1.83337 10.5418C1.83337 5.72933 5.72921 1.8335 10.5417 1.8335"
                      stroke="#BBBCC0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.1667 20.1668L18.3334 18.3335"
                      stroke="#BBBCC0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {option}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M5.41602 3.79199L20.5827 18.9587"
                    stroke="#6D6E76"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5.41602 14.9178V3.79199H16.5418"
                    stroke="#6D6E76"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
