var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import { SheetSelectionModal } from '../components/SheetSectionModal';
const DEFAULT_MAX_FILE_SIZE_MB = 10;
const DEFAULT_ACCEPTED_FILE_TYPES = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
];
export const FileUpload = ({ onUploadSuccess, onUploadFailed, maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB, acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES, parseSheet, }) => {
    const [workbook, setWorkbook] = useState(null);
    const [sheetNames, setSheetNames] = useState([]);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const handleFileChange = (file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!acceptedFileTypes.includes(file.type)) {
                throw new Error('Unsupported file format');
            }
            const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                throw new Error(`File size exceeds ${maxFileSizeMB}MB limit`);
            }
            setIsProcessing(true);
            setFileName(file.name);
            setFileSize(file.size);
            const wb = yield readWorkbook(file);
            setWorkbook(wb);
            setSheetNames(wb.SheetNames);
            wb.SheetNames.forEach((sheetName) => {
                const worksheet = wb.Sheets[sheetName];
                parseSheet(sheetName, worksheet);
            });
            const firstSheet = wb.SheetNames[0];
            if (firstSheet) {
                processSelectedSheet(firstSheet, wb);
            }
            if (wb.SheetNames.length > 1) {
                setShowModal(true);
            }
        }
        catch (error) {
            handleUploadError(error);
        }
        finally {
            setIsProcessing(false);
        }
    });
    const readWorkbook = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                var _a;
                try {
                    const binaryStr = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                    const wb = XLSX.read(binaryStr, {
                        type: 'binary',
                        cellDates: true,
                        raw: true,
                    });
                    resolve(wb);
                }
                catch (error) {
                    reject(new Error('Failed to parse Excel file'));
                }
            };
            reader.onerror = () => reject(new Error('File reading failed'));
            reader.readAsBinaryString(file);
        });
    };
    const processSelectedSheet = (sheetName, wb) => {
        try {
            const workbookToUse = wb || workbook;
            if (!workbookToUse)
                return;
            const worksheet = workbookToUse.Sheets[sheetName];
            const { rowData, columnData } = parseSheet(sheetName, worksheet);
            onUploadSuccess({
                rowData,
                columnData,
                sheetName,
                fileName,
                fileSize,
            });
        }
        catch (error) {
            handleUploadError(error);
        }
    };
    const handleUploadError = (error) => {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        else if (typeof error === 'string') {
            errorMessage = error;
        }
        onUploadFailed(errorMessage);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                resetState();
                handleFileChange(acceptedFiles[0]);
            }
        },
        accept: Object.fromEntries(acceptedFileTypes.map((format) => [format, ['.xls', '.xlsx', '.csv']])),
        multiple: false,
        maxSize: maxFileSizeMB * 1024 * 1024,
    });
    const resetState = () => {
        setWorkbook(null);
        setSheetNames([]);
        setFileName('');
        setFileSize(0);
        setShowModal(false);
        setIsProcessing(false);
    };
    const handleSheetSelect = (sheetName) => {
        setShowModal(false);
        processSelectedSheet(sheetName);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", Object.assign({}, getRootProps(), { className: `border-2 border-dashed rounded-lg cursor-pointer text-center transition
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${isProcessing ? 'opacity-70 pointer-events-none' : ''}
          p-10`, children: [_jsx("input", Object.assign({}, getInputProps())), isProcessing ? (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" }), _jsx("p", { className: "text-gray-600", children: "Processing file..." })] })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-gray-600", children: isDragActive
                                    ? 'Drop your Excel file here'
                                    : 'Drag & drop Excel file here or click to browse' }), _jsxs("p", { className: "text-sm text-gray-500 mt-2", children: ["Supported formats: .xls, .xlsx, .csv (Max ", maxFileSizeMB, "MB)"] })] }))] })), fileName && (_jsx("div", { className: "p-3 bg-gray-50 rounded-lg border border-gray-200", children: _jsxs("p", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Selected file:" }), " ", fileName, _jsxs("span", { className: "text-gray-500 ml-2", children: ["(", (fileSize / 1024 / 1024).toFixed(2), " MB)"] })] }) })), showModal && (_jsx(SheetSelectionModal, { sheetNames: sheetNames, onSelect: handleSheetSelect, onClose: () => setShowModal(false) }))] }));
};
//# sourceMappingURL=FileUpload.js.map