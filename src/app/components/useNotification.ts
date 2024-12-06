import { useState } from "react";

export default function useNotification(): {
    visible: boolean;
    text: string;
    showNotification: (text: string, ms: number) => void;
  } {
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");
  
    const showNotification = (text: string, ms: number): void => {
      setVisible(true);
      setText(text);
      setTimeout(() => {
        setVisible(false);
      }, ms);
    };
  
    return {
      visible,
      text,
      showNotification
    };
  }