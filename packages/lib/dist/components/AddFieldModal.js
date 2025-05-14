var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { normalizeString } from '../utils/utils';
import { useState } from 'react';
export const AddFieldModal = ({ isOpen, onClose, onAddField, systemFields, setSystemFields, }) => {
    const [newField, setNewField] = useState({
        label: '',
        validate: undefined,
        display: undefined,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!newField.label.trim())
            return;
        setIsSubmitting(true);
        try {
            const fieldId = normalizeString(newField.label);
            const newCustomField = Object.assign(Object.assign({}, newField), { id: fieldId, validate: newField.validate || ((value) => ({ value })), display: newField.display || ((value) => String(value)) });
            yield onAddField(newCustomField);
            setSystemFields([...systemFields, newCustomField]);
            setNewField({
                label: '',
                validate: undefined,
                display: undefined,
            });
            onClose();
        }
        catch (error) {
            console.error('Failed to add field:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    });
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg w-full max-w-md", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Add New Field" }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Display Name *" }), _jsx("input", { type: "text", value: newField.label, onChange: (e) => setNewField(Object.assign(Object.assign({}, newField), { label: e.target.value })), className: "w-full p-2 border rounded", placeholder: "e.g., Quantity", required: true })] }) }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 border border-gray-300 rounded-md", disabled: isSubmitting, children: "Cancel" }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300", disabled: !newField.label.trim() || isSubmitting, children: isSubmitting ? 'Adding...' : 'Add Field' })] })] }) }));
};
//# sourceMappingURL=AddFieldModal.js.map