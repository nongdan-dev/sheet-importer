import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
export const ErrorTooltip = ({ message }) => {
  return _jsxs('div', {
    className: 'relative ml-2 group',
    children: [
      _jsx('span', { className: 'text-red-500', children: '?' }),
      _jsx('div', {
        className:
          'absolute z-10 hidden group-hover:block bg-red-100 text-red-800 text-xs p-2 rounded shadow-lg',
        children: message,
      }),
    ],
  })
}
//# sourceMappingURL=ErrorToolTips.js.map
