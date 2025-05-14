import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ConfirmationStep = ({ isSubmitting, submitSuccess, submitError, onReset, onRetry, }) => {
    if (isSubmitting) {
        return (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }), _jsx("p", { className: "text-lg font-medium", children: "Uploading data..." })] }));
    }
    if (submitSuccess) {
        return (_jsxs("div", { className: "text-center text-green-600", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 mx-auto mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), _jsx("h3", { className: "text-xl font-bold mb-2", children: "Upload Successful!" }), _jsx("p", { className: "mb-6", children: "Your data has been successfully uploaded." }), _jsx("button", { onClick: onReset, className: "px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Upload New File" })] }));
    }
    if (submitError) {
        return (_jsxs("div", { className: "text-center text-red-600", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 mx-auto mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }), _jsx("h3", { className: "text-xl font-bold mb-2", children: "Upload Failed" }), _jsx("p", { className: "mb-2", children: submitError }), _jsxs("div", { className: "flex gap-4 justify-center mt-4", children: [_jsx("button", { onClick: onRetry, className: "px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded", children: "Try Again" }), _jsx("button", { onClick: onReset, className: "px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded", children: "Start Over" })] })] }));
    }
    return null;
};
//# sourceMappingURL=Confirmation.js.map