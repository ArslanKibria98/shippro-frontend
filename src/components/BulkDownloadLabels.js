// BulkDownloadLabels.js
import React, { useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import BulkHandleLabel from "./BulkHandleLabel"; // Import the component above

const BulkDownloadLabels = ({ labelDataList }) => {
  const labelRefs = useRef([]);

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
    // Convert the referenced element (a DOM node) to a PDF blob
    return await html2pdf().set(options).from(refElement).outputPdf("blob");
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    for (let i = 0; i < labelRefs.current.length; i++) {
      const pdfBlob = await generatePDF(labelRefs.current[i], i);
      zip.file(`Label_${i + 1}.pdf`, pdfBlob);
    }
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "USPS_Labels.zip");
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mt-6">
      {/* <h2 className="text-lg font-semibold mb-4">Download Generated Labels</h2> */}
      <button onClick={downloadZip} className="download_button">
        Download All Labels as ZIP
      </button>
      {/* Render labels invisibly for PDF generation */}
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
