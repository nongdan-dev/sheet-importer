import React from 'react'

interface ConfirmationStepProps {
  isSubmitting: boolean
  submitSuccess: boolean
  submitError: string | null
  onReset: () => void
  onRetry: () => void
}

export const ConfirmationStep = ({
  isSubmitting,
  submitSuccess,
  submitError,
  onReset,
  onRetry,
}: ConfirmationStepProps) => {
  if (isSubmitting) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg font-medium">Uploading data...</p>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="text-center text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-xl font-bold mb-2">Upload Successful!</h3>
        <p className="mb-6">Your data has been successfully uploaded.</p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload New File
        </button>
      </div>
    )
  }

  if (submitError) {
    return (
      <div className="text-center text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h3 className="text-xl font-bold mb-2">Upload Failed</h3>
        <p className="mb-2">{submitError}</p>
        <div className="flex gap-4 justify-center mt-4">
          <button onClick={onRetry} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">
            Try Again
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return null
}
