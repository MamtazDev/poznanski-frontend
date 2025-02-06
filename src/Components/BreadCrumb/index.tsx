import React, { useMemo } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import * as common from '../../Constant/constants';
import { RootState } from '../../reducers';
import './style.css';

const BreadCrumb = () => {
  const currentRoute = useLocation().pathname;
  const defaultRoute: Array<{ [key: string]: string }> = [{ Home: common.HOME_PATH }];
  const [selectedMenu, setSelectedMenu] = React.useState<{ [key: string]: string }[]>(defaultRoute);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  React.useEffect(() => {
    const newMenu = [...defaultRoute]; // Start with the default route

    // Add breadcrumbs based on the route
    if (currentRoute.includes(common.ARTISTS_PATH)) {
      newMenu.push({ Artyści: common.ARTISTS_PATH });

      // Add "Details" if on a specific artist's details page
      if (currentRoute.match(new RegExp(`^${common.ARTISTS_PATH}/.+$`))) {
        newMenu.push({ Szczegóły: currentRoute }); // "Details" in Polish
      }
    }

    if (currentRoute.includes(common.TV_RADIO_PATH)) {
      newMenu.push({ 'TV/Radio': common.TV_RADIO_PATH });
    }

    if (currentRoute.includes(common.CONCERT_PATH)) {
      newMenu.push({ Koncerty: common.CONCERT_PATH });
    }

    if (currentRoute.includes(common.NEWS_PATH)) {
      newMenu.push({ Newsy: common.NEWS_PATH });
    }

    if (currentRoute.includes(common.SEARCH_PATH)) {
      newMenu.push({ Wyszukaj: common.SEARCH_PATH }); // "Search" in Polish
    }

    if (currentRoute.includes(common.MATERIAL_PATH)) {
      newMenu.push({ 'Nasze materiały': common.MATERIAL_PATH });
    }

    if (currentRoute.includes(common.NEWRELEASE_PATH)) {
      newMenu.push({ Albumy: common.NEWRELEASE_PATH });
    }

    if (currentRoute.includes(common.CREATE_NEWS)) {
      newMenu.push({ 'Dodaj newsa': common.CREATE_NEWS });
    }

    setSelectedMenu(newMenu);
  }, [currentRoute]);

  const handleBreadcrumb = useMemo(() => {
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
              !themeMode && 'textWhite'
            } ${idx === selectedMenu.length - 1 && (themeMode ? 'selected-text-color' : 'text-dark-color')}`}
          >
            {key}
          </div>
        </Link>
      );
    });
  }, [selectedMenu, themeMode]);

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
