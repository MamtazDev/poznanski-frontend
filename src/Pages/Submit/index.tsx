import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import ContentTitle from "../../Components/ContentTitle";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import Input from "../../Components/TextField/Input";
import Select from "../../Components/TextField/Select";
import Textarea from "../../Components/TextField/Textarea";
import CrudBtn from "../../Components/CrudBtn";
import FolderIcon from "../../assets/png/folder_icon.png";
import "./style.css";

const SubmitPage = () => {
  const [type, setType] = useState<boolean>(false);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [imgData, setImgData] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const description =
    "Submit your news, a news tip, story idea or press release to appear in the newspaper and on the web site. Your email address, phone number and full name are required for publication.";

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file selection dialog
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setEditedData({ ...editedData, profileImg: reader.result });
        setImgData(reader.result ? reader.result.toString() : "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setImgData("");
  };

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
    <div>
      <div className="flex justify-center">
        <div className="container">
          {type ? (
            ""
          ) : (
            <div className="md:mt-12 mt-8">
              <BreadCrumb routeName={["Home", "News", "Submit News"]} />
            </div>
          )}
          <div className="md:mt-7 mt-10">
            <ContentTitle titleType="NEWS" title="Submit News" />
          </div>
          <div
            className={`md:mt-4 mt-2 ${themeMode ? "submit-description-text" : "submit-description-text-dark"}`}
          >
            {description}
          </div>
          <div className="flex flex-col md:flex-row md:mt-12 mt-6 gap-4">
            <div className="flex flex-col gap-4 md:w-8/12 lg:w-9/12 w-full">
              <div className="flex flex-col md:flex-row md:gap-6 gap-4">
                <div className="flex w-full justify-start">
                  <Input label="Title" name="title" type={type} />
                </div>
                <div className="flex w-full">
                  <Select label="Add Tags" data={[]} type={type} />
                </div>
              </div>
              <div className="">
                <Input label={"YouTube Video Link"} name="link" type={type} />
              </div>
              {!type && (
                <div>
                  <Textarea
                    label={`Expanation`}
                    placeholderText="write Your Explanation Here...."
                    type={type}
                    rowNum={type ? 7 : 14}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 md:w-4/12 lg:w-3/12 w-full h-full">
              <div>
                <label
                  className={`block mb-2 label-text text-left ${themeMode ? "text-gray-900" : "text-white"} `}
                  style={{ fontSize: type ? "14px" : "18px" }}
                >
                  Add Image
                </label>
              </div>
              <div
                className={`overflow-hidden ${themeMode ? "image-upload-field-light" : "image-upload-field-dark"}  w-full h-full`}
                style={{ height: type ? "151px" : "458px" }}
              >
                {imgData === "" ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-center">
                        <img src={FolderIcon} alt="no data" />
                      </div>
                      <div
                        className={`${themeMode ? "image-put-text-light" : "image-put-text-dark"}`}
                      >
                        Drop Image Here, Paste Or
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                          style={{ display: "none" }}
                        />
                        <button
                          className={`img-select-btn ${themeMode ? "img-btn-light" : "img-btn-dark"}`}
                          onClick={handleButtonClick}
                        >
                          + Select File
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-full h-full relative">
                    <img src={imgData} alt="" />
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                      />
                      <div
                        className={`rounded-lg opacity-70 ${themeMode ? "image-upload-light-back" : "image-upload-dark-back"}`}
                      >
                        <CrudBtn
                          value=""
                          onClickDelete={handleDelete}
                          onClickEdit={handleButtonClick}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {type && (
              <div>
                <Textarea
                  label={`Expanation`}
                  placeholderText="write Your Explanation Here...."
                  type={type}
                  rowNum={type ? 7 : 14}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;
