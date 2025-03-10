import React, { useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { PDFDocument } from "pdf-lib";
import BulkHandleLabel from "./BulkHandleLabel";

const BulkDownloadLabels = ({ labelDataList, uploadedExcelFile }) => {
  const labelRefs = useRef([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Generate individual PDF
  const generatePDF = async (refElement, index) => {
    const options = {
      margin: [0, 0, 0, 0],
      filename: `Label_${index + 1}.pdf`,
      html2canvas: {
        scale: 3,
        dpi: 300,
        letterRendering: true,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: [101.6, 152.4],
        orientation: "portrait",
      },
    };
    return await html2pdf().set(options).from(refElement).outputPdf("blob");
  };

  // Merge all PDFs into single file
  const mergePDFs = async (pdfBlobs) => {
    const mergedPdf = await PDFDocument.create();
    for (const pdfBlob of pdfBlobs) {
      const pdfBytes = await pdfBlob.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }
    return await mergedPdf.save();
  };

  // Modify Excel with tracking numbers (FIXED)
  const modifyExcelFile = async () => {
    if (!uploadedExcelFile) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const updatedData = jsonData.map((row, index) => ({
            ...row,
            TrackingNumber: labelDataList[index]?.trackingNumber || "N/A",
          }));

          const updatedWorksheet = XLSX.utils.json_to_sheet(updatedData);
          const updatedWorkbook = XLSX.utils.book_new();
          
          // CORRECTED METHOD NAME
          XLSX.utils.book_append_sheet(updatedWorkbook, updatedWorksheet, "Sheet1");

          const excelBinaryString = XLSX.write(updatedWorkbook, {
            type: "binary",
            bookType: "xlsx",
          });

          return resolve(new Blob([s2ab(excelBinaryString)], {
            type: "application/octet-stream",
          }));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(uploadedExcelFile);
    });
  };

  // Binary conversion helper
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  // Main download handler
  const downloadZip = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    const zip = new JSZip();
    let processedCount = 0;
    const totalLabels = labelDataList.length;
    const hasExcel = !!uploadedExcelFile;
    const totalSteps = totalLabels + (hasExcel ? 1 : 0) + 1; // +1 for merged PDF
    const pdfBlobs = [];

    try {
      // Generate individual PDFs
      for (let i = 0; i < totalLabels; i++) {
        const pdfBlob = await generatePDF(labelRefs.current[i], i);
        pdfBlobs.push(pdfBlob);
        zip.file(`Label_${i + 1}.pdf`, pdfBlob);
        processedCount++;
        setDownloadProgress(Math.round((processedCount / totalSteps) * 100));
      }

      // Add merged PDF
      if (pdfBlobs.length > 0) {
        const mergedPdfBytes = await mergePDFs(pdfBlobs);
        zip.file("All_Labels_Merged.pdf", mergedPdfBytes);
        processedCount++;
        setDownloadProgress(Math.round((processedCount / totalSteps) * 100));
      }

      // Add modified Excel
      if (hasExcel) {
        const excelBlob = await modifyExcelFile();
        if (excelBlob) {
          zip.file("Updated_Tracking_List.xlsx", excelBlob);
          processedCount++;
          setDownloadProgress(Math.round((processedCount / totalSteps) * 100));
        }
      }

      // Generate and save ZIP
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Labels_and_Tracking.zip");
      setDownloadProgress(100);
    } catch (error) {
      console.error("Error generating files:", error);
      alert("Failed to generate download files. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-lg font-semibold mb-4">Download Generated Labels</h2>
      <button 
        onClick={downloadZip} 
        className="download-button relative h-12 w-48 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
        disabled={isDownloading}
      >
        {isDownloading ? (
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-current text-gray-200"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-current text-blue-600"
                strokeWidth="4"
                fill="none"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * downloadProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700">
              {downloadProgress}%
            </span>
          </div>
        ) : (
          <span className="text-blue-600 font-medium">Download All Labels as ZIP</span>
        )}
      </button>
      
      {/* Hidden label renderer */}
      <div style={{ display: 'none' }}>
        {labelDataList.map((formData, index) => (
          <BulkHandleLabel
            key={index}
            formData={formData}
            ref={(el) => (labelRefs.current[index] = el)}
          />
        ))}
      </div>
    </div>
  );
};

export default BulkDownloadLabels;