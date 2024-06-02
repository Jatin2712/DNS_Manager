import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../base.css";
import { ToastContainer, toast } from "react-toastify";

const baseURL = 'https://dns-manager-a549.onrender.com/api';

const DNSRecordForm = () => {
  const [formData, setFormData] = useState({
    dnsType: "",
    name: "",
    value: "",
    ttl: "",
  });

  const fieldLabels = {
    dnsType: "DNS Type",
    name: "Name",
    value: "Value",
    ttl: "TTL",
  };

  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(baseURL+`/dnsTypes/`)
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching types:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipAddressRegex.test(formData.value)) {
      toast.error(
        "Please enter a valid IP address in the format 255.255.255.255"
      );
      return;
    }

    const emptyFields = Object.entries(formData)
      .filter(([key, value]) => !value)
      .map(([key, value]) => fieldLabels[key]);

    if (emptyFields.length === 1) {
      toast.error(`${emptyFields[0]} is required!`);
    } else if (emptyFields.length > 1) {
      toast.error("All fields are required!");
    } else {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const dataToSend = {
        ...formData,
        user: userId,
      };

      axios
        .post(baseURL`/dnsRecords`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("DNS record added:", response.data);
          setFormData({
            dnsType: "",
            name: "",
            value: "",
            ttl: "",
          });
          navigate("/dns-table", { state: { message: response.data.message } });
        })
        .catch((error) => {
          console.error("Error adding DNS record:", error);
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <div className="addDNSFrom">
      <ToastContainer position="top-right" />
      <h2>Add DNS Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="dnsType" className="form-label">
            DNS Type
          </label>
          <select
            className="form-select"
            id="dnsType"
            name="dnsType"
            value={formData.dnsType}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            {types.map((dnsType) => (
              <option key={dnsType._id} value={dnsType._id}>
                {dnsType.type}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="value" className="form-label">
            Value
          </label>
          <input
            type="text"
            className="form-control"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            onKeyPress={(e) => {
              const inputValue = e.key;
              if (
                (e.target.value === "" && isNaN(inputValue)) ||
                (e.target.value === "0" && inputValue === "0") ||
                (isNaN(inputValue) && inputValue !== ".") ||
                inputValue === " "
              ) {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ttl" className="form-label">
            TTL
          </label>
          <input
            type="text"
            className="form-control"
            id="ttl"
            name="ttl"
            value={formData.ttl}
            onChange={handleChange}
            onKeyPress={(e) => {
              const inputValue = e.key;
              const currentValue = e.target.value;
              const dotIndex = currentValue.indexOf(".");
              if (
                (inputValue === "." && (dotIndex === 0 || dotIndex !== -1)) ||
                (isNaN(inputValue) &&
                  inputValue !== "Backspace" &&
                  inputValue !== "Delete") ||
                inputValue === " "
              ) {
                e.preventDefault();
              }
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DNSRecordForm;
