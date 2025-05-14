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
import { AddFieldModal } from '../components/AddFieldModal';
import { FieldList } from '../components/FieldList';
import { Modal } from '../components/Modal';
import { PreviewTable } from '../components/PreviewTable';
import { detectColumnType } from '../utils/utils';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
export const DataMappingStep = forwardRef((props, ref) => {
    const { rowData, columnData, systemFields, mapping, setMapping, setFilteredExcelData, setSystemFields, removeMapping, onNext, fields, setDisableNegative, setDisablePositive, labels, onAddField, } = props;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [mappingWarnings, setMappingWarnings] = useState({});
    useImperativeHandle(ref, () => ({
        triggerRef() {
            setIsConfirmModalOpen(true);
        },
    }));
    // const handleAddField = (newField: CustomType) => {
    //   setSystemFields([...systemFields, newField])
    // }
    useEffect(() => {
        if (setDisablePositive) {
            if (Object.keys(mappingWarnings).length === 0) {
                setDisablePositive(false);
            }
            else {
                setDisablePositive(true);
            }
        }
    }, [mappingWarnings]);
    useEffect(() => {
        const warnings = {};
        const columnUsage = {};
        Object.entries(mapping).forEach(([fieldId, column]) => {
            if (!columnUsage[column]) {
                columnUsage[column] = [];
            }
            columnUsage[column].push(fieldId);
        });
        Object.entries(columnUsage).forEach(([column, fieldIds]) => {
            if (fieldIds.length > 1) {
                warnings[column] = fieldIds;
            }
        });
        setMappingWarnings(warnings);
    }, [mapping]);
    useEffect(() => {
        if (rowData.length === 0 || !fields)
            return;
        let cancelled = false;
        const detectAndMap = () => __awaiter(void 0, void 0, void 0, function* () {
            const newMapping = {};
            const mappedColumns = new Set(Object.values(mapping));
            const promises = systemFields.map((field) => __awaiter(void 0, void 0, void 0, function* () {
                if (mapping[field.id])
                    return;
                const detector = fields.find((d) => d.id === field.id);
                if (!detector)
                    return;
                for (const [col, values] of Object.entries(columnData)) {
                    if (mappedColumns.has(col))
                        continue;
                    try {
                        const detectedType = yield detectColumnType(values, [detector]);
                        if (detectedType === field.id) {
                            newMapping[field.id] = col;
                            mappedColumns.add(col);
                            break;
                        }
                    }
                    catch (err) {
                        console.log(`field "${field.id}" / column "${col}":`, err);
                    }
                }
            }));
            yield Promise.all(promises);
            if (!cancelled && Object.keys(newMapping).length > 0) {
                setMapping(Object.assign(Object.assign({}, mapping), newMapping));
            }
        });
        detectAndMap();
        return () => {
            cancelled = true;
        };
    }, [rowData, systemFields, columnData, mapping, fields]);
    useEffect(() => {
        if (rowData.length === 0 || !fields)
            return;
        let cancelled = false;
        const mappedCols = new Set();
        const detectAndMap = () => __awaiter(void 0, void 0, void 0, function* () {
            const tasks = [];
            for (const field of systemFields) {
                if (mapping[field.id])
                    continue;
                const detector = fields.find((d) => d.id === field.id);
                if (!detector)
                    continue;
                for (const [col, values] of Object.entries(columnData)) {
                    if (mappedCols.has(col) || Object.values(mapping).includes(col))
                        continue;
                    const task = (() => __awaiter(void 0, void 0, void 0, function* () {
                        try {
                            const detectedType = yield detectColumnType(values, [detector]);
                            if (!cancelled && detectedType === field.id) {
                                mappedCols.add(col);
                                setMapping((prev) => {
                                    if (prev[field.id] || Object.values(prev).includes(col))
                                        return prev;
                                    return Object.assign(Object.assign({}, prev), { [field.id]: col });
                                });
                            }
                        }
                        catch (err) {
                            console.error(`field "${field.id}" / column "${col}":`, err);
                        }
                    }))();
                    tasks.push(task);
                }
            }
            yield Promise.allSettled(tasks);
        });
        detectAndMap();
        return () => {
            cancelled = true;
        };
    }, [rowData, systemFields, columnData, fields]);
    const handleConfirmMapping = () => {
        if (Object.keys(mapping).length === 0) {
            alert(labels.alerts.mapOneField);
            return;
        }
        const validMapping = {};
        const originalColumns = Object.keys(rowData[0] || {});
        Object.entries(mapping).forEach(([fieldId, column]) => {
            if (originalColumns.includes(column)) {
                validMapping[fieldId] = column;
            }
        });
        systemFields.forEach((field) => {
            if (!validMapping[field.id]) {
                validMapping[field.id] = `${field.id}`;
            }
        });
        const filteredData = rowData.map((row) => {
            const filteredRow = {};
            Object.entries(validMapping).forEach(([fieldId, column]) => {
                filteredRow[fieldId] = originalColumns.includes(column) ? row[column] : null;
            });
            return filteredRow;
        });
        setFilteredExcelData(filteredData);
        setMapping(validMapping);
        setSystemFields(systemFields);
        onNext === null || onNext === void 0 ? void 0 : onNext();
    };
    const handleRemoveField = (fieldId) => {
        removeMapping(fieldId);
    };
    const WarningDisplay = () => {
        if (Object.keys(mappingWarnings).length === 0)
            return null;
        return (_jsx("div", { className: "mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400", children: _jsx("div", { className: "flex", children: _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-yellow-800", children: labels.warnings.title }), _jsx("div", { className: "mt-2 text-sm text-yellow-700", children: _jsx("ul", { className: "list-disc pl-5 space-y-1", children: Object.entries(mappingWarnings).map(([column, fieldIds]) => {
                                    const fieldNames = fieldIds.map((id) => {
                                        const field = systemFields.find((f) => f.id === id);
                                        return (field === null || field === void 0 ? void 0 : field.label) || id;
                                    });
                                    const warningMessage = labels.warnings.duplicateColumn(column, fieldNames);
                                    return _jsx("li", { dangerouslySetInnerHTML: { __html: warningMessage } }, column);
                                }) }) })] }) }) }));
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto p-6", children: [_jsxs("div", { className: "flex flex-row gap-10 mb-8", children: [_jsx("div", { className: "flex-1", children: _jsx(PreviewTable, { data: rowData }) }), _jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [_jsx(FieldList, { fields: systemFields, onRemoveField: handleRemoveField, mapping: mapping, excelData: rowData, setMapping: setMapping }), _jsx("div", { className: "mt-4", children: _jsx("button", { onClick: () => setIsAddModalOpen(true), className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: labels.buttons.addField }) })] })] }), _jsx(WarningDisplay, {}), _jsx(Modal, { isOpen: isConfirmModalOpen, message: labels.alerts.fieldCountDifference, onCancel: () => setIsConfirmModalOpen(false), onConfirm: () => {
                    handleConfirmMapping();
                    setIsConfirmModalOpen(false);
                } }), onAddField && (_jsx(AddFieldModal, { isOpen: isAddModalOpen, onClose: () => setIsAddModalOpen(false), onAddField: onAddField, setSystemFields: setSystemFields, systemFields: systemFields }))] }));
});
//# sourceMappingURL=DataMapping.js.map