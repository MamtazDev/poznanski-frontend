import { PageBasicProps } from "../../AppMain";
import Layout from "../../Components/Layout";
import { FaUserCheck, FaUserClock, FaMusic, FaBell, FaCompactDisc } from "react-icons/fa";

interface NotificationItem {
  id: number;
  type: "verify" | "wait_verify" | "album" | "song" | "general";
  message: string;
  artistName?: string;
  timestamp: string;
  isRead: boolean; // New property to track read/unread status
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    type: "verify",
    message: "Your account has been successfully verified!",
    timestamp: "2 min ago",
    isRead: false, // Unread notification
  },
  {
    id: 2,
    type: "wait_verify",
    message: "Your account registration is successful. Please wait for verification.",
    timestamp: "10 min ago",
    isRead: false, // Unread notification
  },
  {
    id: 3,
    type: "album",
    message: "New album 'Eternal Echoes' has been released!",
    timestamp: "30 min ago",
    isRead: true, // Read notification
  },
  {
    id: 4,
    type: "song",
    message: "Artist John Doe added a new song: 'Lost in Time'.",
    artistName: "John Doe",
    timestamp: "1 hr ago",
    isRead: false, // Unread notification
  },
  {
    id: 5,
    type: "general",
    message: "Your subscription is about to expire in 3 days.",
    timestamp: "1 day ago",
    isRead: true, // Read notification
  },
];

const Notification: React.FC<PageBasicProps> = ({ themeMode }) => {
  return (
    <Layout themeMode={themeMode}>
      <div className={`flex justify-center `}>
        <div className="container md:mt-12 mt-8 p-6 w-full">
          <h2 className={`text-2xl font-bold ${themeMode ? "text-gray-900" : "text-white"}`}>
            Notifications
          </h2>
          <div className="mt-4 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center p-4 rounded-lg shadow-md
                   ${themeMode ? " text-gray-800 bg-[#FFFFFF] " : "text-white bg-[#252733]" }
                    ${!themeMode ? "hover:shadow-[0px_0px_11.4px_4px_rgba(59,214,198,0.10)]" : "hover:shadow-[0px_0px_11.457px_0px_rgba(138,138,138,0.24)]"}
                   `}
              >
                <div className="mr-4 cursor-pointer">
                  {notification.type === "verify" && <FaUserCheck className="text-green-500 text-2xl" />}
                  {notification.type === "wait_verify" && <FaUserClock className="text-yellow-500 text-2xl" />}
                  {notification.type === "album" && <FaCompactDisc className="text-blue-500 text-2xl" />}
                  {notification.type === "song" && <FaMusic className="text-purple-500 text-2xl" />}
                  {notification.type === "general" && <FaBell className="text-gray-500 text-2xl" />}
                </div>
                <div>
                  <p className={`lg:text-xl text-lg cursor-pointer ${notification.isRead ? "font-medium" : "font-bold"}`}>
                    {notification.message}
                  </p>
                  <span className="lg:text-sm text-xs text-gray-500">{notification.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notification;
