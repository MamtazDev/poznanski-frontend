import * as React from "react";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { purple } from "@mui/material/colors";
import { ThemeProviderMUI } from "../TextField/Select";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { getIconsColor } from "../Layout/NavBar";
import {
  ArticleToDisplay,
  Comment as CommentWithReplies,
  CommentsSection,
} from "../../Pages/Home/NewsContent/Carousel";
import { get } from "lodash";
import { useEffect, useRef } from "react";

interface ActionButtonProps extends ButtonProps {
  themeMode?: boolean;
}

interface ActionButtonProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
  reverted?: boolean; // Optional themeMode prop
}

function rippleEffect(event: MouseEvent) {
  const btn = event.currentTarget as HTMLButtonElement;
  const circle = document.createElement("span");
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - btn.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - btn.getBoundingClientRect().top - radius}px`;
  circle.classList.add("ripple");

  const ripple = btn.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  btn.appendChild(circle);
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  reverted,
  fixedHeight,
  ...props
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    const handleClick = (event: MouseEvent) => {
      rippleEffect(event);
    };

    btn?.addEventListener("click", handleClick as unknown as EventListener);

    return () => {
      btn?.removeEventListener(
        "click",
        handleClick as unknown as EventListener
      );
    };
  }, []);

  const theme = `custom-button${(reverted ? !themeMode : themeMode) ? "-light" : ""}`;

  return (
    <button
      ref={buttonRef}
      {...props}
      className={`${theme}${reverted ? "-reversed" : ""} shadow-lg ${fixedHeight ? "max-h-[36px] max-w-[138px]" : ""} ${!themeMode ? `border ${reverted ? "border-transparent" : "border-transparent"}` : "border border-black"}`}>
      {children}
    </button>
  );
};

// export const CustomizedButtons: React.FC<{onClick: (value: React.SetStateAction<CommentWithReplies[]>) => void}> = ({onClick}) => {
// 	const themeMode = useSelector((state: RootState) => state.themeMode.mode);
// 	return (
// 		<ThemeProviderMUI themeMode={false}>
// 			<Stack className='w-full' justifyContent={'space-between'} spacing={1} direction='row'>
// 				{/* <ColorButton onClick={() => onClick()} className='' variant='outlined'>
// 					Dodaj swój komentarz
// 				</ColorButton>
// 				<ColorButton type='submit' className='' variant='outlined'>
// 					Odpowiedz
// 				</ColorButton> */}
// 			</Stack>
// 		</ThemeProviderMUI>
// 	);
// };
