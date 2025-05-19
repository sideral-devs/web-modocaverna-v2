/* eslint-disable */

"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface InputUpperFirstWordProps extends React.ComponentProps<"input"> {}

export default function InputUpperFirstWord({
  ...props
}: InputUpperFirstWordProps) {
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
    inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    setValue(inputValue);
  };

  return <Input {...props} value={value} onChange={handleChange} />;
}
