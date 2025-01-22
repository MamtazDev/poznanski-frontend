import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as SummaryIcon } from "../../../assets/svg/summaryIcon.svg";
import { ReactComponent as FacebookIcon } from "../../../assets/svg/facebookIcon.svg";
import { ReactComponent as YoutubeIcon } from "../../../assets/svg/youtubeIcon.svg";
import { ReactComponent as SearchIcon } from "../../../assets/svg/searchIcon.svg";
import { ReactComponent as MobileMenuIcon } from "../../../assets/svg/mobileMenuIcon.svg";
import { Modal, ModalOverlay, ModalContent, Tooltip } from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineRight } from "react-icons/ai";
import * as common from "../../../Constant/constants";
import "./style.css";
import BreadCrumb from "../../BreadCrumb";
import { ToFixedIfOut } from "../../_utility/ToFixedWhileOut";
import { PoznanskiLogoIcon } from "../../../assets/svg/poznanskiLogo";
import { AccountMenu } from "../../AccountMenu/AccountMenu";
import { ReactComponent as InstagramIcon } from "../../../assets/svg/instagramIcon.svg";
import { get } from "lodash";
import { DelayedLink } from "../../_utility/DelayedLink";
import { ActionButton } from "../../Button";

interface NavBarProps {
  filterText?: string;
  setFilterText?: React.Dispatch<React.SetStateAction<string>>;
  themeMode?: boolean;
  type?: boolean;
}

const menu = [
  "Newsy",
  "TV/Radio",
  "Nasze materiały",
  "Albumy",
  "Artyści",
  "Wydarzenia",
];

export const getIconsColor = (themeMode?: boolean) =>
  themeMode ? "#5A1073" : "#2FC4B2";

const NavBar: React.FC<NavBarProps> = (props) => {
  const [selectedMenu, setSelectedMenu] = useState<string>("Home");
  const [openFilterBox, setOpenFilterBox] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    // if (props.setFilterText) {
    // 	props.setFilterText(e.target.value);
    // }
  };

  const handleClear = () => {
    // if (props.setFilterText) {
    // 	props.setFilterText('');
    // }
  };

  useEffect(() => {
    switch (true) {
      case location.pathname.includes(common.TV_RADIO_PATH):
        setSelectedMenu("TV/Radio");
        break;
      case location.pathname.includes(common.CONCERT_PATH):
        setSelectedMenu("Wydarzenia");
        break;
      case location.pathname.includes(common.NEWS_PATH):
        setSelectedMenu("Newsy");
        break;
      case location.pathname.includes(common.ARTISTS_PATH):
        setSelectedMenu("Artyści");
        break;
      case location.pathname.includes(common.MATERIAL_PATH):
        setSelectedMenu("Nasze materiały");
        break;
      case location.pathname.includes(common.NEWRELEASE_PATH):
        setSelectedMenu("Albumy");
        break;
      default:
        setSelectedMenu("Home");
        break;
    }
  }, [location.pathname]);

  const onClick = (value: string): void => {
    setSelectedMenu(value);
    switch (value) {
      case "Home":
        navigate(common.HOME_PATH);
        break;
      case "TV/Radio":
        navigate(common.TV_RADIO_PATH);
        break;
      case "Wydarzenia":
        navigate(common.CONCERT_PATH);
        break;
      case "Newsy":
        navigate(common.NEWS_PATH);
        break;
      case "Artyści":
        navigate(common.ARTISTS_PATH);
        break;
      case "Nasze materiały":
        navigate(common.MATERIAL_PATH);
        break;
      case "Albumy":
        navigate(common.NEWRELEASE_PATH);
        break;
      default:
        break;
    }
    setTimeout(() => {
      setOpenModal(false);
    }, 200);
  };

  const onClose = (): void => {
    setOpenModal(false);
  };
  return (
    <Fragment>
      <div
        className={`Nav-bar fixed

      w-full z-50 shadow-xl`}
      >
        <div
          className={`Nav-bar-top ${!props.themeMode && "Nav-bar-top-dark"} flex place-items-center justify-center`}
        >
          <div className="flex justify-between gap-x-1 container py-4">
            <div className="flex w-3/4 place-items-center">
              <Link to={"/"}>
                <PoznanskiLogoIcon
                  className="mr-4 rounded-full shadow-2xl"
                  fill={props.themeMode ? "#000" : "#fff"}
                />
              </Link>

              <div
                className={`w-2/3 mt-2 ${!props.type || !openFilterBox ? "z-50 shadow-2xl" : "-z-10"} transition-transform -translate-y-20 duration-500 ${!props.type ? "-translate-y-1" : openFilterBox && props.type ? " translate-y-14 absolute w-2/3 shadow-2xl" : ""}`}
              >
                <div
                  className={`filter-box ${!props.themeMode && "filter-box-dark"} w-full flex place-items-center`}
                >
                  <SearchIcon />
                  <input
                    className="ml-2.5 ml-peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none"
                    // value={
                    // 	props.filterText
                    // 		? props.filterText
                    // 		: ''
                    // }
                    onChange={handleChange}
                    placeholder="Szukaj..."
                  ></input>
                  <div
                    className={`cursor-pointer ${props.filterText ? "block" : "hidden"}`}
                    onClick={handleClear}
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
                        stroke={getIconsColor(props.themeMode)}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {!props.type ? (
              <div className="block w-full">
                <div className="flex-2 flex place-items-center gap-x-4 h-full justify-end">
                  <div className="grid grid-cols-4 gap-x-4 ">
                    <YoutubeIcon
                      className="cursor-pointer"
                      stroke={getIconsColor(props.themeMode)}
                    />

                    <FacebookIcon
                      className="cursor-pointer"
                      stroke={getIconsColor(props.themeMode)}
                    />

                    <InstagramIcon
                      className="cursor-pointer"
                      stroke={getIconsColor(props.themeMode)}
                    />

                    <SummaryIcon
                      className="cursor-pointer"
                      stroke={getIconsColor(props.themeMode)}
                    />
                  </div>
                  <AccountMenu themeMode={props.themeMode} />
                  <Link to={common.CREATE_NEWS}>
                    <div
                      className={`submit-btn ${!props.themeMode && "submit-btn-dark"} flex place-items-center ml-4 cursor-pointer`}
                    >
                      Submit News
                    </div>
                  </Link>
                  <DelayedLink to={common.CREATE_NEWS} state={""}>
                    <ActionButton type="button">Dodaj newsa</ActionButton>
                  </DelayedLink>
                </div>
              </div>
            ) : (
              <div className="block">
                <div className=" flex place-items-center h-full justify-end">
                  <div className="grid grid-cols-2 gap-x-8">
                    <div className="flex gap-x-6">
                      <button
                        className="flex place-items-center cursor-pointer"
                        onClick={() => setOpenFilterBox(!openFilterBox)}
                      >
                        {openFilterBox ? (
                          <AiOutlineClose
                            size={34}
                            color={getIconsColor(props.themeMode)}
                          />
                        ) : (
                          <SearchIcon
                            width={34}
                            height={34}
                            stroke={getIconsColor(props.themeMode)}
                          />
                        )}
                      </button>

                      <AccountMenu
                        width="34"
                        height="34"
                        themeMode={props.themeMode}
                      />
                    </div>
                    <button
                      className="flex justify-center place-items-center cursor-pointer"
                      onClick={() => setOpenModal(true)}
                    >
                      <MobileMenuIcon
                        width={40}
                        height={40}
                        stroke={getIconsColor(props.themeMode)}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {props.type || (
          <div
            className={`Nav-bar-down ${!props.themeMode && "Nav-bar-down-dark"} space-around`}
          >
            <div className="flex justify-center gap-10">
              {menu.map((item, idx) => (
                <div
                  key={`nav-btn-${idx}`}
                  className={`Nav-btn ${!props.themeMode && "Nav-btn-dark"} ${item === selectedMenu && (props.themeMode ? "selected-menu" : "selected-menu-dark")}`}
                  onClick={() => onClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Modal onClose={onClose} size="full" isOpen={openModal}>
        <ModalOverlay />
        <ModalContent
          className={`container ${!props.themeMode && "back-dark"} justify-between h-screen`}
        >
          <div className="flex-col h-full">
            <div className="flex justify-between my-4">
              <div className="cursor-pointer">
                <PoznanskiLogoIcon
                  className="rounded-full shadow-2xl"
                  fill={props.themeMode ? "#000" : "#fff"}
                />
              </div>

              <div className="flex items-center" onClick={onClose}>
                <AiOutlineClose
                  size={24}
                  color={props.themeMode ? "" : "#FFF"}
                />
              </div>
            </div>
            <div className="flex justify-center mb-10">
              <BreadCrumb />
            </div>
            <div className="flex flex-col justify-between h-3/5 pb-10">
              {menu.map((item, idx) => (
                <div
                  key={`nav-vertical-btn-${idx}`}
                  className={`Nav-vertical-btn text-center ${item === selectedMenu && (props.themeMode ? "selected-menu" : "text-dark-color")} h-[15%] content-center`}
                  onClick={() => onClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-4 gap-x-8 -mb-20">
                <YoutubeIcon
                  className="cursor-pointer"
                  stroke={getIconsColor(props.themeMode)}
                />

                <FacebookIcon
                  className="cursor-pointer"
                  stroke={getIconsColor(props.themeMode)}
                />

                <InstagramIcon
                  className="cursor-pointer"
                  stroke={getIconsColor(props.themeMode)}
                />

                <SummaryIcon
                  className="cursor-pointer"
                  stroke={getIconsColor(props.themeMode)}
                />
              </div>
            </div>
          </div>

          {/* <Link to={common.CREATE_NEWS}>
						<div className='flex items-center mb-6'>
							<div
								className={`submit-btn-2 flex place-items-center w-full cursor-pointer ${!props.themeMode && 'btn-dark-bg-color btn-dark-color'}`}
							>
								Submit News
							</div>
						</div>
					</Link> */}
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default NavBar;
