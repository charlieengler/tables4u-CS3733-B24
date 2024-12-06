import * as React from "react";

interface Props {
  visible: boolean;
  text: string;
}

export default function NotificationBox({visible,  text}: Props): JSX.Element {

  if (!visible) {
    return <></>;
  }

  return <div className="notification">{text}</div>;
}