import React, { ReactNode } from "react";

import { Link, useNavigate } from "react-router-dom";

export const DelayedLink: React.FC<{to: string, children: ReactNode, state: string }> = ({ to, children, state, ...props }) => {
  const navigate = useNavigate();

  const delayAndGo = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    // Do something..

    setTimeout(() => navigate(to), 300);
  }

  return (
    <Link {...props} state={state} to={to} onClick={(e) => delayAndGo(e)}>
      {children}
    </Link>
  );
}