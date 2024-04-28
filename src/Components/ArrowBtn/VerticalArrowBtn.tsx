import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

export default function Arrow(props: {
  disabled: boolean;
  top?: boolean;
  onClick: (e?: any) => void;
  className?: string
}) {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const disabled = props.disabled ? "hidden" : "";
  return (
    <div
      onClick={props.onClick}
      className={`vertical-arrow ${
        props.top ? "arrow--top" : "arrow--bottom"
      } ${disabled} ${props?.className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        {props.top &&
          (themeMode ? (
            <path
              d="M9.33341 13.3333L16.0001 20L22.6667 13.3333"
              stroke="#252733"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M9.33341 13.3333L16.0001 20L22.6667 13.3333"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        {!props.top &&
          (themeMode ? (
            <path
              d="M9.33341 13.3333L16.0001 20L22.6667 13.3333"
              stroke="#252733"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M9.33341 13.3333L16.0001 20L22.6667 13.3333"
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
