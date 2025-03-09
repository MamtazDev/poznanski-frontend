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

import { useToast } from "@chakra-ui/react";
import CommentItem from "./CommentItem";
import { ActionButton } from "../Button";

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

  const handleDelete = async (commentId: string, commentUserId: string) => {
    if (!commentId) return;

    if (user && (user.role === "admin" || user._id === commentUserId)) {
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
    } else {
      toast({
        title: "You are not authorized to delete this comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  };

  const handleLikeUnlike = async (commentId: string) => {
    if (!user?._id || !commentId) return;
    try {
      const response = await fetch(`${apiBaseUrl}/comment/like/${commentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        await getComments();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
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
          {currentView.map((comment, i) => (
            <CommentItem
              key={i}
              comment={comment}
              handleLikeUnlike={handleLikeUnlike}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              showReplies={showReplies}
              handleDelete={handleDelete}
              handleSubmitReply={handleSubmitReply}
              formData={formData}
              handleInputChange={handleInputChange}
              isSubmitting={isSubmitting}
              isDeleteLoading={isDeleteLoading}
              currentDeleteId={currentDeleteId}
            />
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
            <ActionButton
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
              }}
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
            </ActionButton>
          ) : (
            <Link to={`/login`} className={``}>
              <ActionButton type="button">Login to comment</ActionButton>
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
