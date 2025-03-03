import React, { createContext, useEffect, useRef, ReactNode } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../reducers";
import { useDispatch } from "react-redux";
import { setNotifications } from "../reducers/NotificationReducer";

const SOCKET_URL = "http://localhost:8000";

// Define user type (customize based on your user state)
// interface IUserStore {
//   user: {
//     _id: string;
//     email: string;
//     role: string;
//   };
//   isLoggedIn: boolean;
// }

interface IUser {
  _id: string;
  email: string;
  role: string;
}

// Define the context value type
interface SocketContextType {
  SOCKET: Socket | null;
}

// Create context with default value
export const SocketContext = createContext<SocketContextType>({
  SOCKET: null,
});

// Props type for the provider
interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const userStore = useSelector((state: RootState) => state.user);
  const { notifications = [] } = useSelector(
    (state: RootState) => state.notifications
  );
  const socket = useRef<Socket | null>(null);
  const dispatch = useDispatch();

  const user: IUser = userStore.user as IUser;

  const getMyNotifications = async (userId: string) => {
    const response = await fetch(
      `${SOCKET_URL}/api/notification/my-notifications/${userId}`
    );
    const data = await response.json();
    if (data?.success && data?.data) {
      dispatch(setNotifications(data.data));
    }
  };

  console.log(notifications);

  useEffect(() => {
    // Initialize socket
    socket.current = io(SOCKET_URL, {
      withCredentials: true,
    });

    const intervalId = setInterval(() => {
      if (user && user._id) {
        console.log("call", user._id);
        socket.current?.emit("addUser", { id: user._id });
      }
    }, 10000);

    if (user && user._id) {
      getMyNotifications(user._id);
    }

    // receive notification
    socket.current.on("notification", (data: any) => {
      console.log("notification from socket: ", data);
      if (data) {
        getMyNotifications(user._id);
      }
    });

    return () => {
      clearInterval(intervalId);
      socket.current?.disconnect();
    };
  }, [user]);

  const contextValue: SocketContextType = {
    SOCKET: socket.current,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
