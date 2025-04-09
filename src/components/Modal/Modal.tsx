/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPortal } from "react-dom";
const modalRoot: any = document.getElementById("modal-root");
import styles from "./Modal.module.css";
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: any;
}) => {
  const { modalOverlay, modalContent, modalCloseButton } = styles;
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={modalOverlay}>
      <div className={modalContent}>
        <button onClick={onClose} className={modalCloseButton}>
          Cerrar
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
