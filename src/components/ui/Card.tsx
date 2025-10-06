// src/components/ui/Card.tsx
import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  shadow = true,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "rounded-xl bg-white p-6",
        shadow && "shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
