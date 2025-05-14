import React from 'react';
import { CustomType, ExcelRow } from '../types';
interface FieldListProps {
    fields: CustomType[];
    onRemoveField: (fieldLabel: string) => void;
    mapping: Record<string, string>;
    setMapping: (mapping: Record<string, string>) => void;
    excelData: ExcelRow[];
    allowMultipleFieldsPerColumn?: boolean;
}
export declare const FieldList: React.FC<FieldListProps>;
export {};
//# sourceMappingURL=FieldList.d.ts.map