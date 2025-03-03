import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface INotification {
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

interface INotificationState {
  notifications: INotification[];
}

const initialState: INotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
    },
  },
});

export const { setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
