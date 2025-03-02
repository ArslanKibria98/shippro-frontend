import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import html2pdf from "html2pdf.js";
// import jsPDF from "jspdf";

import shippoLogo from './one2.svg';
import bwipjs from "bwip-js";

const HandleLabel = ({ formData }) => {
  console.log(formData)
  const labelRef = useRef(null);
  const barcodeRef = useRef(null);
 const sbarcode = useRef(null);
 const sbarcode1 = useRef(null);
 var cleanTrackingNumber = formData.trackingNumber.replace(/\s+/g, ''); // This removes all spaces

 var formattedTracking = cleanTrackingNumber.replace(/(.{4})/g, '$1 ').trim();
  useEffect(() => {
    if (formData.trackingNumber) {
      JsBarcode(barcodeRef.current, cleanTrackingNumber, {
        format: "CODE128",
        lineColor: "black",
        width: 1.75,
        height: 80,
        margin: 0, // Remove padding/margin around barcode
        flat: true, // Ensures no extra white space around barcode
        displayValue: false
      });
    }
  }, [formData.trackingNumber]);

 

  const generateBarcode = (canvasRef) => {
    if (formData.trackingNumber && canvasRef) {

      try {
        bwipjs.toCanvas(canvasRef, {
          bcid: "datamatrix", // Generates a DataMatrix barcode
          text: "42022124 " + cleanTrackingNumber, // Content
          scale: 4,  
          height: 5,  
          width: 5,
          includetext: false
        });
      } catch (error) {
        console.error("Barcode generation error:", error);
      }
    }
  };

  useEffect(() => {
    generateBarcode(sbarcode1.current);
    generateBarcode(sbarcode.current);
  }, [formData.trackingNumber]);
  const downloadLabel = () => {
    if (labelRef.current) {
      const options = {
        margin: [0, 0, 0, 0], 
        filename: 'USPS_Label.pdf',
        // image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 3,   
            dpi: 300, 
            letterRendering: true,
            useCORS: true, 
            scrollY: 0  
        },
        jsPDF: { 
            unit: 'mm', 
            format: [101.6, 152.4],  
            orientation: 'portrait' 
        }
    };
      html2pdf().set(options).from(labelRef.current).save();
    }
  };


  




  return (
<div  className="mt-6 border p-4 bg-gray-100">
<div class="label-container" id="label" ref={labelRef}>
        <div class="header">
            <div id="large-letter" class="large-letter">{formData.labelType == 'ground_advantage' ? 'G' : 'P'}
            </div>
            <div>
            <div class="label_reference">
              <span id="label_reference_type">{formData.labelType == 'ground_advantage' ? 'USPS GROUND ADVANTAGE' : 'PRIORITY MAIL'} </span><br></br>
                U.S. POSTAGE PAID<br></br>
                <span id="vendor_brand">{formData.vendor}</span><br></br>
                e-Postage 
            </div>
            <span id="additional_info">{formData.vendor == 'Shippo' ? 'Cubic':''}</span>
        </div>
        </div>
        <h3 class="label_type">{formData.labelType === 'ground_advantage' ? (
  <>
    GROUND ADVANTAGE<sup>TM</sup>
  </>
) :  <>
USPS PRIORITY MAIL<sup>®</sup>
</>}</h3>
<div class="info" id="labelInfo">
            <div class="address_label_info">
                <div class="to_address_info">
                {formData.senderName}<br></br>
                {formData.senderAddress}<br></br>
                {formData.senderCity}, {formData.senderState}, {formData.senderZip}<br></br>
                <br></br>
                </div>
                <div class="parcel_info">
                  {formData.vendor == 'ATFM' ? (<>
                   Mailed From: 22305 <br></br>
                   WT: {formData.weight} {formData.weight <= 1 ? 'lb' : 'lbs'}
                   </>
                  ):<></>
                  }
                   {formData.vendor == 'Shippo' ? (<>
                   Ship Date: {new Date().toLocaleDateString('en-US')} <br></br>
                   WT: {formData.weight} {formData.weight <= 1 ? 'lb' : 'lbs'}
                   </>
                  ):<></>
                  }
                </div>
                </div>
                <div class="from_address_info">
                {formData.vendor == 'ATFM' ? (<>
                   Ship <br></br>
                   To:
                   </>
                  ):<></>
                  }
                     {formData.vendor == 'Shippo' ? (<>
                      <canvas ref={sbarcode}/>
                   </>
                  ):<></>
                  }
      <div>
                {formData.recipientName}<br></br>
                {formData.recipientAddress}<br></br>
                {formData.recipientCity}, {formData.recipientState}, {formData.recipientZip}<br></br>
                <div>
                <br></br>
                </div>
            </div></div></div>
        <div class="barcode">
            <div class="tracking_heading">USPS TRACKING # - EP</div>
      <svg ref={barcodeRef}></svg>
            <div id="tracking-number">{formattedTracking}</div>
        </div>


        {formData.vendor == 'Shippo' ? (<>
        <div class="end_label_container">
        <div id="end_label">
            <div class="shippo-logo" id="shippo-logo">
                <img width="120px" src={shippoLogo} alt="Shippo Logo"/>
              </div>
        </div>
        <canvas ref={sbarcode1}/>
 
     </div>
     </>
      ):<></>
    }
        {/* <!-- <button onclick="">Download PDF</button> --> */}
    </div> 

      <button onClick={downloadLabel} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Download Label
      </button>
    </div>
  );
};

export default HandleLabel;
