import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import {ReactComponent as UserIcon} from '../../assets/svg/userIcon.svg';

import {ThemeProviderMUI} from '../TextField/Select';
import {Button} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import { logout } from '../../reducers/user';
import { deleteCookie } from '../../utils/auth';
import { useEffect } from 'react';
import { logoutRequest } from '../../Constant/api-requests';

export const AccountMenu: React.FC<{
	themeMode?: boolean;
}> = ({themeMode}) => {
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
		deleteCookie('accessToken');
		deleteCookie('refreshToken');
		dispatch(logout());
	}

	const handleLogout = () => {
		optimisticLogout();
		logoutRequest();
		handleClose();
	};

	useEffect(() => {
		if (loggedIn) {
			setAnchorEl(null);
		}
	}, [userStore]);

	return (
		<ThemeProviderMUI themeMode={false}>
			<>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						textAlign: 'center',
					}}
				>
					{!loggedIn ? (
						<Tooltip title='Zaloguj się lub załóż konto'>
							<Link to='/login'>
								<UserIcon
									stroke={themeMode ? '#5A1073' : '#21E3CE'}
									fill={themeMode ? '#5A1073' : '#21E3CE'}
									height={36}
									width={36}
								/>
							</Link>
						</Tooltip>
					) : (
						<Tooltip title='Twoje konto'>
							<IconButton
								onClick={handleClick}
								size='small'
								// sx={{ml: 2}}
								aria-controls={
									open ? 'account-menu' : undefined
								}
								aria-haspopup='true'
								aria-expanded={open ? 'true' : undefined}
							>
								<Avatar sx={{width: 32, backgroundColor: 'transparent',
									 height: 32, borderWidth: 2, color: themeMode ? '#5A1073' : '#21E3CE', borderColor: themeMode ? '#5A1073' : '#21E3CE'}}>
									{`${userStore?.user?.nickname}`[0].toUpperCase() ??
										'X'}
								</Avatar>
							</IconButton>
						</Tooltip>
					)}
				</Box>
				<Menu
					anchorEl={anchorEl}
					id='account-menu'
					open={open}
					onClose={handleClose}
					onClick={handleClose}
					slotProps={{
						paper: {
							elevation: 0,
							sx: {
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
								mt: 1.5,
								'& .MuiAvatar-root': {
									width: 32,
									height: 32,
									ml: -0.5,
									mr: 1,
								},
								'&::before': {
									content: '""',
									display: 'block',
									position: 'absolute',
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: 'background.paper',
									transform: 'translateY(-50%) rotate(45deg)',
									zIndex: 0,
								},
							},
						},
					}}
					transformOrigin={{horizontal: 'right', vertical: 'top'}}
					anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
				>
					<MenuItem onClick={handleClose}>
					<Avatar sx={{width: 32, height: 32, borderWidth: 2, borderColor: themeMode ? '#5A1073' : '#21E3CE'}}>
									{`${userStore?.user?.nickname}`[0].toUpperCase() ??
										'X'}
								</Avatar> Profil
					</MenuItem>
					{/* <MenuItem onClick={handleClose}>
						<Avatar /> My account
					</MenuItem> */}
					<Divider />
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							{/* <PersonAdd fontSize="small" /> */}
						</ListItemIcon>
						Tablica
					</MenuItem>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							{/* <Settings fontSize="small" /> */}
						</ListItemIcon>
						Ustawienia
					</MenuItem>
					<MenuItem onClick={handleLogout}>
						<ListItemIcon>
							{/* <Logout fontSize="small" /> */}
						</ListItemIcon>
						Wyloguj
					</MenuItem>
				</Menu>
			</>
		</ThemeProviderMUI>
	);
};
