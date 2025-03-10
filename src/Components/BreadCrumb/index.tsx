"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import type { RootState } from "../../reducers";
import "./style.css";

// Define constants directly in the file
const HOME_PATH = "/";
const ARTISTS_PATH = "/artist";
const TV_RADIO_PATH = "/radio";
const CONCERT_PATH = "/concert";
const NEWS_PATH = "/news";
const SEARCH_PATH = "/search";
const MATERIAL_PATH = "/playlist";
const NEWRELEASE_PATH = "/album";
const CREATE_NEWS = "/create-news";

const BreadCrumb = () => {
  const currentRoute = useLocation().pathname;
  const defaultRoute: Array<{ [key: string]: string }> = [{ Home: HOME_PATH }];
  const [selectedMenu, setSelectedMenu] =
    useState<{ [key: string]: string }[]>(defaultRoute);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [isLoading, setIsLoading] = useState(false);

  const truncateTitle = (title: string, maxLength = 30) => {
    if (!title) return "";
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    const fetchTitleAndUpdateMenu = async (
      apiUrl: string,
      newMenu: Array<{ [key: string]: string }>
    ) => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Detailed logging for API response
        console.log("API Response Data:", data); // Log the complete response data

        let title = "Szczegóły"; // Default title

        // Check the response structure and extract the title
        if (apiUrl.includes("/api/news/")) {
          title = data?.news?.title || "Szczegóły";
        } else if (apiUrl.includes("/api/radio/")) {
          title =  data?.record?.title || "tv";
        } else if (apiUrl.includes("/api/artist/")) {
          title = data?.artist?.name || "Szczegóły";

        } else if (apiUrl.includes("/api/album/")) {
          console.log("data?.data.title", data?.title)
          title = data?.title || "Szczegóły";
        }
        else if (apiUrl.includes("/api/playlist/")) {

          title = data?.data.title || "Szczegóły";
        }
        // Logging extracted title for debugging
        console.log("Extracted Title:", title);

        const updatedMenu = [...newMenu];
        updatedMenu.push({ [truncateTitle(title)]: currentRoute });
        setSelectedMenu(updatedMenu);
      } catch (error) {
        console.error("Error fetching title:", error);

        const updatedMenu = [...newMenu];
        updatedMenu.push({ Szczegóły: currentRoute });
        setSelectedMenu(updatedMenu);
      } finally {
        setIsLoading(false);
      }
    };

    const newMenu = [...defaultRoute];

    if (currentRoute.includes(ARTISTS_PATH)) {
      newMenu.push({ Artyści: ARTISTS_PATH });

      if (currentRoute.match(new RegExp(`^${ARTISTS_PATH}/.+$`))) {
        const artistId = currentRoute.split("/").pop();
        fetchTitleAndUpdateMenu(
          `http://localhost:8000/api/artist/${artistId}`,
          newMenu
        );
        return;
      }
    } else if (currentRoute.includes(TV_RADIO_PATH)) {
      newMenu.push({ "TV/Radio": TV_RADIO_PATH });
      console.log("Current Route:", currentRoute); // Log current route

      if (currentRoute.match(new RegExp(`^${TV_RADIO_PATH}/.+$`))) {
        const radioId = currentRoute.split("/").pop();
        console.log("Extracted Radio ID:", radioId); // Log extracted radio ID
        fetchTitleAndUpdateMenu(
          `http://localhost:8000/api/radio/${radioId}`,
          newMenu
        );
        return;
      }
    } else if (currentRoute.includes(MATERIAL_PATH)) {
      newMenu.push({ Material: MATERIAL_PATH });

      if (currentRoute.match(new RegExp(`^${MATERIAL_PATH}/.+$`))) {
        const playlistId = currentRoute.split("/").pop();
        fetchTitleAndUpdateMenu(
          `http://localhost:8000/api/playlist/${playlistId}`,
          newMenu
        );
        return;
      }
    } else if (currentRoute.includes(NEWS_PATH)) {
      newMenu.push({ Newsy: NEWS_PATH });

      if (currentRoute.match(new RegExp(`^${NEWS_PATH}/.+$`))) {
        const newsId = currentRoute.split("/").pop();
        fetchTitleAndUpdateMenu(
          `http://localhost:8000/api/news/${newsId}`,
          newMenu
        );
        return;
      }
    } else if (currentRoute.includes(SEARCH_PATH)) {
      newMenu.push({ Wyszukaj: SEARCH_PATH }); // "Search" in Polish
    } else if (currentRoute.includes(MATERIAL_PATH)) {
      newMenu.push({ "Nasze materiały": MATERIAL_PATH });
    } else if (currentRoute.includes(NEWRELEASE_PATH)) {
      newMenu.push({ Albumy: NEWRELEASE_PATH });
      if (currentRoute.match(new RegExp(`^${NEWRELEASE_PATH}/.+$`))) {
        const albumId = currentRoute.split("/").pop();
        fetchTitleAndUpdateMenu(
          `http://localhost:8000/api/album/${albumId}`,
          newMenu
        );
        return;
      }
    } else if (currentRoute.includes(CREATE_NEWS)) {
      newMenu.push({ "Dodaj newsa": CREATE_NEWS });
    }

    setSelectedMenu(newMenu);
  }, [currentRoute]);

  const handleBreadcrumb = React.useMemo(() => {
    return selectedMenu.map((item, idx) => {
      const key = Object.keys(item)[0];
      const value = Object.values(item)[0];
      return (
        <Link to={value} key={`breadcrumb-${idx}`} className="flex">
          {idx > 0 && (
            <div className="flex items-center">
              <AiOutlineRight size={16} color="#9B9CA1" />
            </div>
          )}
          <div
            className={`mx-3 route-text ${
              !themeMode && "textWhite"
            } ${idx === selectedMenu.length - 1 && (themeMode ? "selected-text-color" : "text-dark-color")}`}
          >
            {isLoading && idx === selectedMenu.length - 1 ? "Loading..." : key}
          </div>
        </Link>
      );
    });
  }, [selectedMenu, themeMode, isLoading]);

  return (
    <div className="flex">
      <div className="flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9.02 2.84016L3.63 7.04016C2.73 7.74016 2 9.23016 2 10.3602V17.7702C2 20.0902 3.89 21.9902 6.21 21.9902H17.79C20.11 21.9902 22 20.0902 22 17.7802V10.5002C22 9.29016 21.19 7.74016 20.2 7.05016L14.02 2.72016C12.62 1.74016 10.37 1.79016 9.02 2.84016Z"
            stroke="#9B9CA1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17.9902V14.9902"
            stroke="#9B9CA1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex items-center">{handleBreadcrumb}</div>
    </div>
  );
};

export default BreadCrumb;
