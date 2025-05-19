/* eslint-disable */

"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface TextareaUpperFirstWordProps
  extends React.ComponentProps<"textarea"> {}

export default function TextareaUpperFirstWord({
  ...props
}: TextareaUpperFirstWordProps) {
  const [value, setValue] = useState(props.value || "");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let textareaValue = event.target.value;
    textareaValue =
      textareaValue.charAt(0).toUpperCase() + textareaValue.slice(1);
    setValue(textareaValue);
  };

  return <Textarea {...props} value={value} onChange={handleChange} />;
}
