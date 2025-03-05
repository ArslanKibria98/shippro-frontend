import React, { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import html2pdf from "html2pdf.js";
import bwipjs from "bwip-js";
import shippoLogo from './one2.svg';

const BulkHandleLabel = React.forwardRef(({ formData }, ref) => {
  const labelRef = useRef(null);
  const barcodeRef = useRef(null);
  const sbarcode = useRef(null);
  const sbarcode1 = useRef(null);
  // const [barcodeImg, setBarcodeImg] = useState(null); // Use state for barcode image URL
  const cleanTrackingNumber = formData.trackingNumber.replace(/\s+/g, '');
  const formattedTracking = cleanTrackingNumber.replace(/(.{4})/g, '$1 ').trim();
   


  const formatZipCode = (zip) => {
    // Convert input to string if it's not already a string
    const zipString = String(zip || '');
  
    // Split into parts based on the dash and take only the part before the dash
    const [zipPart1] = zipString.split('-');
  
    // Remove non-numeric characters and ensure the first part is at least 5 digits long
    const formattedZip = zipPart1.replace(/\D/g, '').padStart(5, '0');
  
    // Return the formatted ZIP code
    return formattedZip;
  };
  

  const formatZipCodeBeforeDash = (zip) => {
    // Convert input to string if it's not already a string
    const zipString = String(zip || '');
  
    // Check if the ZIP code contains a dash
    const hasDash = zipString.includes('-');
  
    // Split into parts only if it has a dash
    let zipPart1 = zipString;
    let zipPart2 = '';
  
    if (hasDash) {
      [zipPart1, zipPart2] = zipString.split('-');
    }
  
    // Remove non-numeric characters and ensure the first part is at least 5 digits long
    zipPart1 = zipPart1.replace(/\D/g, '').padStart(5, '0');
  
    // Return formatted ZIP code with or without the second part
    return zipPart2 ? `${zipPart1}-${zipPart2}` : zipPart1;
  };

  // Barcode generation for CODE128
  // useEffect(() => {
  //   if (formData.trackingNumber) {
  //     JsBarcode(barcodeRef.current, cleanTrackingNumber, {
  //       format: "CODE128",
  //       lineColor: "black",
  //       width: 1.93,
  //       height: 80,
  //       margin: 0,
  //       displayValue: false,
  //     });
  //   }
  // }, [formData.trackingNumber]);




  
//   const textData =  {barcode_data_url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvoAAAB8AgMAAABlB/yqAAAADFBMVEX///8AAABmVWZmgGYbl+3aAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA70lEQVR4nO3OQUrEQBAF0IoQEPfZi1svkSNkMXUfjzLH8DgexV/BcfbCgIv3CU2lu6v6VYmIyF+z9H6prY/q7uVIsWWne691X27rclSKPov+udOXNY33rpxmp9ZOXbWlyJdrqWdCZk5vZUKeS+N8c+d8Ylrm9D5h7dvpDEnXrOeQ83cm8PPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/M/2i/yL/Ly9Vt+vF+r3j7rNeX8Pz0/5slvWB4NJ8ydid0AAAAASUVORK5CYII=",
//     success: true}

//     console.log(textData.barcode_data_url);
//     setBarcodeImg(textData.barcode_data_url);
// }
// }, [formData.trackingNumber]);





  // Barcode generation for DataMatrix

    

  const generateBarcode = (canvasRef) => {
    if (formData.trackingNumber && canvasRef) {
      try {
        bwipjs.toCanvas(canvasRef, {
          bcid: "datamatrix",
          text: "420" + formatZipCode(formData.recipientZip) + cleanTrackingNumber,
          scale: 4,
          height: 5,
          width: 5,
          includetext: false,
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

  // PDF download functionality
  const downloadLabel = () => {
    if (labelRef.current) {
      const options = {
        margin: [0, 0, 0, 0],
        filename: 'USPS_Label.pdf',
        html2canvas: { scale: 3, dpi: 300, letterRendering: true, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: [101.6, 152.4], orientation: 'portrait' },
      };
      html2pdf().set(options).from(labelRef.current).save();
    }
  };

  // Render vendor-specific HTML
  const renderVendorLabel = () => {
    switch (formData.vendor) {
      case 'Shippo':
        return (<div style={{display:'none'}}>

          <div className="label-container" id="label" ref={ref}>
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
                  {formData.recipientCity} {formData.recipientState} {formatZipCodeBeforeDash(formData.recipientZip)}<br />
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
          <div className="label-container" id="label" ref={ref}>
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
                  {formData.recipientCity} {formData.recipientState} {formatZipCodeBeforeDash(formData.recipientZip)}<br />
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
          <div className="label-container evs_label" id="label" ref={ref} >
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
                  {formData.recipientCity} {formData.recipientState} {formatZipCodeBeforeDash(formData.recipientZip)}<br />
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
          <div className="label-container rollo_label" id="label" ref={ref}>
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
                  {formData.recipientCity}, {formData.recipientState}, {formatZipCodeBeforeDash(formData.recipientZip)}<br />
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
    <div>
      {renderVendorLabel()}
      <button onClick={downloadLabel} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Download Label
      </button>
    </div>
  );
});

export default BulkHandleLabel;