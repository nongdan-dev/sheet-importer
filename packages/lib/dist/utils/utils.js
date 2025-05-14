//remove diacritics and special characters from string
// and convert to lowercase
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//map data bằng cách học header
export const normalizeString = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
};
export const getExcelColumnName = (index) => {
    let columnName = '';
    let temp;
    while (index >= 0) {
        temp = index % 26;
        columnName = String.fromCharCode(temp + 65) + columnName;
        index = Math.floor(index / 26) - 1;
    }
    return columnName;
};
export const detectColumnType = (values, detectors) => __awaiter(void 0, void 0, void 0, function* () {
    // onfirst 50 values
    const sample = values.slice(0, 50).filter((v) => v != null && v !== '');
    if (sample.length === 0)
        return null;
    //promise per detector
    const detectorPromises = detectors.map((detector) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let validCount = 0;
        for (const value of sample) {
            try {
                const result = yield ((_a = detector.validate) === null || _a === void 0 ? void 0 : _a.call(detector, String(value).trim()));
                if (!(result === null || result === void 0 ? void 0 : result.error)) {
                    validCount++;
                }
            }
            catch (err) {
                console.log(`Validation: "${value}"/ column "${detector.id}":`, err);
            }
        }
        return {
            id: detector.id,
            score: validCount / sample.length,
            threshold: detector.threshold || 0.7,
        };
    }));
    // độc lập từng promise
    const results = yield Promise.allSettled(detectorPromises);
    const bestMatch = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
        .find((detectorResult) => detectorResult.score >= detectorResult.threshold);
    return bestMatch ? bestMatch.id : null;
});
export const builtInValidate = {
    string: (value) => {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            return { error: 'Value cannot be empty', value: undefined };
        }
        return { value: trimmed };
    },
    number: (value) => {
        const num = Number(value);
        if (isNaN(num)) {
            return { error: 'Invalid number format', value: undefined };
        }
        return { value: num };
    },
    integer: (value) => {
        const result = builtInValidate.number(value);
        if (result.error || result.value === undefined)
            return { error: result.error, value: undefined };
        if (!Number.isInteger(result.value)) {
            return { error: 'Value must be an integer', value: undefined };
        }
        return { value: result.value };
    },
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const trimmed = value.trim();
        if (!emailRegex.test(trimmed)) {
            return { error: 'Invalid email format', value: undefined };
        }
        return { value: trimmed.toLowerCase() };
    },
    date: (value) => {
        const parsedDate = new Date(value);
        if (isNaN(parsedDate.getTime())) {
            return { error: 'Invalid date format', value: undefined };
        }
        return { value: parsedDate };
    },
    boolean: (value) => {
        const lowerValue = value.trim().toLowerCase();
        if (['true', 'yes', '1'].includes(lowerValue))
            return { value: true };
        if (['false', 'no', '0'].includes(lowerValue))
            return { value: false };
        return {
            error: 'Value must be boolean (true/false, yes/no, 1/0)',
            value: undefined,
        };
    },
    percentage: (value) => {
        const percentageRegex = /^(\d+(\.\d+)?)\s*%?$/;
        const match = value.trim().match(percentageRegex);
        if (!match) {
            return {
                error: 'Invalid percentage format (e.g. 10% or 0.1)',
                value: undefined,
            };
        }
        const num = parseFloat(match[1]) / 100;
        return { value: num };
    },
    currency: (value) => {
        const cleaned = value.replace(/[^\d.,-]/g, '').replace(',', '.');
        const num = parseFloat(cleaned);
        if (isNaN(num)) {
            return { error: 'Invalid currency format', value: undefined };
        }
        return { value: num };
    },
    url: (value) => {
        try {
            const trimmed = value.trim();
            new URL(trimmed);
            return { value: trimmed };
        }
        catch (_a) {
            return { error: 'Invalid URL format', value: undefined };
        }
    },
    phone: (value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 9) {
            return { error: 'Invalid phone number', value: undefined };
        }
        return { value: digits };
    },
};
export const builtInDisplay = {
    percentage: (value) => `${Math.round(value * 100)}%`,
    currency: (value) => `$${value.toFixed(2)}`,
    date: (value) => value.toLocaleDateString(),
    boolean: (value) => (value ? 'Yes' : 'No'),
};
//# sourceMappingURL=utils.js.map