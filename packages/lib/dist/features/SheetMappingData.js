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
import { useRef, useState } from 'react';
import { DataMappingStep } from './DataMapping';
import { DataValidationStep } from './DataValidation';
import { ConfirmationStep } from './Confirmation';
import { FileUpload } from './FileUpload';
import { DEFAULT_LABELS } from '../types';
import { useMapping } from '../hooks/useMapping';
import { useExcelSheets } from '../hooks/useExcelSheets';
const STEP_VALIDATION = {
    UPLOAD: 1,
    MAPPING: 2,
    VALIDATION: 3,
    CONFIRMATION: 4,
};
export const SheetMappingData = ({ onSubmit, fields = [], labels: propLabels = {}, onAddField, }) => {
    const [activeTab, setActiveTab] = useState(STEP_VALIDATION.UPLOAD);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const mappingStepRef = useRef(null);
    const validationStepRef = useRef(null);
    const { rowData, setRowData, columnData, setColumnData, filteredExcelData, updateCell, deleteRow, mapping, setMapping, removeMapping, systemFields, setSystemFields, setFilteredExcelData, clearData, disableNegative, disablePositive, setDisableNegative, setDisablePositive, } = useMapping({ field: fields });
    const { sheetDataMap, parseSheet } = useExcelSheets();
    const handleSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);
        try {
            yield onSubmit(filteredExcelData);
            setSubmitSuccess(true);
        }
        catch (error) {
            setSubmitError(error.message || 'Failed to submit data');
        }
        finally {
            setIsSubmitting(false);
        }
    });
    const handleFileUploaded = (data) => {
        setRowData(data.rowData);
        setColumnData(data.columnData);
        setActiveTab(STEP_VALIDATION.MAPPING);
    };
    const handleReset = () => {
        clearData();
        setActiveTab(STEP_VALIDATION.UPLOAD);
        setSubmitSuccess(false);
        setSubmitError(null);
        setSelectedSheet(null);
    };
    const handleSheetChange = (sheetName) => {
        setActiveTab(STEP_VALIDATION.MAPPING);
        clearData();
        setSelectedSheet(sheetName);
        const sheet = sheetDataMap === null || sheetDataMap === void 0 ? void 0 : sheetDataMap[sheetName];
        if (sheet) {
            setRowData(sheet.rowData || []);
            setColumnData(sheet.columnData || []);
        }
    };
    const labels = Object.assign(Object.assign(Object.assign({}, DEFAULT_LABELS), propLabels), { upload: Object.assign(Object.assign({}, DEFAULT_LABELS.upload), propLabels.upload), mapping: Object.assign(Object.assign({}, DEFAULT_LABELS.mapping), propLabels.mapping), validation: Object.assign(Object.assign({}, DEFAULT_LABELS.validation), propLabels.validation), confirmation: Object.assign(Object.assign({}, DEFAULT_LABELS.confirmation), propLabels.confirmation), common: Object.assign(Object.assign({}, DEFAULT_LABELS.common), propLabels.common) });
    const getStepTitle = (step) => {
        switch (step) {
            case STEP_VALIDATION.UPLOAD:
                return labels.upload.title;
            case STEP_VALIDATION.MAPPING:
                return labels.mapping.title;
            case STEP_VALIDATION.VALIDATION:
                return labels.validation.title;
            case STEP_VALIDATION.CONFIRMATION:
                return labels.confirmation.title;
            default:
                return '';
        }
    };
    return (_jsxs("div", { className: "w-full h-full flex-1 mx-auto font-sans", children: [activeTab === STEP_VALIDATION.UPLOAD && (_jsx(FileUpload, { onUploadSuccess: handleFileUploaded, onUploadFailed: (err) => console.error('File upload failed:', err), parseSheet: parseSheet })), activeTab !== STEP_VALIDATION.UPLOAD && Object.keys(sheetDataMap || {}).length > 1 && (_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium whitespace-nowrap", children: labels.common.sheetLabel }), _jsx("select", { className: "border px-2 py-1 rounded text-sm w-auto", value: selectedSheet || '', onChange: (e) => handleSheetChange(e.target.value), children: Object.keys(sheetDataMap).map((sheetName) => (_jsx("option", { value: sheetName, children: sheetName }, sheetName))) })] })), activeTab === STEP_VALIDATION.MAPPING && (_jsx(DataMappingStep, { ref: mappingStepRef, columnData: columnData, rowData: rowData, systemFields: systemFields, mapping: mapping, setMapping: setMapping, setFilteredExcelData: setFilteredExcelData, setSystemFields: setSystemFields, removeMapping: removeMapping, onBack: () => setActiveTab(STEP_VALIDATION.UPLOAD), onNext: () => {
                    setActiveTab(STEP_VALIDATION.VALIDATION);
                    handleSubmit();
                }, fields: fields, setDisableNegative: setDisableNegative, setDisablePositive: setDisablePositive, labels: labels.mapping, onAddField: onAddField })), activeTab === STEP_VALIDATION.VALIDATION && (_jsx(DataValidationStep, { ref: validationStepRef, onNext: () => {
                    setActiveTab(STEP_VALIDATION.CONFIRMATION);
                    handleSubmit();
                }, onBack: () => setActiveTab(STEP_VALIDATION.MAPPING), updateCell: updateCell, deleteRow: deleteRow, filteredExcelData: filteredExcelData, systemFieldsList: systemFields, labels: labels.validation })), activeTab === STEP_VALIDATION.CONFIRMATION && (_jsx(ConfirmationStep, { isSubmitting: isSubmitting, submitSuccess: submitSuccess, submitError: submitError, onReset: handleReset, onRetry: () => setActiveTab(STEP_VALIDATION.VALIDATION) })), activeTab !== STEP_VALIDATION.UPLOAD && activeTab !== STEP_VALIDATION.CONFIRMATION && (_jsxs("div", { className: "flex justify-between mt-4", children: [_jsx("button", { onClick: () => {
                            if (activeTab === STEP_VALIDATION.MAPPING) {
                                setActiveTab(STEP_VALIDATION.UPLOAD);
                            }
                            else {
                                setActiveTab(STEP_VALIDATION.MAPPING);
                            }
                        }, disabled: disableNegative, className: "px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded", children: "Back" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-gray-500", children: getStepTitle(activeTab) }), _jsx("span", { className: "text-gray-500", children: labels.common.stepIndicator(activeTab, 4) })] }), _jsx("button", { onClick: () => {
                            var _a, _b, _c, _d;
                            if (activeTab === STEP_VALIDATION.MAPPING) {
                                (_b = (_a = mappingStepRef.current) === null || _a === void 0 ? void 0 : _a.triggerRef) === null || _b === void 0 ? void 0 : _b.call(_a);
                            }
                            else {
                                (_d = (_c = validationStepRef.current) === null || _c === void 0 ? void 0 : _c.refOnNext) === null || _d === void 0 ? void 0 : _d.call(_c);
                            }
                        }, disabled: disablePositive, className: "px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded", children: activeTab === STEP_VALIDATION.MAPPING
                            ? labels.mapping.nextButton
                            : labels.validation.nextButton })] }))] }));
};
//# sourceMappingURL=SheetMappingData.js.map