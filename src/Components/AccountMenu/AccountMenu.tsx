import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { ReactComponent as UserIcon } from "../../assets/svg/userIcon.svg";

import { ThemeProviderMUI } from "../TextField/Select";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { logout } from "../../reducers/user";
import { deleteCookie } from "../../utils/auth";
import { useEffect } from "react";
import { logoutRequest } from "../../Constant/api-requests";

export const AccountMenu: React.FC<{
  themeMode?: boolean;
  width?: string;
  height?: string;
}> = ({ themeMode, width = 24, height = 24 }) => {
  const dispatch = useDispatch();
  const userStore = useSelector((state: RootState) => state.user);
  const loggedIn = userStore.isLoggedIn;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const optimisticLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    dispatch(logout());
  };

  const handleLogout = () => {
    optimisticLogout();
    // logoutRequest();
    handleClose();
  };

  useEffect(() => {
    if (loggedIn) {
      setAnchorEl(null);
    }
  }, [userStore]);

  const UserAvatar = () => (
    <Avatar
      sx={{
        width: 24,
        backgroundColor: "transparent",
        height: 24,
        borderWidth: 2,
        color: themeMode ? "#5A1073" : "#21E3CE",
        borderColor: themeMode ? "#5A1073" : "#21E3CE",
      }}
    >
      {`${userStore?.user?.nickname}`[0].toUpperCase() ?? "X"}
    </Avatar>
  );

  return (
    <ThemeProviderMUI themeMode={false}>
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {!loggedIn ? (
            <Tooltip title="Zaloguj się lub załóż konto">
              <Link to="/login">
                <UserIcon
                  stroke={themeMode ? "#5A1073" : "#21E3CE"}
                  fill={themeMode ? "#5A1073" : "#21E3CE"}
                  height={height}
                  width={width}
                />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="Twoje konto">
              <IconButton
                onClick={handleClick}
                size="small"
                // sx={{ml: 2}}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <UserAvatar />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,

              sx: {
                borderRadius: "8px",
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 24,
                  height: 24,
                  ml: -0.5,
                  mr: 1,
                },
                "& .MuiList-root": {
                  py: 1,
                  bgcolor: themeMode ? "background.paper" : "black",
                  color: themeMode ? "black" : "white",
                  borderRadius: "8px",
                  "& .MuiMenuItem-root": {
                    py: 1,
                    px: 2.5,
                    bgcolor: themeMode ? "background.paper" : "black",
                    fontFamily: "Urbanist",
                    textTransform: "uppercase",
                    "&:active": {
                      bgcolor: themeMode ? "background.paper" : "black",
                      color: themeMode ? "black" : "white",
                    },
                    "&:hover": {
                      fontWeight: 600,
                      color: themeMode ? "#5A1073" : "#21E3CE",
                    },
                  },
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 15,
                  height: 10,
                  bgcolor: themeMode ? "background.paper" : "black",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/profile" className="flex gap-2 items-center">
              <UserAvatar /> Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/profile/news" className="flex gap-2 items-center">
              Newsa
            </Link>
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>
						<Link to='/notification'>powiadomienie</Link>
					</MenuItem> */}
          <MenuItem onClick={handleClose}>Ustawienia</MenuItem>
          <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
        </Menu>
      </>
    </ThemeProviderMUI>
  );
};
