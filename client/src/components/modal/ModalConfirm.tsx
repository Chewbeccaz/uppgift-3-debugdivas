import '../../styles/modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalConfirm: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
        return isOpen ? (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    {children}
                    <button onClick={onClose}>I understand</button>
                </div>
            </div>
        ) : null;
    };
  
  export default ModalConfirm;