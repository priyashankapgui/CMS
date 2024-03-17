import React, { useState } from 'react';

function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    paymentMethod: 'card',
    grossTotal: 0,
    discount: 0,
    netTotal: 0,
    received: 0,
    balance: 0,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update form data based on input changes
    // (e.g., calculate netTotal, balance, etc.)
    setFormData((prevFormData) => {
      let newFormData = { ...prevFormData };
      if (name === 'grossTotal' || name === 'discount') {
        newFormData.netTotal = parseFloat(newFormData.grossTotal) - parseFloat(value);
      } else if (name === 'received') {
        newFormData.balance = parseFloat(value) - parseFloat(newFormData.netTotal);
      }
      return newFormData;
    });
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="payment-method">
          <label htmlFor="paymentMethod">Payment Method:</label>
          <div>
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={handleChange}
            />
            <label htmlFor="card">Card</label>
          </div>
          <div>
            <input
              type="radio"
              id="cash"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === 'cash'}
              onChange={handleChange}
            />
            <label htmlFor="cash">Cash</label>
          </div>
        </div>
        <div className="order-summary">
          <div className="order-summary-item">
            <span>Gross Total:</span>
            <span>
              <input
                type="number"
                name="grossTotal"
                value={formData.grossTotal}
                onChange={handleInputChange}
              />
            </span>
          </div>
          <div className="order-summary-item">
            <span>Discount (%):</span>
            <span>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
              />
            </span>
          </div>
          <div className="order-summary-item">
            <span>Net Total:</span>
            <span>{formData.netTotal}</span>
          </div>
          <div className="order-summary-item">
            <span>Received:</span>
            <span>
              <input
                type="number"
                name="received"
                value={formData.received}
                onChange={handleInputChange}
              />
            </span>
          </div>
          <div className="order-summary-item">
            <span>Balance:</span>
            <span>{formData.balance}</span>
          </div>
        </div>
        <div className="form-group">
          <button type="submit">Save</button>
          <button type="button">Clear</button>
        </div>
      </form>
      {/* Add payment processing logic here if using real payments */}
    </div>
  );
}

export default CheckoutPage
