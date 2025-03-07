import React, { useEffect, useRef }  from "react";
import JsBarcode from "jsbarcode";
import html2pdf from "html2pdf.js";
// import jsPDF from "jspdf";
import shippoLogo from './one2.svg';
import bwipjs from "bwip-js";
const DownloadHistory = ({ formData }) => {
    const labelRef = useRef(null);
    const barcodeRef = useRef(null);
   const sbarcode = useRef(null);
   const sbarcode1 = useRef(null);
   var cleanTrackingNumber = formData.trackingNumber.replace(/\s+/g, ''); // This removes all spaces
   var formattedTracking = cleanTrackingNumber.replace(/(.{4})/g, '$1 ').trim();
    // useEffect(() => {
    //   if (formData.trackingNumber) {
    //     JsBarcode(barcodeRef.current, cleanTrackingNumber, {
    //       format: "CODE128",
    //       lineColor: "black",
    //       width: 1.75,
    //       height: 80,
    //       margin: 0, // Remove padding/margin around barcode
    //       flat: true, // Ensures no extra white space around barcode
    //       displayValue: false
    //     });
    //   }
    // }, [formData.trackingNumber]);
  
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

    const renderVendorLabel = () => {
      switch (formData.vendor) {
        case 'Shippo':
          return (<div style={{display:'none'}}>
  
            <div className="label-container" id="label" ref={labelRef}>
              <div className="header">
                <div id="large-letter" className="large-letter">
                  {formData.labelType === 'ground_advantage' ? 'G' : 'P'}
                </div>
                <div>
                  <div className="label_reference">
                    <span id="label_reference_type">
                      {formData.labelType === 'ground_advantage' ? 'USPS GROUND ADVANTAGE' : 'PRIORITY MAIL'}
                    </span>
                    <br />
                    U.S. POSTAGE PAID<br />
                    <span id="vendor_brand">{formData.vendor}</span><br />
                    e-Postage
                  </div>
                  <span id="additional_info">{formData.vendor === 'Shippo' ? 'Cubic' : ''}</span>
                </div>
              </div>
              <h3 className="label_type">
                {formData.labelType === 'ground_advantage' ? (
                  <>GROUND ADVANTAGE<sup>TM</sup></>
                ) : (
                  <>USPS PRIORITY MAIL<sup>®</sup></>
                )}
              </h3>
              <div className="info" id="labelInfo">
                <div className="address_label_info">
                  <div className="to_address_info">
                    {formData.senderName}<br />
                    {formData.senderAddress} {formData.senderAddress1}<br />
                    {formData.senderCity} {formData.senderState} {formData.senderZip}<br />
                    <br />
                  </div>
                  <div className="parcel_info">
                    Ship Date: {new Date().toLocaleDateString('en-US')}<br />
                    WT: {formData.weight} {formData.weight <= 1 ? 'lb' : 'lbs'}
                  </div>
                </div>
                <div className="from_address_info">
                  <canvas ref={sbarcode} />
                  <div>
                    {formData.recipientName}<br />
                    {formData.recipientAddress} {formData.recipientAddress1}<br />
                    {formData.recipientCity} {formData.recipientState} {formData.recipientZip}<br />
                    <br />
                  </div>
                </div>
              </div>
              <div className="barcode">
                <div className="tracking_heading">USPS TRACKING # EP</div>
                {/* <svg ref={barcodeRef}></svg> */}
                <img style={{width:'100%'}} src={formData.barcodeImg}></img>
                <div id="tracking-number">{formattedTracking}</div>
              </div>
              <div className="end_label_container">
                <div id="end_label">
                  <div className="shippo-logo" id="shippo-logo">
                    <img width="120px" src={shippoLogo} alt="Shippo Logo" />
                  </div>
                </div>
                <canvas ref={sbarcode1} />
              </div>
            </div>
            </div>
          );
  
        case 'ATFM':
          return (<div style={{display:'none'}}>
            <div className="label-container" id="label" ref={labelRef}>
               <div className="header">
                <div id="large-letter" className="large-letter">
                  {formData.labelType === 'ground_advantage_tm' ? 'G' : 'P'}
                </div>
                <div>
                  <div className="label_reference">
                    <span id="label_reference_type">
                      {formData.labelType === 'ground_advantage_tm' ? 'USPS GROUND ADVANTAGE' : 'PRIORITY MAIL'}
                    </span>
                    <br />
                    U.S. POSTAGE PAID<br />
                    <span id="vendor_brand">{formData.vendor}</span><br />
                    e-Postage
                  </div>
                  <span id="additional_info">{formData.vendor === 'Shippo' ? 'Cubic' : ''}</span>
                </div>
              </div>
              <h3 className="label_type">
                {formData.labelType === 'ground_advantage_tm' ? (
                  <>GROUND ADVANTAGE<sup>TM</sup></>
                ) : (
                  <>USPS PRIORITY MAIL<sup>®</sup></>
                )}
              </h3>
              <div className="info" id="labelInfo">
                <div className="address_label_info">
                  <div className="to_address_info">
                    {formData.senderName}<br />
                    {formData.senderAddress} {formData.senderAddress1}<br />
                    {formData.senderCity} {formData.senderState} {formData.senderZip}<br />
                    <br />
                  </div>
                  <div className="parcel_info">
                     Mailed From: {formData.senderZip} <br />
                    WT: {formData.weight} {formData.weight <= 1 ? 'lb' : 'lbs'}
                  </div>
                </div>
                <div className="from_address_info">
                Ship <br></br>
                To:
                  <div>
                    {formData.recipientName}<br />
                    {formData.recipientAddress} {formData.recipientAddress1}<br />
                    {formData.recipientCity} {formData.recipientState} {formData.recipientZip}<br />
                    <br />
                  </div>
                </div>
              </div>
              <div className="barcode">
                <div className="tracking_heading">USPS TRACKING # EP</div>
                <img style={{width:'100%'}} src={formData.barcodeImg}></img>
                <div id="tracking-number">{formattedTracking}</div>
              </div>
            </div>
            </div>
          );
  
        case 'Evs':
          return (<div style={{display:'none'}}>
            <div className="label-container evs_label" id="label" ref={labelRef} >
              <div className="header">
                <div id="large-letter" className="large-letter">
                  {formData.labelType === 'ground_advantage' ? 'G' : 'P'}
                </div>
                <div>
                  <div className="label_reference">
                    {/* <span id="label_reference_type">
                      {formData.labelType === 'ground_advantage' ? 'USPS GROUND ADVANTAGE' : 'PRIORITY MAIL'}
                    </span> */}
                    {/* <br /> */}
                    U.S. POSTAGE PAID<br />
                    PERMIT NO. 49493<br />
                    <span id="vendor_brand" style={{textAlign:'left'}}>{formData.vendor == 'Evs' ? 'eVS':''}</span><br />
  
                    </div>
                  <span id="additional_info">{formData.vendor === 'Shippo' ? 'Cubic' : ''}</span>
                </div>
              </div>
              <h3 className="label_type">
                {formData.labelType === 'ground_advantage' ? (
                  <>GROUND ADVANTAGE<sup>TM</sup></>
                ) : (
                  <>USPS PRIORITY MAIL<sup>®</sup></>
                )}
              </h3>
              <div className="info" id="labelInfo">
                <div className="address_label_info">
                  <div className="to_address_info">
                    {formData.senderName}<br />
                    {formData.senderAddress} {formData.senderAddress1}<br />
                    {formData.senderCity} {formData.senderState} {formData.senderZip}<br />
                    <br />
                  </div>
                  <div className="parcel_info">
                    <div style={{textAlign:'center'}}>{new Date().toLocaleDateString('en-US')}</div>
                     Mailed From: {formData.senderZip} <br />
                    WT: {formData.weight} {formData.weight <= 1 ? 'lb' : 'lbs'} 0 ozs
                  </div>
                </div>
                <div className="from_address_info">
                <br></br>
                
                  <div>
                    {formData.recipientName}<br />
                    {formData.recipientAddress} {formData.recipientAddress1}<br />
                    {formData.recipientCity} {formData.recipientState} {formData.recipientZip}<br />
                    <br />
                  </div>
                </div>
              </div>
              <div className="barcode">
                <div className="tracking_heading">USPS TRACKING # eVS</div>
                <img style={{width:'100%'}} src={formData.barcodeImg}></img>
                <div id="tracking-number">{formattedTracking}</div>
              </div>
            </div>
            </div>
          );
          case 'Rollo':
          return (<div style={{display:'none'}}>
            <div className="label-container rollo_label" id="label" ref={labelRef}>
              <div className="header">
                <div id="large-letter" className="large-letter">
                  {formData.labelType === 'ground_advantage' ? 'G' : 'P'}
                </div>
                <div>
                  <div style={{textAlign:'left'}} className="label_reference" >
                    U.S. POSTAGE PAID<br />
                    <span id="vendor_brand">{formData.vendor}</span><br />
                    ePostage
                  </div>
                  <span id="additional_info">{formData.vendor === 'Shippo' ? 'Cubic' : ''}</span>
                </div>
              </div>
              <h3 className="label_type">
                {formData.labelType === 'ground_advantage' ? (
                  <>GROUND ADVANTAGE</>
                ) : (
                  <>PRIORITY MAIL</>
                )}
              </h3>
              <div className="info" id="labelInfo">
                <div className="address_label_info">
                  <div className="to_address_info">
                    {formData.senderName}<br />
                    {formData.senderAddress} {formData.senderAddress1}<br />
                    {formData.senderCity} {formData.senderState} {formData.senderZip}<br />
                    <br />
                  </div>
                  <div className="parcel_info">
                    Ship Date: {new Date().toLocaleDateString('en-US')}<br />
                    Weight: {formData.weight} {formData.weight <= 1 ? 'lb' : 'lbs'} 0 oz <br />
                    <p className="parcel_no">0004</p>
                  </div>
                </div>
                <div className="from_address_info">
                  <canvas ref={sbarcode} />
                  <div>
                    {formData.recipientName}<br />
                    {formData.recipientAddress} {formData.recipientAddress1}<br />
                    {formData.recipientCity}, {formData.recipientState}, {formData.recipientZip}<br />
                    <br />
                  </div>
                </div>
              </div>
              <div className="barcode">
                <div className="tracking_heading">USPS TRACKING # EP</div>
                <img style={{width:'100%'}} src={formData.barcodeImg}></img>
                <div id="tracking-number">{formattedTracking}</div>
              </div>
              <div className="end_label_container">
                <div id="end_label">
                 
                </div>
                <canvas ref={sbarcode1} />
              </div>
            </div>
            </div>
          );
  
  
        default:
          return <div>Unsupported Vendor</div>;
      }
    };

  return (
    <div >
   {renderVendorLabel()}
      <button onClick={downloadLabel} className="download_button" >
        Download
      </button>
    </div>
  );
};

export default DownloadHistory;
