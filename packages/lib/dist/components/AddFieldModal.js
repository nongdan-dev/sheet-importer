'use strict'
// import React, { useState } from "react";
// import { CustomType } from "../types";
// import { normalizeString } from "@/utils/utils";
// interface AddFieldModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddField: (field: CustomType) => void;
// }
// export const AddFieldModal: React.FC<AddFieldModalProps> = ({
//   isOpen,
//   onClose,
//   onAddField,
// }) => {
//   const [newField, setNewField] = useState<Omit<CustomType, "id">>({
//     label: "",
//     validate: () => ({ error: undefined, value: undefined }),
//     threshold: 0.7,
//     display: (value) => String(value),
//   });
//   const [currentKeyword, setCurrentKeyword] = useState("");
//   const handleAddKeyword = () => {
//     if (currentKeyword.trim()) {
//       setNewField((prev) => ({
//         ...prev,
//         matchKeywords: [...(prev.matchKeywords || []), currentKeyword.trim()],
//       }));
//       setCurrentKeyword("");
//     }
//   };
//   const handleSubmit = () => {
//     if (!newField.label.trim()) return;
//     const fieldId = normalizeString(newField.label);
//     onAddField({
//       ...newField,
//       id: fieldId,
//       validate: (value: string) => {
//         const strValue = String(value).toLowerCase();
//         const hasKeywordMatch =
//           newField.matchKeywords?.some((keyword) =>
//             strValue.includes(keyword.toLowerCase())
//           ) ?? false;
//         return hasKeywordMatch
//           ? { value: strValue }
//           : { error: "No matching keyword found" };
//       },
//       display: newField.display || ((value) => String(value)),
//     });
//     setNewField({
//       label: "",
//       validate: () => ({ error: undefined, value: undefined }),
//       threshold: 0.7,
//       display: (value) => String(value),
//     });
//     setCurrentKeyword("");
//     onClose();
//   };
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md">
//         <h3 className="text-lg font-bold mb-4">Add New Field</h3>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Display Name *
//             </label>
//             <input
//               type="text"
//               value={newField.label}
//               onChange={(e) =>
//                 setNewField({ ...newField, label: e.target.value })
//               }
//               className="w-full p-2 border rounded"
//               placeholder="e.g., Quantity"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Threshold (0-1)
//             </label>
//             <input
//               type="number"
//               min="0"
//               max="1"
//               step="0.1"
//               value={newField.threshold}
//               onChange={(e) =>
//                 setNewField({
//                   ...newField,
//                   threshold: parseFloat(e.target.value),
//                 })
//               }
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Match Keywords
//             </label>
//             <div className="flex">
//               <input
//                 type="text"
//                 value={currentKeyword}
//                 onChange={(e) => setCurrentKeyword(e.target.value)}
//                 className="flex-1 p-2 border rounded-l"
//                 placeholder="e.g., quantity, qty"
//                 onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
//               />
//               <button
//                 onClick={handleAddKeyword}
//                 className="bg-blue-500 text-white px-3 rounded-r"
//               >
//                 Add
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {newField.matchKeywords?.map((kw, index) => (
//                 <span
//                   key={index}
//                   className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center"
//                 >
//                   {kw}
//                   <button
//                     onClick={() =>
//                       setNewField((prev) => ({
//                         ...prev,
//                         matchKeywords: prev.matchKeywords?.filter(
//                           (_, i) => i !== index
//                         ),
//                       }))
//                     }
//                     className="ml-1 text-red-500"
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-end gap-2 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-md"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             disabled={!newField.label.trim()}
//           >
//             Add Field
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
//# sourceMappingURL=AddFieldModal.js.map
