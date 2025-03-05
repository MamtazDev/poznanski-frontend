import type React from "react";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ChevronRight, Reply, ArrowLeft, Trash2 } from "lucide-react";
import type { RootState } from "../../reducers";
import { apiBaseUrl } from "../../Constant/config";
import type { PostModels } from "../../Constant/api-requests";
import { Link } from "react-router-dom";
import PaginationNP from "./PaginationNP";
import type { IComment } from "../../lib/types/comment";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@chakra-ui/react";

interface CommentFormData {
  content: string;
  website: string;
}

interface IProps {
  postId: string;
  type: PostModels;
}

interface PaginationState {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

export default function Comments({ postId, type }: IProps) {
  const { user } = useSelector((state: RootState) => state.user);
  const { mode: themeMode } = useSelector(
    (state: RootState) => state.themeMode
  );

  const toast = useToast();

  const [comments, setComments] = useState<IComment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState<IComment[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [currentDeleteId, setCurrentDeleteId] = useState<string>("");

  const [formData, setFormData] = useState<CommentFormData>({
    content: "",
    website: "",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const getComments = useCallback(async () => {
    const response = await fetch(
      `${apiBaseUrl}/comment/post/${postId}?page=${pagination.page}&limit=${pagination.limit}`
    );
    const data = await response.json();
    if (data.success === true) {
      setComments(data.data);
      setCurrentView(data.data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    }
  }, [pagination.page, pagination.limit, postId]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim() || !postId || !type || !user?._id) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/comment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.content,
          section: type,
          post: postId,
          user: user._id,
          name: user.nickname || "Anonymous",
          website: formData.website,
          email: user.email || "",
          parentComment: null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await getComments();
        setFormData({ content: "", website: "" });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!formData.content.trim() || !user?._id) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/comment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.content,
          section: type,
          post: postId,
          user: user._id,
          name: user.nickname || "Anonymous",
          website: formData.website,
          email: user.email || "",
          parentComment: parentId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await getComments();
        setFormData({ content: "", website: "" });
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const findCommentById = (
    comments: IComment[],
    id: string
  ): IComment | null => {
    for (const comment of comments) {
      if (comment._id === id) return comment;
      if (comment.replies) {
        const found = findCommentById(comment.replies, id);
        if (found) return found;
      }
    }
    return null;
  };

  const showReplies = (commentId: string) => {
    const comment = findCommentById(comments, commentId);
    if (!comment) return;

    // Add current comment to breadcrumb
    setBreadcrumb((prev) => [...prev, { id: comment._id, name: comment.name }]);

    // Show replies with animation
    setCurrentView([]);
    setTimeout(() => {
      setCurrentView(comment.replies);
    }, 50);
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      // Go to root comments
      setBreadcrumb([]);
      setCurrentView([]);
      setTimeout(() => {
        setCurrentView(comments);
      }, 50);
      return;
    }

    // Navigate to specific breadcrumb level
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);

    // Find the comment for this level
    let targetComments = comments;
    for (let i = 0; i <= index; i++) {
      const comment = findCommentById(comments, newBreadcrumb[i].id);
      if (comment && comment.replies) {
        targetComments = comment.replies;
      }
    }

    setCurrentView([]);
    setTimeout(() => {
      setCurrentView(targetComments);
    }, 50);
  };

  const handleDelete = async (commentId: string) => {
    if (!commentId) return;
    if (!user || user.role !== "admin") {
      toast({
        title: "You are not authorized to delete this comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setCurrentDeleteId(commentId);
    setIsDeleteLoading(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/comment/delete/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (data.success) {
        await getComments();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleteLoading(false);
      setCurrentDeleteId("");
    }
  };

  // Theme classes
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
      className={`py-8 px-4 sm:px-6 ${themeMode ? "bg-gray-50" : "bg-gray-950"} !mt-[100px] overflow-hidden`}
    >
      <h1 className={`text-3xl font-bold mb-8 ${textClass}`}>Comments</h1>

      {/* Breadcrumb Navigation */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto ease-in duration-300">
          <button
            onClick={() => navigateToBreadcrumb(-1)}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium ${
              breadcrumb.length === 0
                ? `bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`
                : textClass
            } rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            All Comments
          </button>

          {breadcrumb.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <ChevronRight className={`h-4 w-4 ${textMutedClass}`} />
              <button
                onClick={() =>
                  index < breadcrumb.length - 1
                    ? navigateToBreadcrumb(index)
                    : null
                }
                className={`px-3 py-1.5 text-sm font-medium ${textClass} rounded-full ${
                  index < breadcrumb.length - 1
                    ? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    : "cursor-default"
                } transition-all`}
              >
                {item.name}'s replies
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Comments List with Animation */}
      <div className="space-y-8">
        <div className="comments-container grid grid-cols-1 gap-3">
          {currentView.map((comment) => (
            <div
              key={comment._id}
              className={`${bgClass} rounded-lg shadow-sm p-6 border ${borderClass} comment-item`}
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium overflow-hidden">
                  {comment.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${textClass}`}>
                      {comment.name}
                    </h3>
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
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment._id ? null : comment._id
                          )
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
                    {user?.role === "admin" && (
                      <button
                        disabled={isDeleteLoading}
                        onClick={() => handleDelete(comment._id)}
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
          ))}
        </div>
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

      {/* Add new comment form */}
      <div
        className={`mt-12 ${bgClass} rounded-lg shadow-sm p-6 border ${borderClass}`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
          Leave a comment
        </h2>
        <form onSubmit={handleSubmitComment} className="max-w-[700px]">
          <div className="mb-4">
            <label
              htmlFor="content"
              className={`block text-sm font-medium ${textClass} mb-1`}
            >
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="main-content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Write your comment here..."
              required
              disabled={!user?._id || isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="website"
              className={`block text-sm font-medium ${textClass} mb-1`}
            >
              Website
            </label>
            <input
              type="url"
              id="main-website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="https://yourwebsite.com"
              disabled={!user?._id || isSubmitting}
            />
          </div>

          {user?._id ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`reply-button px-6 py-3 bg-blue-600 text-white font-medium rounded-md ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center transition-all shadow-sm hover:shadow`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                "Submit Comment"
              )}
            </button>
          ) : (
            <Link
              to={`/login`}
              className={`reply-button px-6 py-3 bg-blue-600 text-white font-medium rounded-md ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center justify-center transition-all shadow-sm hover:shadow`}
            >
              Login to comment
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}

// import type React from "react";

// import { useEffect, useState } from "react";
// import { formatDistanceToNow } from "date-fns";
// import { Reply } from "lucide-react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../reducers";
// import { apiBaseUrl } from "../../Constant/config";
// import type { PostModels } from "../../Constant/api-requests";
// import { Link } from "react-router-dom";
// import PaginationNP from "./PaginationNP";

// interface Comment {
//   content: string;
//   section: string;
//   post: string;
//   user: string;
//   name: string;
//   website: string;
//   email: string;
//   parentComment: string | null;
// }

// interface CommentFormData {
//   content: string;
//   website: string;
// }

// interface IComment extends Comment {
//   _id: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   replies: IComment[];
// }

// interface IProps {
//   postId: string;
//   type: PostModels;
// }

// interface PaginationState {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export default function Comments({ postId, type }: IProps) {
//   const { user } = useSelector((state: RootState) => state.user);
//   const { mode: themeMode } = useSelector(
//     (state: RootState) => state.themeMode
//   );
//   // Sample data based on the provided structure
//   const [comments, setComments] = useState<IComment[]>([]);

//   const [replyingTo, setReplyingTo] = useState<string | null>(null);
//   const [formData, setFormData] = useState<CommentFormData>({
//     content: "",
//     website: "",
//   });

//   const [pagination, setPagination] = useState<PaginationState>({
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//   });

//   const getComments = async () => {
//     // post/:postId
//     const response = await fetch(
//       `${apiBaseUrl}/comment/post/${postId}?page=${pagination.page}&limit=${pagination.limit}`
//     );
//     const data = await response.json();
//     if (data.success === true) {
//       setComments(data.data);
//       if (data.pagination) {
//         setPagination(data.pagination);
//       }
//     }
//   };

//   useEffect(() => {
//     getComments();
//   }, [pagination.page, pagination.limit, postId, type]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmitComment = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.content.trim()) return;

//     if (!postId || !type || !user?._id) return;

//     const newComment: Comment = {
//       content: formData.content,
//       section: type,
//       post: postId,
//       user: user?._id,
//       name: user.nickname || "Anonymous",
//       website: formData.website,
//       email: user.email || "",
//       parentComment: null,
//     };

//     fetch(`${apiBaseUrl}/comment/create`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newComment),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           // You might want to refresh comments here
//           getComments();
//         }
//       })
//       .finally(() => {
//         setFormData({ content: "", website: "" });
//       });
//   };

//   const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
//     e.preventDefault();

//     if (!formData.content.trim()) return;

//     if (!user?._id) {
//       return;
//     }

//     const newReply: Comment = {
//       content: formData.content,
//       section: type,
//       post: postId,
//       user: user._id,
//       name: user.nickname || "Anonymous",
//       website: formData.website,
//       email: user.email || "",
//       parentComment: parentId,
//     };

//     fetch(`${apiBaseUrl}/comment/create`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newReply),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           // You might want to refresh comments here
//           getComments();
//         }
//       })
//       .finally(() => {
//         setFormData({ content: "", website: "" });
//         setReplyingTo(null);
//       });
//   };

//   // Dark mode classes
//   const bgClass = themeMode ? "bg-white" : "bg-gray-900";
//   const textClass = themeMode ? "text-gray-900" : "text-gray-100";
//   const textMutedClass = themeMode ? "text-gray-500" : "text-gray-400";
//   const textContentClass = themeMode ? "text-gray-700" : "text-gray-300";
//   const borderClass = themeMode ? "border-gray-100" : "border-gray-700";
//   const inputBgClass = themeMode
//     ? "bg-white !text-black"
//     : "bg-gray-800 !text-white";
//   const inputBorderClass = themeMode ? "border-gray-300" : "border-gray-600";
//   const buttonHoverClass = themeMode
//     ? "hover:bg-blue-700"
//     : "hover:bg-blue-800";
//   const linkClass = themeMode
//     ? "text-blue-600 hover:text-blue-800"
//     : "text-blue-400 hover:text-blue-300";
//   const replyFormBgClass = themeMode ? "bg-gray-50" : "bg-gray-800";
//   const cancelBtnClass = themeMode
//     ? "text-gray-700 hover:text-gray-900"
//     : "text-gray-300 hover:text-gray-100";
//   return (
//     <div
//       className={`py-8 px-4 sm:px-6 ${themeMode ? "bg-gray-50" : "bg-gray-950"} !mt-[100px]`}
//     >
//       <h1 className={`text-3xl font-bold mb-8 ${textClass}`}>Comments</h1>

//       <div className="space-y-8">
//         {comments.map((comment, i: number) => (
//           <div
//             key={i}
//             className={`${bgClass} rounded-lg shadow-sm p-6 border ${borderClass}`}
//           >
//             <div className="flex items-start gap-4">
//               <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
//                 {/* {comment.name.charAt(0).toUpperCase()} */}
//                 {comment.name.slice(0, 1).toUpperCase()}
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <h3 className={`font-medium ${textClass}`}>{comment.name}</h3>
//                   <span className={`text-sm ${textMutedClass}`}>
//                     {formatDistanceToNow(new Date(comment.createdAt), {
//                       addSuffix: true,
//                     })}
//                   </span>
//                 </div>

//                 {comment.website && (
//                   <a
//                     href={
//                       comment.website.startsWith("http")
//                         ? comment.website
//                         : `https://${comment.website}`
//                     }
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className={`text-sm ${linkClass} mb-2 inline-block`}
//                   >
//                     {comment.website}
//                   </a>
//                 )}

//                 <div className={`mt-2 ${textContentClass} whitespace-pre-line`}>
//                   {comment.content}
//                 </div>

//                 <button
//                   onClick={() =>
//                     setReplyingTo(
//                       replyingTo === comment._id ? null : comment._id
//                     )
//                   }
//                   className={`mt-3 inline-flex items-center text-sm font-medium ${linkClass}`}
//                 >
//                   <Reply className="h-4 w-4 mr-1" />
//                   Reply
//                 </button>

//                 {replyingTo === comment._id && (
//                   <form
//                     onSubmit={(e) => handleSubmitReply(e, comment._id)}
//                     className={`max-w-[700px] mt-4 ${replyFormBgClass} p-4 rounded-md`}
//                   >
//                     <div className="mb-4">
//                       <label
//                         htmlFor="reply-content"
//                         className={`block text-sm font-medium ${textClass} mb-1`}
//                       >
//                         Reply <span className="text-red-500">*</span>
//                       </label>
//                       <textarea
//                         id="reply-content"
//                         name="content"
//                         value={formData.content}
//                         onChange={handleInputChange}
//                         placeholder="Write your reply..."
//                         className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                         rows={3}
//                         required
//                       />
//                     </div>

//                     <div className="mb-4">
//                       <label
//                         htmlFor="reply-website"
//                         className={`block text-sm font-medium ${textClass} mb-1`}
//                       >
//                         Website
//                       </label>
//                       <input
//                         type="url"
//                         id="reply-website"
//                         name="website"
//                         value={formData.website}
//                         onChange={handleInputChange}
//                         className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                         placeholder="https://yourwebsite.com"
//                       />
//                     </div>

//                     <div className="flex justify-end mt-2">
//                       <button
//                         type="button"
//                         onClick={() => setReplyingTo(null)}
//                         className={`px-4 py-2 text-sm font-medium ${cancelBtnClass} mr-2`}
//                       >
//                         Cancel
//                       </button>
//                       {user?._id ? (
//                         <button
//                           type="submit"
//                           className={`px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
//                         >
//                           Reply
//                         </button>
//                       ) : (
//                         <Link
//                           to={`/login`}
//                           className={`px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
//                         >
//                           Login to reply
//                         </Link>
//                       )}
//                     </div>
//                   </form>
//                 )}

//                 {/* Nested replies */}
//                 {comment.replies.length > 0 && (
//                   <div
//                     className={`mt-6 space-y-6 pl-6 border-l-2 ${themeMode ? "border-gray-100" : "border-gray-700"}`}
//                   >
//                     {comment.replies.map((reply) => (
//                       <div key={reply._id} className="relative">
//                         <div className="flex items-start gap-4">
//                           <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm overflow-hidden">
//                             {reply.name.slice(0, 1).toUpperCase()}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-1">
//                               <h3 className={`font-medium ${textClass}`}>
//                                 {reply.name}
//                               </h3>
//                               <span className={`text-sm ${textMutedClass}`}>
//                                 {formatDistanceToNow(
//                                   new Date(reply.createdAt),
//                                   { addSuffix: true }
//                                 )}
//                               </span>
//                             </div>

//                             {reply.website && (
//                               <a
//                                 href={
//                                   reply.website.startsWith("http")
//                                     ? reply.website
//                                     : `https://${reply.website}`
//                                 }
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className={`text-sm ${linkClass} mb-2 inline-block`}
//                               >
//                                 {reply.website}
//                               </a>
//                             )}

//                             <div
//                               className={`mt-2 ${textContentClass} whitespace-pre-line`}
//                             >
//                               {reply.content}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {pagination.totalPages > 1 && (
//         <PaginationNP
//           total={pagination.total}
//           page={pagination.page}
//           limit={pagination.limit}
//           totalPages={pagination.totalPages}
//           onPageChange={(page) => setPagination({ ...pagination, page })}
//         />
//       )}

//       {/* Add new comment form */}
//       <div
//         className={`mt-12 ${bgClass} rounded-lg shadow-sm p-6 border ${borderClass}`}
//       >
//         <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
//           Leave a comment
//         </h2>
//         <form onSubmit={handleSubmitComment} className="max-w-[700px]">
//           <div className="mb-4">
//             <label
//               htmlFor="content"
//               className={`block text-sm font-medium ${textClass} mb-1`}
//             >
//               Comment <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               id="content"
//               name="content"
//               value={formData.content}
//               onChange={handleInputChange}
//               rows={4}
//               className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               placeholder="Write your comment here..."
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label
//               htmlFor="website"
//               className={`block text-sm font-medium ${textClass} mb-1`}
//             >
//               Website
//             </label>
//             <input
//               type="url"
//               id="website"
//               name="website"
//               value={formData.website}
//               onChange={handleInputChange}
//               className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               placeholder="https://yourwebsite.com"
//             />
//           </div>

//           {user?._id ? (
//             <button
//               type="submit"
//               className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-md ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
//             >
//               Submit Comment
//             </button>
//           ) : (
//             <Link
//               to={`/login`}
//               className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-md ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block`}
//             >
//               Login to comment
//             </Link>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }
