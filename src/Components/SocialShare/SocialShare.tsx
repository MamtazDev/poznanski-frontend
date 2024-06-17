import React, {useEffect, useState} from 'react';
import {
	FacebookShareButton,
	WhatsappShareButton,
	FacebookIcon,
	WhatsappIcon,
	FacebookMessengerShareButton,
	FacebookMessengerIcon, // Add this line to import the FacebookMessengerIcon component
} from 'react-share';
import {trackShare} from '../../utils/analytics';
import Modal from '../Modals';
import {ReactComponent as ShareIcon} from '../../assets/svg/shareButton.svg';


const SocialShare: React.FC<{
	url: string;
	title: string;
	themeMode: boolean;
	// isOpen: boolean;
	// setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({url, title, themeMode}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => setIsVisible(true), 50); // slight delay to trigger CSS transition
		} else {
			setIsVisible(false);
		}
	}, [isOpen]);

	const handleShare = (platform: string) => {
		trackShare(platform);
		setIsVisible(false);
        setIsOpen(false)
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={() => {
                setIsOpen(false)
            }}>
				<div
					  className={`absolute top-1/2 left-1/2 flex gap-4 duration-500 transform ${
                        isVisible ? '-translate-x-full opacity-100' : ' translate-x-96 opacity-0'
                      }`}
				>
					<FacebookShareButton
						url={url}
						onClick={() => handleShare('Facebook')}
					>
						<FacebookIcon size={32} round />
					</FacebookShareButton>
					<WhatsappShareButton
						url={url}
						title={title}
						onClick={() => handleShare('Whatsapp')}
					>
						<WhatsappIcon size={32} round />
					</WhatsappShareButton>
					<FacebookMessengerShareButton
						url={process.env.REACT_APP_URL + url}
						title={title}
						onClick={() => handleShare('Messenger')}
						appId={`${process.env.REACT_APP_FB_APP_ID}`}
					>
						<FacebookMessengerIcon size={32} round />
					</FacebookMessengerShareButton>
				</div>
			</Modal>

			<button

				className={`float-right w-full mt-6 justify-center py-2 flex ${themeMode ? 'right-card' : 'right-card-dark'} gap-6 ${themeMode ? `tag-card-title` : `tag-card-title-dark hover: tag-card-title`}`}
				onClick={() => setIsOpen(true)}
			>
				<ShareIcon fill={themeMode ? '#5A1073' : ''} /> Udostępnij
			</button>
		</>
	);
};

export default SocialShare;
