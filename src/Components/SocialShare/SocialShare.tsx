import { IoLogoTwitter, IoLogoWhatsapp, IoShareOutline } from "react-icons/io5";
import { BiCommentDetail } from "react-icons/bi";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { FaFacebook } from "react-icons/fa6";

interface SocialShareProps {
	shareUrl: string;
	title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ shareUrl, title }) => {
	const [showShareOptions, setShowShareOptions] = useState(false);
	const themeMode = useSelector((state: RootState) => state.themeMode.mode);

	return (
		<div className="mt-6 flex justify-center relative">
			<div className="flex gap-3">
				{/* Share Button */}
				<button
					className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md hover:bg-purple-100 transition"
					style={{
						color: themeMode ? "#5A1073" : "#2FC4B2",
						backgroundColor: themeMode ? "white" : "#242526",
					}}
					onClick={() => setShowShareOptions(!showShareOptions)}
				>
					<IoShareOutline className="text-lg" />
					<span className="text-sm font-medium">Share</span>
				</button>

				{/* Comment Button */}
				<button
					className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md hover:bg-purple-100 transition"
					style={{
						color: themeMode ? "#5A1073" : "#2FC4B2",
						backgroundColor: themeMode ? "white" : "#242526",
					}}
				>
					<BiCommentDetail className="text-lg" />
					<span className="text-sm font-medium">Comment</span>
				</button>
			</div>

			{/* Social Share Options */}
			{showShareOptions && (
				<div className="absolute top-12 flex gap-2  shadow-md p-2 rounded-lg"
					style={{
						color: themeMode ? "#5A1073" : "#2FC4B2",
						backgroundColor: themeMode ? "white" : "#242526",
					}}>
					<FacebookShareButton url={shareUrl} hashtag="#exampleHashtag">
						<button className="px-2 py-1 text-blue-600 rounded"><FaFacebook className="text-2xl" /></button>
					</FacebookShareButton>
					<TwitterShareButton url={shareUrl} title={title}>
						<button className="px-2 py-1 text-blue-500 rounded">
							<IoLogoTwitter className="text-2xl" />

						</button>
					</TwitterShareButton>
					<WhatsappShareButton url={shareUrl} title={title}>
						<button className="px-2 py-1 text-green-500 rounded"><IoLogoWhatsapp className="text-2xl" />
						</button>
					</WhatsappShareButton>
				</div>
			)}
		</div>
	);
};

export default SocialShare;
