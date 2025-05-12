import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
export const Modal = ({ isOpen, title = 'Confirm', message, onCancel, onConfirm }) => {
  if (!isOpen) return null
  return _jsx('div', {
    className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
    children: _jsxs('div', {
      className: 'bg-white p-6 rounded-md shadow-md w-full max-w-md',
      children: [
        _jsx('h2', { className: 'text-lg font-semibold mb-4', children: title }),
        _jsx('p', { className: 'mb-6', children: message }),
        _jsxs('div', {
          className: 'flex justify-end gap-4',
          children: [
            _jsx('button', {
              onClick: onCancel,
              className: 'px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100',
              children: 'Cancel',
            }),
            _jsx('button', {
              onClick: onConfirm,
              className: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700',
              children: 'Confirm',
            }),
          ],
        }),
      ],
    }),
  })
}
//# sourceMappingURL=Modal.js.map
