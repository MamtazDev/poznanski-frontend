import type React from "react"
import { useState, useRef, useEffect, type FC } from "react"

interface SearchBarProps {
  onSearchStateChange: (isExpanded: boolean) => void
  themeMode?: boolean
  isSmallDevice: boolean
}

const SearchBar: FC<SearchBarProps> = ({ onSearchStateChange, themeMode, isSmallDevice }) => {
  const [searchText, setSearchText] = useState<string>("")
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const searchBarRef = useRef<HTMLDivElement | null>(null)
  const options: string[] = ["Natasha Djalrio", "John Doe", "Jane Smith", "Michael Brown", "Sarah Wilson"]

  const handleSearchClick = () => {
    const newExpandedState = !isExpanded
    setShowDropdown(newExpandedState)
    setIsExpanded(newExpandedState)
    onSearchStateChange(newExpandedState)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setIsExpanded(false)
        onSearchStateChange(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onSearchStateChange])

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${
        isExpanded ? "w-full" : isSmallDevice ? "w-10" : "w-[482px]"
      }`}
      ref={searchBarRef}
    >
      {isSmallDevice && !isExpanded ? (
        <div className="cursor-pointer flex items-center justify-center w-10 h-10" onClick={handleSearchClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none">
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
        </div>
      ) : (
        <div className={`border border-[#BBBCC0]  py-3 pl-4 pr-3 rounded-md bg-white `}>
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
              onFocus={() => {
                setShowDropdown(true)
                setIsExpanded(true)
                onSearchStateChange(true)
              }}
            />
            {isExpanded && (
              <button
                onClick={() => {
                  setIsExpanded(false)
                  setShowDropdown(false)
                  setSearchText("")
                  onSearchStateChange(false)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 27 26" fill="none">
                  <path
                    d="M6.61914 19.5L19.859 6.5M6.61914 6.5L19.859 19.5"
                    stroke="#6D6E76"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
            .filter((option) => option.toLowerCase().includes(searchText.toLowerCase()))
            .map((option, index) => (
              <li
                key={index}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSearchText(option)
                  setShowDropdown(false)
                  setIsExpanded(false)
                  onSearchStateChange(false)
                }}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                    className="cursor-pointer mr-2"
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
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path
                    d="M5.41602 3.79199L20.5827 18.9587"
                    stroke="#6D6E76"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.41602 14.9178V3.79199H16.5418"
                    stroke="#6D6E76"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar

