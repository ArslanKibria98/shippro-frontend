import React, { useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import BulkHandleLabel from "./BulkHandleLabel";

const BulkDownloadLabels = ({ labelDataList, uploadedExcelFile }) => {
  const labelRefs = useRef([]);
  const [modifiedExcelBlob, setModifiedExcelBlob] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
          XLSX.utils.book_append_sheet(updatedWorkbook, updatedWorksheet, "Sheet1");

          const excelBinaryString = XLSX.write(updatedWorkbook, {
            type: "binary",
            bookType: "xlsx",
          });

          const excelBlob = new Blob([s2ab(excelBinaryString)], {
            type: "application/octet-stream",
          });

          setModifiedExcelBlob(excelBlob);
          resolve(excelBlob);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(uploadedExcelFile);
    });
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const downloadZip = async () => {
    setIsDownloading(true);
    const zip = new JSZip();

    try {
      // Add PDF files
      for (let i = 0; i < labelRefs.current.length; i++) {
        const pdfBlob = await generatePDF(labelRefs.current[i], i);
        zip.file(`Label_${i + 1}.pdf`, pdfBlob);
      }

      // Add modified Excel file
      const excelBlob = await modifyExcelFile();
      if (excelBlob) {
        zip.file("Updated_Tracking_List.xlsx", excelBlob);
      }

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Labels_and_Tracking.zip");
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
        className="download_button"
        disabled={isDownloading}
      >
        {isDownloading ? "Downloading..." : "Download All Labels as ZIP"}
      </button>
      <div style={{ display: "none" }}>
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