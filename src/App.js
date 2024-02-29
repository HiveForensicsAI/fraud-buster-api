import React, { useState } from "react";
import "./App.css";
import useApi from "./hooks/useApi"; // Import the hook

const App = () => {
  const [riskAssessment, setRiskAssessment] = useState({
    message: "",
    color: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    product: "",
    amount: "",
    location: "",
    Profile: "",
    onlinePurchase: true,
    paymentMethod: "",
    shippingAddress: "",
    billingAddress: "",
    Email: "",
    Name: "",
    isVPN: false,
  });

  const { postData, isLoading, error } = useApi(); // Use the hook

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Adding current time in ISO format to formData before submitting
    const currentTime = new Date().toISOString();
    const apiData = {
      ...formData,
      onlinePurchase: formData.onlinePurchase ? "Yes" : "No",
      isVPN: formData.isVPN ? "Yes" : "No",
      time: currentTime, // Add the current time here
    };

    const response = await postData(
      "http://localhost:7000/api/transaction",
      apiData,
      "fc9c4e0a-2cde-47f0-81ae-da31a6af52cb"
    );

    if (response.RiskScore) {
      if (response.RiskScore < 50) {
        setRiskAssessment({ message: "Proceed to payment", color: "green" });
      } else if (response.RiskScore >= 50 && response.RiskScore < 65) {
        setRiskAssessment({ message: "Review payment", color: "yellow" });
      } else {
        setRiskAssessment({ message: "Risky payment", color: "red" });
      }
    }
    console.log(response); // Log or handle API response
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Product:
        <input
          type="text"
          name="product"
          value={formData.product}
          onChange={handleChange}
        />
      </label>
      <label>
        Amount:
        <input
          type="text"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
        />
      </label>
      <label>
        Payment Method:
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="">Select one...</option>
          <option value="creditCard">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bitcoin">Bitcoin</option>
        </select>
      </label>
      <label>
        Shipping Address:
        <input
          type="text"
          name="shippingAddress"
          value={formData.shippingAddress}
          onChange={handleChange}
        />
      </label>
      <label>
        Billing Address:
        <input
          type="text"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
        />
      </label>
      <label>
        Name:
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
        />
      </label>
      {isLoading && <p>Sending data...</p>}
      {error && <p>Error: {error}</p>}
      <button type="submit">Submit Payment</button>
      {riskAssessment.message && (
        <div
          style={{
            position: "absolute", // Or 'fixed' depending on your needs
            top: "20%", // Adjust based on your layout
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: riskAssessment.color,
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 1000, // Ensure it's above other content
          }}
        >
          {riskAssessment.message}
        </div>
      )}
    </form>
  );
};

export default App;
