import React, { useState } from 'react';
import Invoice from './Invoice';
import './InvoiceForm.css';

const InvoiceForm = () => {
    const [formData, setFormData] = useState({
        sellerDetails: [{ name: '', address: '', city: '', state: '', pincode: '', pan: '', gst: '' }],
        billingDetails: [{ name: '', address: '', city: '', state: '', pincode: '', stateCode: '' }],
        shippingDetails: [{ name: '', address: '', city: '', state: '', pincode: '', stateCode: '' }],
        placeOfSupply: '',
        placeOfDelivery: '',
        orderDetails: [{ orderNo: '', orderDate: '' }],
        invoiceDetails: [{ invoiceNo: '', invoiceDate: '' }],
        reverseCharge: 'No',
        items: [],
        signature: '',
        logo: ''
    });
    const [invoiceData, setInvoiceData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, index, field] = name.split('.');
        if (section === 'items') {
            const itemIndex = parseInt(index);
            setFormData(prevData => {
                const items = [...prevData.items];
                items[itemIndex] = { ...items[itemIndex], [field]: value };
                return { ...prevData, items };
            });
        } else {
            setFormData(prevData => {
                const sectionData = [...prevData[section]];
                sectionData[0] = { ...sectionData[0], [field]: value };
                return { ...prevData, [section]: sectionData };
            });
        }
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const items = [...prevData.items];
            items[index] = { ...items[index], [name]: value };
            return { ...prevData, items };
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({
            ...formData,
            [name]: URL.createObjectURL(files[0]),
        });
    };

    const handleAddItem = () => {
        setFormData(prevData => ({
            ...prevData,
            items: [...prevData.items, { description: '', unitPrice: '', quantity: '', discount: '', taxRate: '', taxAmount: '', shippingCharges: '', shippingTax: '' }],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedItems = formData.items.map(item => {
            const netAmount = item.unitPrice * item.quantity - item.discount;
            const taxRate = formData.placeOfSupply === formData.placeOfDelivery ? 9 : 18;
            const taxAmount = netAmount * taxRate / 100;
            return { ...item, netAmount, taxAmount };
        });
        setFormData(prevData => ({
            ...prevData,
            items: updatedItems,
        }));
        setInvoiceData(formData);
    };

    return (
        <div>
            <form className="invoice-form" onSubmit={handleSubmit}>
                {/* Seller Details */}
                <h2>Sold By :</h2>
                {formData.sellerDetails.map((detail, index) => (
                    <div key={index}>
                        <input type="text" name={`sellerDetails.${index}.name`} placeholder="Name" value={detail.name} onChange={handleChange} />
                        <input type="text" name={`sellerDetails.${index}.address`} placeholder="Address" value={detail.address} onChange={handleChange} />
                        <input type="text" name={`sellerDetails.${index}.city`} placeholder="City" value={detail.city} onChange={handleChange} />
                        <input type="text" name={`sellerDetails.${index}.state`} placeholder="State" value={detail.state} onChange={handleChange} />
                        <input type="text" name={`sellerDetails.${index}.pincode`} placeholder="Pincode" value={detail.pincode} onChange={handleChange} />
                        <input type="text" name={`sellerDetails.${index}.pan`} placeholder="PAN No" value={detail.pan} onChange={handleChange} />
                        <input type="text" name={`sellerDetails.${index}.gst`} placeholder="GST Registration No" value={detail.gst} onChange={handleChange} />
                    </div>
                ))}

                {/* Order Details */}
                <h2>Order Details</h2>
                {formData.orderDetails.map((detail, index) => (
                    <div key={index}>
                        <input type="text" name={`orderDetails.${index}.orderNo`} placeholder="Order No" value={detail.orderNo} onChange={handleChange} />
                        <input type="date" name={`orderDetails.${index}.orderDate`} placeholder="Order Date" value={detail.orderDate} onChange={handleChange} />
                    </div>
                ))}

                {/* Billing Details */}
                <h2>Billing Address</h2>
                {formData.billingDetails.map((detail, index) => (
                    <div key={index}>
                        <input type="text" name={`billingDetails.${index}.name`} placeholder="Name" value={detail.name} onChange={handleChange} />
                        <input type="text" name={`billingDetails.${index}.address`} placeholder="Address" value={detail.address} onChange={handleChange} />
                        <input type="text" name={`billingDetails.${index}.city`} placeholder="City" value={detail.city} onChange={handleChange} />
                        <input type="text" name={`billingDetails.${index}.state`} placeholder="State" value={detail.state} onChange={handleChange} />
                        <input type="text" name={`billingDetails.${index}.pincode`} placeholder="Pincode" value={detail.pincode} onChange={handleChange} />
                        <input type="text" name={`billingDetails.${index}.stateCode`} placeholder="State/UT Code" value={detail.stateCode} onChange={handleChange} />
                    </div>
                ))}

                {/* Shipping Details */}
                <h2>Shipping Address</h2>
                {formData.shippingDetails.map((detail, index) => (
                    <div key={index}>
                        <input type="text" name={`shippingDetails.${index}.name`} placeholder="Name" value={detail.name} onChange={handleChange} />
                        <input type="text" name={`shippingDetails.${index}.address`} placeholder="Address" value={detail.address} onChange={handleChange} />
                        <input type="text" name={`shippingDetails.${index}.city`} placeholder="City" value={detail.city} onChange={handleChange} />
                        <input type="text" name={`shippingDetails.${index}.state`} placeholder="State" value={detail.state} onChange={handleChange} />
                        <input type="text" name={`shippingDetails.${index}.pincode`} placeholder="Pincode" value={detail.pincode} onChange={handleChange} />
                        <input type="text" name={`shippingDetails.${index}.stateCode`} placeholder="State/UT Code" value={detail.stateCode} onChange={handleChange} />
                    </div>
                ))}

                {/* Place of Supply */}
                <h2>Place of Supply</h2>
                <input type="text" name="placeOfSupply" placeholder="Place of Supply" value={formData.placeOfSupply} onChange={handleChange} />

                {/* Place of Delivery */}
                <h2>Place of Delivery</h2>
                <input type="text" name="placeOfDelivery" placeholder="Place of Delivery" value={formData.placeOfDelivery} onChange={handleChange} />

                {/* Invoice Details */}
                <h2>Invoice Details</h2>
                {formData.invoiceDetails.map((detail, index) => (
                    <div key={index}>
                        <input type="text" name={`invoiceDetails.${index}.invoiceNo`} placeholder="Invoice No" value={detail.invoiceNo} onChange={handleChange} />
                        <input type="date" name={`invoiceDetails.${index}.invoiceDate`} placeholder="Invoice Date" value={detail.invoiceDate} onChange={handleChange} />
                    </div>
                ))}

                {/* Reverse Charge */}
                <h2>Reverse Charge</h2>
                <select name="reverseCharge" value={formData.reverseCharge} onChange={handleChange}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>

                {/* Items */}
                <h2>Items</h2>
                {formData.items.map((item, index) => (
                    <div key={index} className="item">
                        <input type="text" name="description" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, e)} />
                        <input type="number" name="unitPrice" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, e)} />
                        <input type="number" name="quantity" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
                        <input type="number" name="discount" placeholder="Discount" value={item.discount} onChange={(e) => handleItemChange(index, e)} />
                        <input type="number" name="taxAmount" placeholder="GST Rates (%)" value={item.taxAmount} onChange={(e) => handleItemChange(index, e)} />
                        <input type="number" name="shippingCharges" placeholder="Shipping Charges" value={item.shippingCharges} onChange={(e) => handleItemChange(index, e)} />
                        <input type="number" name="shippingTax" placeholder="Shipping: Tax Rates (%) " value={item.shippingTax} onChange={(e) => handleItemChange(index, e)} />
                        <br />
                        <button type="button" onClick={() => setFormData(prevData => ({
                            ...prevData,
                            items: prevData.items.filter((_, i) => i !== index)
                        }))}>Remove Item</button>
                    </div>
                ))}
                <br />
                <button type="button" onClick={handleAddItem}>Add Item</button>

                {/* Signature */}
                <h2>Signature</h2>
                <input type="file" name="signature" onChange={handleFileChange} />

                {/* Logo */}
                <h2>Logo</h2>
                <input type="file" name="logo" onChange={handleFileChange} />

                <button type="submit">Generate Invoice</button>
            </form>

            {invoiceData && <Invoice data={invoiceData} />}
        </div>
    );
};

export default InvoiceForm;
