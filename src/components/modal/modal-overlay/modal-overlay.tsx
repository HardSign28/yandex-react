import type { ModalOverlayProps } from '@utils/types';

import styles from './modal-overlay.module.css';

const ModalOverlay = ({
  children,
  onClose,
  closeOnOverlay = true,
}: ModalOverlayProps): React.JSX.Element => {
  return (
    <div
      className={styles.modal_overlay}
      aria-hidden={false}
      onMouseDown={(e) => {
        if (!closeOnOverlay) return;
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {children}
    </div>
  );
};

export default ModalOverlay;
