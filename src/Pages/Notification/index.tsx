import { PageBasicProps } from "../../AppMain";
import Layout from "../../Components/Layout";
import {
  FaUserCheck,
  FaUserClock,
  FaMusic,
  FaBell,
  FaCompactDisc,
} from "react-icons/fa";
import { RootState } from "../../reducers";
import { useSelector } from "react-redux";
import moment from "moment";
import { apiBaseUrl } from "../../Constant/config";
import { useCallback, useContext, useEffect } from "react";
import { SSEContext } from "../../contextApi/sseContext";
import PaginationNP from "../../Components/common/PaginationNP";
import { useNavigate } from "react-router-dom";
import { INotification } from "../../reducers/NotificationReducer";

/*

{
      _id: '67c2d126b671af8efde5e219',
      user: '67bffa39b425d9760f82b94a',
      from: { _id: '67bdff2ef3750eb8b673eb24', nickname: 'test' },
      title: 'New Artist Comment',
      type: 'Artist',
      targetId: '67c04a045c709c9661b13006',
      targetType: 'album',
      isSeen: true,
      createdAt: '2025-03-01T09:19:34.785Z',
      updatedAt: '2025-03-01T10:34:39.831Z',
      __v: 0,
      post: {
        _id: '67c04a045c709c9661b13006',
        title: 
          'Kahani suno 2.0❤️ (Slowed+Reverb)_Top Bollywood" Lofi Hindi song"Love lofi Mashup #love #lofi#mashup'
      }

*/

const Notification_Types = {
  Event: "Event",
  Tvradio: "Tvradio",
  Material: "Material",
  News: "News",
  Album: "Album",
  Artist: "Artist",
  General: "General",
};

interface NotificationItem {
  _id: string;
  user: string;
  from: {
    _id: string;
    nickname: string;
  };
  title: string;
  type:
    | "Event"
    | "Tvradio"
    | "Material"
    | "News"
    | "Album"
    | "Artist"
    | "General";
  targetId: string;
  targetType: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
  post?: {
    _id: string;
    title: string;
  };
}

// const notifications: NotificationItem[] = [
//   {
//     id: 1,
//     type: "verify",
//     message: "Your account has been successfully verified!",
//     timestamp: "2 min ago",
//     isRead: false, // Unread notification
//   },
//   {
//     id: 2,
//     type: "wait_verify",
//     message:
//       "Your account registration is successful. Please wait for verification.",
//     timestamp: "10 min ago",
//     isRead: false, // Unread notification
//   },
//   {
//     id: 3,
//     type: "album",
//     message: "New album 'Eternal Echoes' has been released!",
//     timestamp: "30 min ago",
//     isRead: true, // Read notification
//   },
//   {
//     id: 4,
//     type: "song",
//     message: "Artist John Doe added a new song: 'Lost in Time'.",
//     artistName: "John Doe",
//     timestamp: "1 hr ago",
//     isRead: false, // Unread notification
//   },
//   {
//     id: 5,
//     type: "general",
//     message: "Your subscription is about to expire in 3 days.",
//     timestamp: "1 day ago",
//     isRead: true, // Read notification
//   },
// ];

const Notification_Target_Types = {
  News: "news",
  Material: "material",
  Album: "album",
  Radio: "radio",
  Artist: "artist",
  Article: "article",
  Event: "event",
};

const Notification: React.FC<PageBasicProps> = ({ themeMode }) => {
  const { notifications = [] } = useSelector(
    (state: RootState) => state.notifications
  );
  const { pagination, setPagination } = useContext(SSEContext);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  // =seen all notificaton by api
  const seenAllNotification = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/notification/seen-all/${user?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      console.error("Error seen all notification:", { error });
    }
  };

  useEffect(() => {
    seenAllNotification();
  }, []);

  const handleNavigate = (notification: INotification) => {
    if (notification.targetType === Notification_Target_Types.News) {
      navigate(`/news/${notification.targetId}`);
    } else if (notification.targetType === Notification_Target_Types.Album) {
      navigate(`/album/${notification.targetId}`);
    } else if (notification.targetType === Notification_Target_Types.Artist) {
      navigate(`/playlist/${notification.targetId}`);
    } else if (notification.targetType === Notification_Target_Types.Radio) {
      navigate(`/radio/${notification.targetId}`);
    }
  };

  console.log(notifications);

  return (
    <Layout themeMode={themeMode}>
      <div className={`flex justify-center `}>
        <div className="container md:mt-12 mt-8 p-6 w-full">
          <h2
            className={`text-2xl font-bold ${themeMode ? "text-gray-900" : "text-white"}`}
          >
            Notifications
          </h2>
          <div className="mt-4 space-y-4">
            {notifications.map((notification, i) => (
              <div
                onClick={() => handleNavigate(notification)}
                key={i}
                className={`cursor-pointer flex items-center p-4 rounded-lg shadow-md
                   ${themeMode ? " text-gray-800 bg-[#FFFFFF] " : "text-white bg-[#252733]"}
                    ${!themeMode ? "hover:shadow-[0px_0px_11.4px_4px_rgba(59,214,198,0.10)]" : "hover:shadow-[0px_0px_11.457px_0px_rgba(138,138,138,0.24)]"}
                   `}
              >
                <div className="mr-4 cursor-pointer">
                  {notification.type === Notification_Types.News && (
                    <FaUserCheck className="text-green-500 text-2xl" />
                  )}
                  {notification.type === Notification_Types.Material && (
                    <FaUserClock className="text-yellow-500 text-2xl" />
                  )}
                  {notification.type === Notification_Types.Album && (
                    <FaCompactDisc className="text-blue-500 text-2xl" />
                  )}
                  {notification.type === Notification_Types.Artist && (
                    <FaMusic className="text-purple-500 text-2xl" />
                  )}
                  {notification.type === Notification_Types.Tvradio && (
                    <FaMusic className="text-purple-500 text-2xl" />
                  )}
                  {notification.type === Notification_Types.Event && (
                    <FaMusic className="text-indigo-500 text-2xl" />
                  )}
                  {notification.type === Notification_Types.General && (
                    <FaBell className="text-gray-500 text-2xl" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p
                    className={`lg:text-xl text-lg cursor-pointer ${
                      notification.isSeen ? "font-medium" : "font-bold"
                    } transition-colors duration-200 hover:text-blue-500`}
                  >
                    {notification.title}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="lg:text-sm text-xs text-gray-500 hover:text-gray-700 transition-colors">
                      From:{" "}
                      <span className="font-medium">
                        {notification.from.nickname}
                      </span>
                    </p>
                    {notification.post?.title && (
                      <p className="lg:text-sm text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        {notification.post.title}
                      </p>
                    )}
                    <span className="lg:text-sm text-xs text-gray-500 italic">
                      {moment(notification.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <PaginationNP
              total={pagination.total}
              page={pagination.page}
              limit={pagination.limit}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setPagination({ ...pagination, page })}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notification;
