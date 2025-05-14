import { CustomType } from '../types';
import { normalizeString } from '../utils/utils';
import React, { useState } from 'react';


interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (field: CustomType) => Promise<void>;
  systemFields: CustomType[];
  setSystemFields: (fields: CustomType[]) => void;
}

export const AddFieldModal: React.FC<AddFieldModalProps> = ({
  isOpen,
  onClose,
  onAddField,
  systemFields,
  setSystemFields,
}) => {
  const [newField, setNewField] = useState<Omit<CustomType, 'id'>>({
    label: '',
    validate: undefined,
    display: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newField.label.trim()) return;

    setIsSubmitting(true);
    try {
      const fieldId = normalizeString(newField.label);

      const newCustomField: CustomType = {
        ...newField,
        id: fieldId,
        validate: newField.validate || ((value: string) => ({ value })),
        display: newField.display || ((value) => String(value)),
      };

      await onAddField(newCustomField);

      setSystemFields([...systemFields, newCustomField]);

      setNewField({
        label: '',
        validate: undefined,
        display: undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to add field:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add New Field</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
            <input
              type="text"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="e.g., Quantity"
              required
            />
          </div>

          {/* Đã bỏ phần match keywords và threshold */}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
            disabled={!newField.label.trim() || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Field'}
          </button>
        </div>
      </div>
    </div>
  );
};
