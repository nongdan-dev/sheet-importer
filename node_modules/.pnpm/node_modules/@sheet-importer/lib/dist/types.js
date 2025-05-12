export const DEFAULT_LABELS = {
  upload: {
    title: 'Upload File',
  },
  mapping: {
    title: 'Map Fields',
    backButton: 'Back',
    nextButton: 'Next',
    warnings: {
      title: 'Mapping Warnings',
      duplicateColumn: (column, fields) =>
        `Column "${column}" is mapped to multiple fields: ${fields.join(', ')}`,
    },
    alerts: {
      mapOneField: 'Please map at least one field before proceeding.',
      fieldCountDifference:
        'There is a field count difference between the file and the system. Do you want to continue?',
    },
    buttons: {
      continue: 'Continue',
      addField: '+ Add Field',
    },
  },
  validation: {
    title: 'Validate Data',
    backButton: 'Back',
    nextButton: 'Next',
    stats: {
      totalErrors: (count) => `Total: ${count} error(s)`,
      currentError: (current, total) => `Current error ${current}/${total}`,
    },
    buttons: {
      nextError: 'Next Error',
      deleteAllErrors: 'Delete All Errors',
    },
    filters: {
      showErrorsOnly: 'Show errors only',
    },
    tableHeaders: {
      index: 'No.',
      action: 'Action',
    },
  },
  confirmation: {
    title: 'Upload Result',
  },
  common: {
    sheetLabel: 'Sheet:',
    stepIndicator: (current, total) => `${current} of ${total}`,
  },
}
//# sourceMappingURL=types.js.map
