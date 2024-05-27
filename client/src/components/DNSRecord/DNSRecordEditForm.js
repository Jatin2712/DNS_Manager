import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../base.css";
const baseURL = 'http://localhost:8000/api';
const DNSRecordEditForm = () => {
  const { recordId } = useParams();
  const [formData, setFormData] = useState({
    dnsType: "",
    name: "",
    value: "",
    ttl: "",
  });

  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch DNS types
    axios
      .get(baseURL+`/dnsTypes/`)
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching types:", error);
      });

    // Fetch DNS record data if editing an existing record
    if (recordId) {
      axios
        .get(baseURL+`/dnsRecords/${recordId}`)
        .then((response) => {
          setFormData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching record data:", error);
        });
    }
  }, [recordId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ipV4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    const ipV6Regex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
    if (!ipV4Regex.test(formData.value) && !ipV6Regex.test(formData.value)) {
      toast.error(
        "Please enter a valid IP address in the format 255.255.255.255"
      );
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const dataToSend = {
      ...formData,
      user: userId,
    };

    if (recordId) {
      axios
        .put(baseURL+`/dnsRecords/${recordId}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("DNS record updated:", response.data);
          navigate("/dns-table", { state: { message: response.data.message } });
        })
        .catch((error) => {
          console.error("Error updating DNS record:", error);
          toast.error(
            error.response.data.message || "Error updating DNS record"
          );
        });
    } else {
      // Create new DNS record
      axios
        .post(baseURL+`/dnsRecords`, dataToSend, {
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
          toast.error(error.response.data.message || "Error adding DNS record");
        });
    }
  };

  return (
    <div className="editDNSForm">
      <ToastContainer position="top-right" />
      <h2>{recordId ? "Edit DNS Record" : "Add DNS Record"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="dnsType" className="form-label">
            Type
          </label>
          <select
            className="form-select"
            id="dnsType"
            name="dnsType"
            value={formData.dnsType}
            onChange={handleChange}
            required
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
            required
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
            required
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
            required
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
          {recordId ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default DNSRecordEditForm;
