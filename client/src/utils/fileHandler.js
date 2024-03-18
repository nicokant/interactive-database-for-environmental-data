import ExcelJS from 'exceljs'
import {
  FEEDBACK_TYPES,
  FEEDBACK_CODES,
  FEEDBACK_MESSAGES
} from '../constants/feedbackMessages.js'
import { addFeedbackToStore } from './addFeedbackToStore'
import { 
  formatRiversForExcel, 
  formatStationsForExcel, 
  formatRiversForCsv, 
  formatStationsForCsv 
} from './formatData.js'

//  - - - - DOWNLOAD FUNCTIONALITY - - - -
/**
 * Generates an Excel file from the given data
 * @param {Map<number, River>} rivers - The rivers to generate the Excel file from
 * @param {Map<number, Station>} stations - The stations to generate the Excel file from
 * @param {string} type - - The type of data ('river' or 'station')
 * @returns {Promise<Blob>} A promise that resolves with a Blob representing the Excel file.
 */
export async function generateExcelFile (rivers, stations, type) {
  // Format the data for Excel
  let data = type === 'river' ? formatRiversForExcel(selectedRivers) : formatStationsForExcel(selectedStations)

  // Create a new workbook
  const workbook = new ExcelJS.Workbook()

  // Create a river worksheet, and add each river to it
  const riverSheet = workbook.addWorksheet('Elvedata')
  data.riverRows.forEach(row => {
    riverSheet.addRow(row)
  })

  // Create a station worksheet, and add each station to it
  const stationSheet = workbook.addWorksheet('Stasjonsdata')
  data.stationRows.forEach(row => {
    stationSheet.addRow(row)
  })

  // Create an observation worksheet, and add each observation to it
  const observationSheet = workbook.addWorksheet('Individdata')
  data.observationRows.forEach(row => {
    observationSheet.addRow(row)
  })

  // Write the workbook to a buffer
  const buffer = await workbook.xlsx.writeBuffer()

  // Convert the buffer to a blob
  const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

  // Return the blob
  return blob;
}

/**
 * Generates a CSV file from the given data
 * @param {Array<object>} data - The data to generate the CSV file from
 * @returns {Promise<string>} - A promise which resolves to a string containing the CSV content
 */
export async function generateCSVFile (data) {
  // Generate CSV content
  const csvContent = data.map(row => Object.values(row).join(',')).join('\n')

  // Return the blob
  return blob;
}

//  - - - - UPLOAD FUNCTIONALITY - - - -

/**
 * Validated the file type and size
 * @param {File} file - The file to validate
 * @returns {boolean} - True if the file is valid, else false
 */
export function validateFile (file) {
  // Check if the file type is valid
  if (!['.csv', '.xlsx'].includes(file.name.slice(file.name.lastIndexOf('.')))) {
    addFeedbackToStore(FEEDBACK_TYPES.ERROR, FEEDBACK_CODES.UNSUPPORTED_CONTENT_TYPE, FEEDBACK_MESSAGES.UNSUPPORTED_CONTENT_TYPE)
    return false
  }
  // Check if the file size exceeds the limit
  if (file.size > 10 * 1024 * 1024) {
    addFeedbackToStore(FEEDBACK_TYPES.ERROR, FEEDBACK_CODES.CONTENT_TO_LARGE, FEEDBACK_MESSAGES.CONTENT_TO_LARGE)
    return false
  }
  return true
}

/**
 * Reads the content of a CSV file
 * @param {File} file - The file to check
 * @param {Array<File>} filesArray - The array of files to check
 * @returns {boolean} - True if the file exists in the array, else false
 */
export function fileExistsInArray (file, filesArray) {
  return filesArray.some(existingFile => existingFile.name === file.name)
}
