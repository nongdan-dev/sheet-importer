import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { observer } from 'mobx-react-lite'
import { getExcelColumnName } from '../utils/utils'
export const FieldList = observer(
  ({
    fields,
    onRemoveField,
    mapping,
    setMapping,
    excelData,
    allowMultipleFieldsPerColumn = true,
  }) => {
    const handleMappingChange = (fieldId, columnName) => {
      setMapping(Object.assign(Object.assign({}, mapping), { [fieldId]: columnName }))
    }
    const mappedColumns = allowMultipleFieldsPerColumn
      ? new Set()
      : new Set(Object.values(mapping).filter(Boolean))
    return _jsx('div', {
      className: 'space-y-4 h-[400px]',
      children: _jsx('div', {
        className: 'overflow-y-auto overflow-x-hidden max-h-96 space-y-4 pr-2',
        children: fields.map((field) =>
          _jsxs(
            'div',
            {
              className: 'space-y-2 group relative',
              children: [
                _jsx('button', {
                  onClick: () => {
                    onRemoveField(field.id)
                    const newMapping = Object.assign({}, mapping)
                    delete newMapping[field.id]
                    setMapping(newMapping)
                  },
                  className:
                    'absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700',
                  title: 'Remove field',
                  children: '\u00D7',
                }),
                _jsx('label', {
                  className: 'block text-sm font-medium text-gray-700 m-0 p-0 text-left',
                  children: field.label,
                }),
                _jsx('div', {
                  className: 'flex gap-2',
                  children: _jsxs('select', {
                    value: mapping[field.id] || '',
                    onChange: (e) => handleMappingChange(field.id, e.target.value),
                    className:
                      'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border',
                    children: [
                      _jsx('option', { value: '', children: '-- None --' }),
                      Object.keys(excelData[0] || {}).map((column, index) => {
                        const columnLabel = getExcelColumnName(index)
                        const isDisabled =
                          !allowMultipleFieldsPerColumn &&
                          mappedColumns.has(column) &&
                          mapping[field.id] !== column
                        return _jsxs(
                          'option',
                          {
                            value: column,
                            disabled: isDisabled,
                            className: isDisabled ? 'text-gray-400' : '',
                            children: [columnLabel, isDisabled],
                          },
                          column,
                        )
                      }),
                    ],
                  }),
                }),
              ],
            },
            field.id,
          ),
        ),
      }),
    })
  },
)
//# sourceMappingURL=FieldList.js.map
