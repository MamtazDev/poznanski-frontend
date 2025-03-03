import React, {
  createContext,
  useEffect,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { useDispatch } from "react-redux";
import { apiBaseUrl } from "../Constant/config";
import { setNotifications } from "../reducers/NotificationReducer";

interface IUser {
  _id: string;
  email: string;
  role: string;
}

interface PaginationState {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Define the context value type
interface SSEContextType {
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
}

// Create context with default value
export const SSEContext = createContext<SSEContextType>({
  pagination: {
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  },
  setPagination: () => {},
});

// Props type for the provider
interface SSEProviderProps {
  children: ReactNode;
}

const SSEProvider: React.FC<SSEProviderProps> = ({ children }) => {
  const userStore = useSelector((state: RootState) => state.user);
  const { notifications } = useSelector(
    (state: RootState) => state.notifications
  );

  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });

  const dispatch = useDispatch();

  const user: IUser = userStore.user as IUser;

  const getMyNotifications = async (
    userId: string,
    page: number,
    limit: number
  ) => {
    const response = await fetch(
      `${apiBaseUrl}/notification/my-notifications/${userId}?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    if (data?.success && data?.data) {
      dispatch(setNotifications(data.data));
      if (data.pagination) {
        setPagination(data.pagination);
      }
    }
  };

  useEffect(() => {
    let eventSource: EventSource | null = null;
    if (user && user._id) {
      eventSource = new EventSource(`${apiBaseUrl}/sse-connect/${user._id}`, {
        withCredentials: true,
      });

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "notification") {
          getMyNotifications(user._id, pagination.page, pagination.limit);
        }
      };
    }

    if (user && user._id) {
      getMyNotifications(user._id, pagination.page, pagination.limit);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      const debounceTimer = setTimeout(() => {
        getMyNotifications(user._id, pagination.page, pagination.limit);
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [pagination.page, pagination.limit, user?._id]);

  const contextValue: SSEContextType = {
    pagination,
    setPagination,
  };

  return (
    <SSEContext.Provider value={contextValue}>{children}</SSEContext.Provider>
  );
};

export default SSEProvider;
