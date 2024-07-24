import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Invoice.css';

const Invoice = ({ data }) => {
    console.log('data', data);

    // Extract data from arrays if they contain only one item
    const sellerDetails = data.sellerDetails[0] || {};
    const billingDetails = data.billingDetails[0] || {};
    const shippingDetails = data.shippingDetails[0] || {};
    const orderDetails = data.orderDetails[0] || {};
    // const placeOfSupply = data.placeOfSupply[0] || {};
    // const placeOfDelivery = data.placeOfDelivery[0] || {};
    // const invoiceDetails = data.invoiceDetails[0] || {};

    // State to hold the calculated data
    const [calculatedData, setCalculatedData] = useState({
        items: []
    });

    useEffect(() => {
        // Function to perform calculations
        const calculateData = () => {
            // const isPlaceOfSupplyAndDeliverySame = placeOfSupply === placeOfDelivery;
            // const taxRate = isPlaceOfSupplyAndDeliverySame ? 9 : 18;

            const updatedItems = data.items.map(item => {
                const netAmount = (item.unitPrice * item.quantity) * (1 - item.discount / 100);
                const shipppingAmount = parseFloat(item.shippingCharges)
                const taxAmount = 1 * (item.taxAmount / 1);

                const TaxAmount1 = netAmount - (netAmount * (1 - item.taxAmount / 100))
                const TaxShipping =  (item.shippingCharges)- (item.shippingCharges * (1 - item.shippingTax / 100))  
                const totalShipping = shipppingAmount + parseFloat(TaxShipping)
                const totalAmount = netAmount + TaxAmount1;
                // console.log('totalShipping', typeof(shipppingAmount))


                return {
                    ...item,
                    taxAmount: taxAmount.toFixed(2),
                    TaxShipping: TaxShipping.toFixed(2),
                    TaxAmount1: TaxAmount1.toFixed(2),
                    totalShipping: totalShipping.toFixed(2),
                    totalAmount: totalAmount.toFixed(2),
                    netAmount: netAmount.toFixed(2),
                };
            });

            setCalculatedData({ items: updatedItems });
        };

        calculateData();
    }, [data]);

    const downloadPdf = () => {
        const input = document.getElementById('invoice');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.save("invoice.pdf");
            });
    };

    return (
        <div id="invoice" className="invoice">
            <div className="invoice-header">
                <div className="logo">
                    {data.logo && <img src={data.logo} alt="Company Logo" />}
                </div>
            </div>
            <div className="invoice-section">
                <h2>Sold By :</h2>
                <p>{sellerDetails.address}</p>
                <p>{sellerDetails.city}, {sellerDetails.state}, {sellerDetails.pincode}</p>
                <h2>PAN No: {sellerDetails.pan}</h2>
                <h2>GST Registration No: {sellerDetails.gst}</h2>
            </div>
            <div className="invoice-section">
                <h2>Order No: {orderDetails.orderNo}</h2>
                <h2>Order Date: {orderDetails.orderDate}</h2>
            </div>

            <div className="invoice-section">
                <h2>Billing Address :</h2>
                <p>{billingDetails.name}</p>
                <p>{billingDetails.address}</p>
                <p>{billingDetails.city}, {billingDetails.state}, {billingDetails.pincode}</p>
                <p>State/UT Code: {billingDetails.stateCode}</p>
            </div>
            <div className="invoice-section">
                <h2>Shipping Address</h2>
                <p>{shippingDetails.name}</p>
                <p>{shippingDetails.address}</p>
                <p>{shippingDetails.city}, {shippingDetails.state}, {shippingDetails.pincode}</p>
                <p>State/UT Code: {shippingDetails.stateCode}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Sl. No.</th>
                        <th>Description</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Discount</th>
                        <th>Net Amount</th>
                        <th>Tax Rate</th>
                        <th>Tax Type</th>
                        <th>Tax Amount</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {calculatedData.items.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.description}<br /> <br /> <br /> <br />Shipping Charges</td>
                            <td>{item.unitPrice}<br /> <br /> <br /> <br /> <br /> <br />{item.shippingCharges}</td>
                            <td>{item.quantity}<br /> <br /> <br /> <br /> <br /> <br /></td>
                            <td>{item.discount}%<br /> <br /> <br /> <br /> <br /> <br /></td>
                            <td>{item.netAmount}<br /> <br /> <br /> <br /> <br />{item.shippingCharges}</td>
                            {/* <td>{item.taxAmount}%<br /> <br /> <br /> <br /> <br />{item.shippingTax}%</td> */}
                            <td>
                                {sellerDetails.state === billingDetails.state ? (
                                    <>
                                        <p>{item.taxAmount / 2}%</p>
                                        <p>{item.taxAmount / 2}%</p>
                                        <br />
                                        <p>{item.shippingTax / 2}%</p>
                                        <p>{item.shippingTax / 2}%</p>
                                    </>
                                ) : (
                                    <>
                                        <p>IGST</p>
                                        <br />
                                        <p>IGST</p>
                                    </>
                                )}
                            </td>
                            <td>
                                {sellerDetails.state === billingDetails.state ? (
                                    <>
                                        <p>CGST</p>
                                        <p>SGST</p>
                                        <br />
                                        <p>CGST</p>
                                        <p>SGST</p>
                                    </>
                                ) : (
                                    <>
                                        <p>IGST</p>
                                        <br />
                                        <p>IGST</p>
                                    </>
                                )}
                            </td>
                            <td>{item.TaxAmount1}<br /> <br /> <br /> <br /> <br />{item.TaxShipping}</td>
                            <td>{item.totalAmount}<br /> <br /> <br /> <br /> <br />{item.totalShipping}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="8">Total</td>
                        <td>{calculatedData.items.reduce((total, item) => total + parseFloat(item.TaxAmount1) + parseFloat(item.TaxShipping), 0).toFixed(2)}</td>
                        <td>{calculatedData.items.reduce((total, item) => total + parseFloat(item.totalAmount) + parseFloat(item.totalShipping), 0).toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            <div className="invoice-footer">
                <div className="signature">
                    {data.signature && <img src={data.signature} alt="Signature" />}
                    <p>For {sellerDetails.name}</p>
                    <p>Authorised Signatory</p>
                </div>
            </div>
            <button onClick={downloadPdf}>Download PDF</button>

        </div>
    );
};

export default Invoice;
