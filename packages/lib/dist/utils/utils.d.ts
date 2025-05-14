import { CustomType } from "@/types";
export declare const normalizeString: (str: string) => string;
export declare const getExcelColumnName: (index: number) => string;
export declare const detectColumnType: (values: any[], detectors: CustomType[]) => Promise<string | null>;
export declare const builtInValidate: {
    string: (value: string) => {
        error?: string;
        value?: string;
    };
    number: (value: string) => {
        error?: string;
        value?: number;
    };
    integer: (value: string) => {
        error?: string;
        value?: number;
    };
    email: (value: string) => {
        error?: string;
        value?: string;
    };
    date: (value: string) => {
        error?: string;
        value?: Date;
    };
    boolean: (value: string) => {
        error?: string;
        value?: boolean;
    };
    percentage: (value: string) => {
        error?: string;
        value?: number;
    };
    currency: (value: string) => {
        error?: string;
        value?: number;
    };
    url: (value: string) => {
        error?: string;
        value?: string;
    };
    phone: (value: string) => {
        error?: string;
        value?: string;
    };
};
export declare const builtInDisplay: {
    percentage: (value: number) => string;
    currency: (value: number) => string;
    date: (value: Date) => string;
    boolean: (value: boolean) => "Yes" | "No";
};
//# sourceMappingURL=utils.d.ts.map