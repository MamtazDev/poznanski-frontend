import { PageBasicProps } from "../../AppMain";
import avatar from "../../assets/png/profileImage2.png";

const CommentSection: React.FC<PageBasicProps> = ({ themeMode }) => {
  return (
    <div className="mt-12">
      {/* Comments Header */}
      <div className="flex justify-between items-center mb-8">
        <h2
          className="text-2xl font-bold"
          style={{ color: themeMode ? "black" : "#fff" }}
        >
          Comments
        </h2>
        <button
          className="font-semibold"
          style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}
        >
          View All Comments
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {[1, 2,3,4].map((_, index) => (
          <div key={index} className="flex gap-4">
            {/* User Avatar */}
            <img
              src={avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            {/* Comment Content */}
            <div>
              <div
                className="p-4 rounded-lg w-full"
                style={{
                  backgroundColor: themeMode ? "#F5F5F5" : "#242526",
                  color: themeMode ? "#333" : "#FFF",
                }}
              >
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam
                  nisi, cras neque, lorem vel vulputate vitae aliquam. Pretium
                  tristique nisi, ut commodo fames.
                </p>
              </div>
              {/* Action Buttons */}
              <div className="mt-2 flex items-center gap-4 text-sm">
                <button
                className="font-medium"
                  style={{
                    color: themeMode ? "#5A1073" : "#3BD6C6",
                  }}
                >
                  Like
                </button>
                <button
                 className="font-medium"
                  style={{
                    color: themeMode ? "#5A1073" : "#3BD6C6",
                  }}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Section */}
      <div className="mt-12">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: themeMode ? "black" : "#fff" }}
        >
          Add Comment
        </h3>
        {/* Input Fields */}
        <div className="space-y-4">
          <div className="lg:flex gap-6">
            <div className="w-full space-y-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium"
                style={{ color: themeMode ? "black" : "#fff" }}
              >
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 rounded-md text-sm focus:outline-none"
                style={{
                  backgroundColor: themeMode ? "#F5F5F5" : "#242526",
                  color: themeMode ? "#333" : "#FFF",
                }}
              />
              <label
                htmlFor="website"
                className="block text-sm font-medium"
                style={{ color: themeMode ? "black" : "#fff" }}
              >
                Website
              </label>
              <input
                type="text"
                placeholder="Enter your website"
                className="w-full p-3 rounded-md text-sm focus:outline-none"
                style={{
                  backgroundColor: themeMode ? "#F5F5F5" : "#242526",
                  color: themeMode ? "#333" : "#FFF",
                }}
              />
              <label
                htmlFor="Email"
                className="block text-sm font-medium"
                style={{ color: themeMode ? "black" : "#fff" }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-md text-sm focus:outline-none"
                style={{
                  backgroundColor: themeMode ? "#F5F5F5" : "#242526",
                  color: themeMode ? "#333" : "#FFF",
                }}
              />
            </div>
            <div className="w-full">
            <label
              htmlFor="comment"
              className="block text-sm font-medium mb-2"
              style={{ color: themeMode ? "black" : "#fff" }}
            >
              Comment
            </label>
            <textarea
              placeholder="Type your comment..."
              className="w-full p-3 rounded-md text-sm focus:outline-none"
              rows={10}
              style={{
                backgroundColor: themeMode ? "#F5F5F5" : "#242526",
                color: themeMode ? "#333" : "#FFF",
              }}
            ></textarea>
          </div>
          </div>


          <button
            className="px-6 py-3 rounded-md font-medium text-sm"
            style={{
              backgroundColor: themeMode ? "#5A1073" : "#3BD6C6",
              color: "#FFF",
            }}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
