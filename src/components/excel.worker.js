/* eslint-disable no-restricted-globals */
/* global importScripts, FileReaderSync, XLSX */

self.onmessage = function(e) {
    try {
      const { file, trackingNumbers } = e.data;
      const reader = new FileReaderSync();
      const data = reader.readAsArrayBuffer(file);
      const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      const updatedData = jsonData.map((row, index) => ({
        ...row,
        TrackingNumber: trackingNumbers[index] || "N/A"
      }));
  
      const updatedWorksheet = XLSX.utils.json_to_sheet(updatedData);
      const updatedWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(updatedWorkbook, updatedWorksheet, "Sheet1");
  
      const excelBinary = XLSX.write(updatedWorkbook, {
        type: "binary",
        bookType: "xlsx"
      });
  
      const buffer = new ArrayBuffer(excelBinary.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < excelBinary.length; i++) {
        view[i] = excelBinary.charCodeAt(i) & 0xff;
      }
  
      self.postMessage({
        blob: new Blob([buffer], { type: "application/octet-stream" })
      });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };