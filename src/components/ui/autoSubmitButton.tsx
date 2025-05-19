/* eslint-disable */

"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface AutoSubmitButtonProps extends ButtonProps {}

export default function AutoSubmitButton({
  children,
  ...props
}: AutoSubmitButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && buttonRef.current) {
        event.preventDefault();
        buttonRef.current.click();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <Button ref={buttonRef} {...props}>
      {children}
    </Button>
  );
}
