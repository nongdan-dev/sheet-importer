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
import { ValidationTableRow } from '../components/ValidationTableRow';
import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useMemo, } from 'react';
export const DataValidationStep = forwardRef((props, ref) => {
    const { systemFieldsList, filteredExcelData, updateCell, deleteRow, onNext, onBack, labels } = props;
    const [errors, setErrors] = useState([]);
    const [showErrorsOnly, setShowErrorsOnly] = useState(false);
    const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
    const [editingErrors, setEditingErrors] = useState({});
    const inputRefs = useRef({});
    const tableWrapperRef = useRef(null);
    const validateTimerRef = useRef(null);
    useImperativeHandle(ref, () => ({
        refOnNext() {
            errors.length === 0 && onNext();
        },
    }));
    const transformedData = useMemo(() => {
        return filteredExcelData.map((row) => (Object.assign({}, row)));
    }, [filteredExcelData]);
    const validateData = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        const newErrors = [];
        for (const field of systemFieldsList) {
            if (!field.validate)
                continue;
            for (let rowIndex = 0; rowIndex < filteredExcelData.length; rowIndex++) {
                const row = filteredExcelData[rowIndex];
                const value = row[field.id];
                const validationResult = yield field.validate(String(value));
                if (validationResult.error) {
                    newErrors.push({
                        rowIndex,
                        field: field.id,
                        message: validationResult.error,
                    });
                }
            }
        }
        setErrors(newErrors);
    }), [filteredExcelData, systemFieldsList]);
    const handleCellChange = useCallback((e, rowIndex, field) => __awaiter(void 0, void 0, void 0, function* () {
        const newValue = e.target.value;
        const fieldId = field.id;
        const inputKey = `${rowIndex}-${fieldId}`;
        updateCell(rowIndex, fieldId, newValue);
        setEditingErrors((prev) => {
            const newErrors = Object.assign({}, prev);
            if (newErrors[inputKey]) {
                delete newErrors[inputKey];
            }
            return newErrors;
        });
        if (field.validate) {
            try {
                const validationResult = yield field.validate(newValue);
                if (validationResult.error) {
                    setEditingErrors((prev) => (Object.assign(Object.assign({}, prev), { [inputKey]: validationResult.error || '' })));
                }
                else if (validationResult.value !== undefined) {
                    updateCell(rowIndex, fieldId, validationResult.value);
                    setErrors((prev) => prev.filter((err) => !(err.rowIndex === rowIndex && err.field === fieldId)));
                }
            }
            catch (err) {
                setEditingErrors((prev) => (Object.assign(Object.assign({}, prev), { [inputKey]: 'Validation error' })));
            }
        }
        if (validateTimerRef.current)
            clearTimeout(validateTimerRef.current);
        validateTimerRef.current = setTimeout(() => {
            validateData();
        }, 500);
    }), [updateCell, validateData]);
    const focusErrorInput = useCallback((errorIndex) => {
        if (errors.length === 0 || errorIndex >= errors.length)
            return;
        const error = errors[errorIndex];
        const inputKey = `${error.rowIndex}-${error.field}`;
        const inputElement = inputRefs.current[inputKey];
        if (inputElement) {
            inputElement.focus();
            inputElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [errors]);
    useEffect(() => {
        validateData();
    }, [validateData]);
    const handleNextError = useCallback(() => {
        if (errors.length === 0)
            return;
        let nextIndex = currentErrorIndex;
        let checked = 0;
        while (checked < errors.length) {
            nextIndex = (nextIndex + 1) % errors.length;
            const nextError = errors[nextIndex];
            const stillExists = filteredExcelData[nextError.rowIndex] !== undefined;
            if (stillExists) {
                setCurrentErrorIndex(nextIndex);
                setTimeout(() => focusErrorInput(nextIndex), 0);
                return;
            }
            checked++;
        }
    }, [currentErrorIndex, errors, filteredExcelData, focusErrorInput]);
    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleNextError();
        }
    };
    const handleDeleteRow = (rowIndex) => {
        deleteRow(rowIndex);
        validateData();
    };
    const filteredData = showErrorsOnly
        ? transformedData.filter((_, index) => errors.some((err) => err.rowIndex === index))
        : transformedData;
    const handleDeleteAllErrorRows = () => {
        const uniqueErrorRowIndexes = Array.from(new Set(errors.map((error) => error.rowIndex))).sort((a, b) => b - a);
        uniqueErrorRowIndexes.forEach((rowIndex) => {
            deleteRow(rowIndex);
        });
        validateData();
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("p", { children: labels.stats.totalErrors(errors.length) }), _jsxs("p", { children: ["Current error ", errors.length > 0 ? currentErrorIndex + 1 : 0, "/", errors.length] })] }), _jsxs("div", { className: "mb-4 flex gap-4 flex-wrap", children: [_jsx("button", { onClick: handleNextError, disabled: errors.length === 0, className: `px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${errors.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`, children: labels.buttons.nextError }), _jsx("button", { onClick: handleDeleteAllErrorRows, disabled: errors.length === 0, className: `px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${errors.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`, children: labels.buttons.deleteAllErrors }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: showErrorsOnly, onChange: (e) => setShowErrorsOnly(e.target.checked), className: "rounded" }), _jsx("span", { children: "Show error only" })] })] }), _jsx("div", { ref: tableWrapperRef, className: "overflow-x-auto mb-8 max-h-[500px] overflow-y-auto border rounded", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "STT" }), systemFieldsList.map((column) => {
                                        return (_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: _jsx("div", { className: "flex flex-col gap-1", children: _jsx("span", { children: column.label || '' }) }) }, column.id));
                                    }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Action" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredData.map((row, rowIndex) => {
                                return (_jsx(ValidationTableRow, { row: row, rowIndex: rowIndex, fields: systemFieldsList, errors: errors, editingErrors: editingErrors, onCellChange: handleCellChange, onKeyDown: handleInputKeyDown, onDelete: handleDeleteRow, inputRefs: inputRefs }, rowIndex));
                            }) })] }) })] }));
});
//# sourceMappingURL=DataValidation.js.map