import { Link } from "react-router-dom";
import { IComment } from "../../lib/types/comment";
import { formatDistanceToNow } from "date-fns";
import { Reply, Trash2, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

type ICommentItemProps = {
  comment: IComment;
  handleLikeUnlike: (commentId: string) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  showReplies: (id: string) => void;
  handleDelete: (commentId: string, commentUserId: string) => void;
  handleSubmitReply: (e: React.FormEvent, parentId: string) => void;
  formData: { content: string; website: string };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isSubmitting: boolean;
  isDeleteLoading: boolean;
  currentDeleteId: string;
};

const CommentItem = ({
  comment,
  handleLikeUnlike,
  replyingTo,
  setReplyingTo,
  showReplies,
  handleDelete,
  handleSubmitReply,
  formData,
  handleInputChange,
  isSubmitting,
  isDeleteLoading,
  currentDeleteId,
}: ICommentItemProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { mode: themeMode } = useSelector(
    (state: RootState) => state.themeMode
  );

  const bgClass = themeMode ? "bg-white" : "bg-gray-900";
  const textClass = themeMode ? "text-gray-900" : "text-gray-100";
  const textMutedClass = themeMode ? "text-gray-500" : "text-gray-400";
  const borderClass = themeMode ? "border-gray-100" : "border-gray-700";
  const inputBgClass = themeMode
    ? "bg-white !text-black"
    : "bg-gray-800 !text-white";
  const inputBorderClass = themeMode ? "border-gray-300" : "border-gray-600";
  const buttonHoverClass = themeMode
    ? "hover:bg-blue-700"
    : "hover:bg-blue-800";

  return (
    <div
      className={`${bgClass} rounded-lg shadow-sm p-6 border ${borderClass} comment-item`}
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium overflow-hidden">
          {comment.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium ${textClass}`}>{comment.name}</h3>
            <span className={`text-sm ${textMutedClass}`}>
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {comment.website && (
            <a
              href={
                comment.website.startsWith("http")
                  ? comment.website
                  : `https://${comment.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2 inline-block`}
            >
              {comment.website}
            </a>
          )}

          <div className={`mt-2 ${textClass} whitespace-pre-line`}>
            {comment.content}
          </div>

          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => handleLikeUnlike(comment._id)}
                className={`reply-button inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-full border border-transparent hover:border-current transition-all ${
                  comment.likes?.some((like) => like.user === user?._id)
                    ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <Heart
                  className={`h-4 w-4 mr-1.5 ${comment.likes?.some((like) => like.user === user?._id) ? "fill-current" : ""}`}
                />
                {comment.likes?.length || 0}
              </button>

              <button
                onClick={() =>
                  setReplyingTo(replyingTo === comment._id ? null : comment._id)
                }
                className="reply-button inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1.5 rounded-full border border-transparent hover:border-current transition-all"
              >
                <Reply className="h-4 w-4 mr-1.5" />
                Reply
              </button>

              {comment.replies.length > 0 && (
                <button
                  onClick={() => showReplies(comment._id)}
                  className="reply-button inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1.5 rounded-full border border-transparent hover:border-current transition-all"
                >
                  Replies ({comment.replies.length})
                </button>
              )}
            </div>
            {(user?.role === "admin" || comment.user === user?._id) && (
              <button
                disabled={isDeleteLoading}
                onClick={() => handleDelete(comment._id, comment.user)}
                className="reply-button inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-full border border-transparent hover:border-current transition-all"
              >
                {isDeleteLoading && currentDeleteId === comment._id ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600 dark:text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete
                  </>
                )}
              </button>
            )}
          </div>

          {replyingTo === comment._id && (
            <form
              onSubmit={(e) => handleSubmitReply(e, comment._id)}
              className={`max-w-[700px] mt-4 ${themeMode ? "bg-gray-50" : "bg-gray-800"} p-4 rounded-md shadow-sm`}
            >
              <div className="mb-4">
                <label
                  htmlFor={`reply-content-${comment._id}`}
                  className={`block text-sm font-medium ${textClass} mb-1`}
                >
                  Reply <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={`reply-content-${comment._id}`}
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your reply..."
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  rows={3}
                  required
                  disabled={!user?._id || isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor={`reply-website-${comment._id}`}
                  className={`block text-sm font-medium ${textClass} mb-1`}
                >
                  Website
                </label>
                <input
                  type="url"
                  id={`reply-website-${comment._id}`}
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="https://yourwebsite.com"
                  disabled={!user?._id || isSubmitting}
                />
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className={`px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  Cancel
                </button>
                {user?._id ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center transition-all`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Reply"
                    )}
                  </button>
                ) : (
                  <Link
                    to={`/login`}
                    className={`px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all`}
                  >
                    Login to reply
                  </Link>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
