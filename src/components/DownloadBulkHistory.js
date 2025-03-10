import React, { useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import { PDFDocument } from "pdf-lib";
import BulkHandleLabel from "./BulkHandleLabel";
import { FaDownload } from 'react-icons/fa';

const DownloadBulkHistory = ({ labelDataList }) => {
  const labelRefs = useRef([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const generatePDF = async (refElement, index) => {
    const options = {
      margin: [0, 0, 0, 0],
      filename: `Label_${index + 1}.pdf`,
      html2canvas: {
        scale: 3,
        dpi: 300,
        letterRendering: true,
        useCORS: true,
        scrollY: 0
      },
      jsPDF: {
        unit: "mm",
        format: [101.6, 152.4],
        orientation: "portrait"
      }
    };
    return await html2pdf().set(options).from(refElement).outputPdf("blob");
  };

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

  const downloadZip = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    const zip = new JSZip();
    const pdfBlobs = [];
    const totalLabels = labelDataList.length;
    let processed = 0;

    try {
      // Generate individual PDFs
      for (let i = 0; i < totalLabels; i++) {
        const pdfBlob = await generatePDF(labelRefs.current[i], i);
        pdfBlobs.push(pdfBlob);
        zip.file(`Label_${i + 1}.pdf`, pdfBlob);
        processed++;
        setDownloadProgress(Math.round((processed / (totalLabels + 1)) * 100));
      }

      // Add merged PDF
      if (pdfBlobs.length > 0) {
        const mergedPdfBytes = await mergePDFs(pdfBlobs);
        zip.file("All_Labels_Merged.pdf", mergedPdfBytes);
        processed++;
        setDownloadProgress(Math.round((processed / (totalLabels + 1)) * 100));
      }

      // Generate ZIP
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Shipping_Labels.zip");
    } catch (error) {
      console.error("Download failed:", error);
      alert("Error generating download. Please try again.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mt-6">
      <button 
        onClick={downloadZip} 
        className="download-button relative h-12 w-48 flex items-center justify-center"
        disabled={isDownloading}
      >
        {isDownloading ? (
          <div style={{display:'flex', justifyContent:'center'}}>
            <div >
              <svg className="">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  className="stroke-current text-gray-200"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  className="stroke-current text-blue-600"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="88"
                  strokeDashoffset={88 - (88 * downloadProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm">
                {downloadProgress}%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2" style={{maxWidth:'40px'}}>
            <FaDownload className="text-lg" />
          </div>
        )}
      </button>

      {/* Hidden label renderer */}
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

export default DownloadBulkHistory;