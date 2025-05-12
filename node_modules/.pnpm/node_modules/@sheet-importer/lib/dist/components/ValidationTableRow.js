var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {}
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p]
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]]
      }
    return t
  }
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ErrorTooltip } from './ErrorToolTips'
export const ValidationTableRow = observer(
  ({
    row,
    rowIndex,
    fields,
    errors,
    editingErrors,
    onCellChange,
    onKeyDown,
    onDelete,
    inputRefs,
  }) => {
    const [editValues, setEditValues] = useState({})
    const [isFocused, setIsFocused] = useState({})
    const getFieldError = (fieldId) => {
      const editingError = editingErrors[`${rowIndex}-${fieldId}`]
      if (editingError) return { message: editingError }
      return errors.find((err) => err.rowIndex === rowIndex && err.field === fieldId)
    }
    const handleChange = (e, field) => {
      setEditValues((prev) =>
        Object.assign(Object.assign({}, prev), { [field.id]: e.target.value }),
      )
    }
    const handleFocus = (field) => {
      setIsFocused((prev) => Object.assign(Object.assign({}, prev), { [field.id]: true }))
      setEditValues((prev) =>
        Object.assign(Object.assign({}, prev), { [field.id]: String(row[field.id] || '') }),
      )
    }
    const handleBlurOrKeyDown = (field) => {
      var _a
      setIsFocused((prev) => Object.assign(Object.assign({}, prev), { [field.id]: false }))
      const currentValue =
        (_a = editValues[field.id]) !== null && _a !== void 0 ? _a : String(row[field.id] || '')
      const fakeEvent = {
        target: { value: currentValue },
      }
      onCellChange(fakeEvent, rowIndex, field, currentValue)
      setEditValues((prev) => {
        const _a = prev,
          _b = field.id,
          _ = _a[_b],
          rest = __rest(_a, [typeof _b === 'symbol' ? _b : _b + ''])
        return rest
      })
    }
    const getDisplayValue = (field) => {
      var _a, _b
      const fieldId = field.id
      if (isFocused[fieldId] || editValues[fieldId] !== undefined) {
        return (_a = editValues[fieldId]) !== null && _a !== void 0
          ? _a
          : String(row[fieldId] || '')
      }
      if (
        editingErrors[`${rowIndex}-${fieldId}`] ||
        errors.some((e) => e.rowIndex === rowIndex && e.field === fieldId)
      ) {
        return (_b = editValues[fieldId]) !== null && _b !== void 0
          ? _b
          : String(row[fieldId] || '')
      }
      return field.display ? field.display(row[fieldId]) : row[fieldId]
    }
    return _jsxs('tr', {
      children: [
        _jsx('td', {
          className: 'px-6 py-4 whitespace-nowrap text-gray-700 font-medium text-center',
          children: rowIndex + 1,
        }),
        fields.map((field) => {
          const error = getFieldError(field.id)
          const displayValue = getDisplayValue(field)
          return _jsx(
            'td',
            {
              className: `px-6 py-4 whitespace-nowrap ${error ? 'bg-red-50' : ''}`,
              children: _jsxs('div', {
                className: 'flex items-center',
                children: [
                  _jsx('input', {
                    value: displayValue || '',
                    onChange: (e) => handleChange(e, field),
                    onFocus: () => handleFocus(field),
                    onBlur: () => handleBlurOrKeyDown(field),
                    onKeyDown: (e) => {
                      if (e.key === 'Enter') {
                        handleBlurOrKeyDown(field)
                      }
                      onKeyDown(e)
                    },
                    className: `px-2 py-1 rounded text-sm w-full ${error ? 'border border-red-500 bg-red-50' : 'border border-gray-300'}`,
                    ref: (el) => {
                      inputRefs.current[`${rowIndex}-${field.id}`] = el
                    },
                  }),
                  error && _jsx(ErrorTooltip, { message: error.message }),
                ],
              }),
            },
            field.id,
          )
        }),
        _jsx('td', {
          className: 'px-6 py-4 whitespace-nowrap text-center',
          children: _jsx('button', {
            onClick: () => onDelete(rowIndex),
            className: 'text-red-600 hover:text-red-800 font-semibold text-sm',
            children: 'Delete',
          }),
        }),
      ],
    })
  },
)
//# sourceMappingURL=ValidationTableRow.js.map
