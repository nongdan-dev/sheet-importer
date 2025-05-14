import { useState, useCallback } from 'react';
export const useMapping = ({ field }) => {
    const [rowData, setRowData] = useState([]);
    const [columnData, setColumnData] = useState({});
    const [filteredExcelData, setFilteredExcelData] = useState([]);
    const [mapping, setMapping] = useState({});
    const [systemFields, setSystemFields] = useState(field);
    const [disablePositive, setDisablePositive] = useState(false);
    const [disableNegative, setDisableNegative] = useState(false);
    const updateCell = useCallback((rowIndex, columnId, value) => {
        setFilteredExcelData((prev) => {
            const newData = [...prev];
            newData[rowIndex] = Object.assign(Object.assign({}, newData[rowIndex]), { [columnId]: value });
            return newData;
        });
    }, []);
    const deleteRow = useCallback((rowIndex) => {
        setFilteredExcelData((prev) => prev.filter((_, index) => index !== rowIndex));
    }, []);
    const removeMapping = useCallback((fieldId) => {
        setMapping((prev) => {
            const newMapping = Object.assign({}, prev);
            delete newMapping[fieldId];
            return newMapping;
        });
    }, []);
    const clearData = useCallback(() => {
        setRowData([]);
        setColumnData({});
        setFilteredExcelData([]);
        setMapping({});
        setSystemFields(field);
    }, []);
    return {
        rowData,
        setRowData,
        columnData,
        setColumnData,
        filteredExcelData,
        setFilteredExcelData,
        mapping,
        setMapping,
        removeMapping,
        systemFields,
        setSystemFields,
        updateCell,
        deleteRow,
        clearData,
        disablePositive,
        setDisablePositive,
        disableNegative,
        setDisableNegative,
    };
};
//# sourceMappingURL=useMapping.js.map