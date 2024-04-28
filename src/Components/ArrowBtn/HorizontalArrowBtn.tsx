import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

export default function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick?: (e?: any) => void;
}) {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const disabled = props.disabled ? "hidden" : "";
  return (
    <div
      onClick={props.onClick}
      className={`arrow ${
        props.left ? "arrow--left" : "arrow--right"
      } ${disabled}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        {props.left &&
          (themeMode ? (
            <path
              d="M13.3333 22.6663L20 15.9997L13.3333 9.33301"
              stroke="#252733"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M13.3333 22.6673L20 16.0007L13.3333 9.33398"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        {!props.left &&
          (themeMode ? (
            <path
              d="M13.3333 22.6663L20 15.9997L13.3333 9.33301"
              stroke="#252733"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M13.3333 22.6673L20 16.0007L13.3333 9.33398"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
      </svg>
    </div>
  );
}
