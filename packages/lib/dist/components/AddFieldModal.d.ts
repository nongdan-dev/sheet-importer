import { CustomType } from '../types';
import React from 'react';
interface AddFieldModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddField: (field: CustomType) => Promise<void>;
    systemFields: CustomType[];
    setSystemFields: (fields: CustomType[]) => void;
}
export declare const AddFieldModal: React.FC<AddFieldModalProps>;
export {};
//# sourceMappingURL=AddFieldModal.d.ts.map