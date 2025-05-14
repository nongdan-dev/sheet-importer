import { ExcelColumn, ExcelRow } from '@/types';
import * as XLSX from 'xlsx';
interface ParsedSheetData {
    rowData: ExcelRow[];
    columnData: ExcelColumn;
}
export declare const useExcelSheets: () => {
    sheetDataMap: Record<string, ParsedSheetData>;
    parseSheet: (sheetName: string, worksheet: XLSX.WorkSheet) => ParsedSheetData;
};
export {};
//# sourceMappingURL=useExcelSheets.d.ts.map