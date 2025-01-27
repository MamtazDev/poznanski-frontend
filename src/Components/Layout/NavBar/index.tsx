import type React from "react";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as SummaryIcon } from "../../../assets/svg/summaryIcon.svg";
import { ReactComponent as FacebookIcon } from "../../../assets/svg/facebookIcon.svg";
import { ReactComponent as YoutubeIcon } from "../../../assets/svg/youtubeIcon.svg";
import { ReactComponent as MobileMenuIcon } from "../../../assets/svg/mobileMenuIcon.svg";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import * as common from "../../../Constant/constants";
import "./style.css";
import BreadCrumb from "../../BreadCrumb";
import { PoznanskiLogoIcon } from "../../../assets/svg/poznanskiLogo";
import { AccountMenu } from "../../AccountMenu/AccountMenu";
import { ReactComponent as InstagramIcon } from "../../../assets/svg/instagramIcon.svg";
import { DelayedLink } from "../../_utility/DelayedLink";
import { ActionButton } from "../../Button";
import SearchBar from "./SearchBar";

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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false); // Added state for small device
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);

    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []); // Added useEffect to check device size

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

  const handleSearchStateChange = (expanded: boolean) => {
    setIsSearchExpanded(expanded);
  };

  return (
    <Fragment>
      <div className={`Nav-bar fixed w-full z-50 shadow-xl`}>
        <div
          className={`Nav-bar-top ${!props.themeMode && "Nav-bar-top-dark"} flex place-items-center justify-center`}
        >
          <div className="flex justify-between gap-x-1 container py-4 px-4 md:px-6">
            <div className="flex w-full place-items-center">
              <Link
                to={"/"}
                className={
                  isSearchExpanded && (isSmallDevice || !isSmallDevice)
                    ? "hidden"
                    : ""
                }
              >
                <PoznanskiLogoIcon
                  className="mr-4 rounded-full shadow-2xl w-10 h-10 md:w-12 md:h-12"
                  fill={props.themeMode ? "#000" : "#fff"}
                />
              </Link>
              <SearchBar
                onSearchStateChange={handleSearchStateChange}
                themeMode={true}
                isSmallDevice={isSmallDevice}
              />
              <button
                onClick={() => setOpenModal(true)}
                className={`md:hidden flex items-center justify-center w-10 h-10 ${isSearchExpanded ? "hidden" : ""}`}
              >
                <MobileMenuIcon
                  className="w-6 h-6"
                  stroke={getIconsColor(props.themeMode)}
                />
              </button>
            </div>

            {!isSearchExpanded && (
              <div className="hidden md:block w-full">
                <div className="flex-2 flex place-items-center gap-x-4 h-full justify-end">
                  <div className="grid grid-cols-4 gap-x-4">
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
                      className={`submit-btn ${
                        !props.themeMode && "submit-btn-dark"
                      } flex place-items-center ml-4 cursor-pointer`}
                    >
                      Submit News
                    </div>
                  </Link>
                  <DelayedLink to={common.CREATE_NEWS} state={""}>
                    <ActionButton type="button">Dodaj newsa</ActionButton>
                  </DelayedLink>
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
                  className={`Nav-btn ${!props.themeMode && "Nav-btn-dark"} ${
                    item === selectedMenu &&
                    (props.themeMode ? "selected-menu" : "selected-menu-dark")
                  }`}
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
          className={`container ${!props.themeMode && "back-dark"} justify-between h-screen p-4 md:p-6`}
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
                  className={`Nav-vertical-btn text-center ${
                    item === selectedMenu &&
                    (props.themeMode ? "selected-menu" : "text-dark-color")
                  } h-[15%] content-center`}
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
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default NavBar;
