import { jsx as _jsx } from 'react/jsx-runtime'
export const FieldItem = ({ field }) => {
  return _jsx('div', {
    draggable: true,
    className: 'p-3 mb-2 bg-gray-100 rounded-lg cursor-move',
    children: _jsx('div', { className: 'font-medium', children: field.label }),
  })
}
//# sourceMappingURL=FieldItem.js.map
