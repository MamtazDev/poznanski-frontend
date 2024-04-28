import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";
import { Avatar } from "@chakra-ui/react";

interface CommentProps {
  commentData: { id: string; img: string; comment: string }[];
}

const Comment: React.FC<CommentProps> = (props) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [type, setType] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setType(true);
      } else {
        setType(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className={`w-full`}>
        <div className={`${themeMode ? "" : ""} flex justify-between`}>
          <div
            className={`${themeMode ? "comment-title" : "comment-title-dark"} text-left`}
            style={{ fontSize: type ? "18px" : "20px" }}
          >
            Comments
          </div>
          <div
            className={`${themeMode ? "view-all-btn" : "view-all-btn-dark"} text-left`}
            style={{ fontSize: type ? "14px" : "16px" }}
          >
            View All Comments
          </div>
        </div>
        {props.commentData &&
          props.commentData.map((item, idx) => (
            <div className={`flex md:gap-3 gap-2`}>
              <Avatar src={item.img} />
              <div className="flex flex-col">
                <div
                  className={`${themeMode ? "comment-content" : "comment-content-dark"} text-left w-full`}
                >
                  {item.comment || "No Comment"}
                </div>
                <div className="flex gap-3 md:mt-1.5 mt-2">
                  <div
                    className={`${themeMode ? "comment-reply-btn" : "comment-reply-btn-dark"}`}
                  >
                    Like
                  </div>
                  <div
                    className={`${themeMode ? "comment-reply-btn" : "comment-reply-btn-dark"}`}
                  >
                    Reply
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Comment;
