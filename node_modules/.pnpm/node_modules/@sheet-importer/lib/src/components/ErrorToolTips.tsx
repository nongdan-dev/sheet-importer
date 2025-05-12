import React from 'react'

interface ErrorTooltipProps {
  message: string
}

export const ErrorTooltip: React.FC<ErrorTooltipProps> = ({ message }) => {
  return (
    <div className="relative ml-2 group">
      <span className="text-red-500">?</span>
      <div className="absolute z-10 hidden group-hover:block bg-red-100 text-red-800 text-xs p-2 rounded shadow-lg">
        {message}
      </div>
    </div>
  )
}
