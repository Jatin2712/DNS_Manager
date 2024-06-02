/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSortUp,
  faSortDown,
  faDownload,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { ToastContainer, toast } from "react-toastify";

const baseURL = 'http://localhost:8000/api';

const DNSRecordTable = () => {
  const [dnsRecords, setDnsRecords] = useState([]);
  const [dnsTypeNames, setDnsTypeNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (location.state?.message) {
        toast.success(location.state.message);
      }

      try {
        const response = await axios.get(
          baseURL+`/dnsRecords`,
          {
            params: { userId: userId },
          }
        );
        const records = response.data;
        setDnsRecords(records);

        const typeNames = {};
        await Promise.all(
          records.map(async (record) => {
            if (record.dnsType) {
              const dnsTypeResponse = await axios.get(
                baseURL+`/dnsTypes/${record.dnsType}`
              );
              typeNames[record._id] = dnsTypeResponse.data.type;
            }
          })
        );
        setDnsTypeNames(typeNames);
      } catch (error) {
        console.error("Error fetching DNS records:", error);
      }
    };
    fetchData();
  }, [userId, location.state?.message]);

  const deleteRecord = async (id) => {
    try {
      const response = await axios.delete(
        baseURL+`/dnsRecords/${id}`
      );
      const updatedRecords = dnsRecords.filter((record) => record._id !== id);
      setDnsRecords(updatedRecords);
      toast.success(response.data.message);
      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentRecords = updatedRecords.slice(
        indexOfFirstRecord,
        indexOfLastRecord
      );

      if (currentRecords.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleRecordsPerPageChange = (event) => {
    setRecordsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const filteredRecords = dnsRecords.filter(
    (record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dnsTypeNames[record._id] &&
        dnsTypeNames[record._id]
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      record.ttl.toString().includes(searchQuery)
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handleEditNavigation = (id) => {
    navigate(`/dns-record-form/${id}`);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteRecordId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setDeleteRecordId(null);
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteRecordId) {
      deleteRecord(deleteRecordId);
      setDeleteRecordId(null);
      setShowDeleteModal(false);
    }
  };

  const handleSort = (column) => {
    setSortColumn(column);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const sortedRecords = dnsRecords.sort((a, b) => {
    if (sortColumn) {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const handleDownloadExcel = async () => {
    try {
      const workbook = XLSX.utils.book_new();
      const excelData = [];

      const userName = localStorage.getItem("username");

      const headers = ["DnsType", "Name", "Value", "TTL"];
      excelData.push(["UserName:", userName]);
      excelData.push(headers);

      dnsRecords.forEach((record) => {
        const rowData = [];
        const dnsTypeName = dnsTypeNames[record._id] || "";
        rowData.push(dnsTypeName);
        rowData.push(record.name);
        rowData.push(record.value);
        rowData.push(record.ttl);
        excelData.push(rowData);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerCell = XLSX.utils.encode_cell({ r: 3, c: C });
        if (!worksheet[headerCell]) continue;
        worksheet[headerCell].s = {
          patternType: "solid",
          fgColor: { rgb: "FFFF00" },
        };
      }

      const userNameCell = XLSX.utils.encode_cell({ r: 1, c: 0 });
      worksheet["!merges"] = [{ s: userNameCell, e: userNameCell }];

      XLSX.utils.book_append_sheet(workbook, worksheet, "DNS Records");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const excelBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(excelBlob, "DNS_Records_" + userName + ".xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  return (
    <div className="dnsTable">
      <ToastContainer position="top-right" />
      <h2>DNS Records</h2>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control me-2"
          style={{ width: "300px" }}
        />
        <button className="btn btn-primary" onClick={handleDownloadExcel}>
          <FontAwesomeIcon icon={faDownload} />
          <span className="ms-2">Download Excel</span>
        </button>
      </div>
      {filteredRecords.length === 0 ? (
        <p>No result found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort("dnsType")}>
                Type{" "}
                {sortColumn === "dnsType" && (
                  <FontAwesomeIcon
                    icon={sortDirection === "asc" ? faSortUp : faSortDown}
                  />
                )}
              </th>
              <th onClick={() => handleSort("name")}>
                Name{" "}
                {sortColumn === "name" && (
                  <FontAwesomeIcon
                    icon={sortDirection === "asc" ? faSortUp : faSortDown}
                  />
                )}
              </th>
              <th onClick={() => handleSort("value")}>
                Value{" "}
                {sortColumn === "value" && (
                  <FontAwesomeIcon
                    icon={sortDirection === "asc" ? faSortUp : faSortDown}
                  />
                )}
              </th>
              <th onClick={() => handleSort("ttl")}>
                TTL{" "}
                {sortColumn === "ttl" && (
                  <FontAwesomeIcon
                    icon={sortDirection === "asc" ? faSortUp : faSortDown}
                  />
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record) => (
              <tr key={record._id}>
                <td>{dnsTypeNames[record._id]}</td>
                <td>{record.name}</td>
                <td>{record.value}</td>
                <td>{record.ttl}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEditNavigation(record._id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteConfirmation(record._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          Showing {indexOfFirstRecord + 1} to{" "}
          {Math.min(indexOfLastRecord, filteredRecords.length)} of{" "}
          {filteredRecords.length} records
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="me-2">
            <label>Records per page:</label>
          </div>
          <div>
            <select
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
              className="form-select"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteConfirmationPopup
          record={dnsRecords.find((record) => record._id === deleteRecordId)} // Pass the record details to the modal
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default DNSRecordTable;
