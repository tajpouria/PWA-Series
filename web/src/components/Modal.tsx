import * as React from "react";

import { Modal } from "./Elements";

interface Props {
  show: boolean;
  bgColor?: string;
}

export const ModalContainer: React.FC<Props> = ({
  children,
  show,
  bgColor
}) => {
  return (
    <Modal show={show} bgColor={bgColor || "#ffffff"}>
      {children}
    </Modal>
  );
};
