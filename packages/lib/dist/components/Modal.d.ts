import React from 'react';
interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}
export declare const Modal: React.FC<ConfirmModalProps>;
export {};
//# sourceMappingURL=Modal.d.ts.map