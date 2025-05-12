import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { getExcelColumnName } from '../utils/utils'
export const PreviewTable = ({ data }) => {
  if (data.length === 0) return null
  const columnNames = Object.keys(data[0]).map((_, index) => getExcelColumnName(index))
  return _jsx('div', {
    className: 'relative max-h-[400px] max-w-[800px] overflow-y-auto',
    children: _jsxs('table', {
      className: 'min-w-full divide-y divide-gray-200',
      children: [
        _jsx('thead', {
          className: 'bg-gray-50 sticky top-0 z-10',
          children: _jsx('tr', {
            children: columnNames.map((name) =>
              _jsx(
                'th',
                {
                  className:
                    'px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider',
                  children: name,
                },
                name,
              ),
            ),
          }),
        }),
        _jsx('tbody', {
          className: 'bg-white divide-y divide-gray-200',
          children: data.map((row, index) =>
            _jsx(
              'tr',
              {
                className: index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                children: Object.values(row).map((value, i) =>
                  _jsx(
                    'td',
                    {
                      className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
                      children: value !== null ? String(value) : '-',
                    },
                    i,
                  ),
                ),
              },
              index,
            ),
          ),
        }),
      ],
    }),
  })
}
//# sourceMappingURL=PreviewTable.js.map
