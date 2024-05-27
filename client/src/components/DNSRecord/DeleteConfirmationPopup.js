import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const DeleteConfirmationPopup = ({ record, onCancel, onConfirm }) => {
  return (
    <Modal show={true} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the following record?</p>
        <p>
          <strong>Type:</strong> {record.dnsType}
        </p>
        <p>
          <strong>Name:</strong> {record.name}
        </p>
        <p>
          <strong>Value:</strong> {record.value}
        </p>
        <p>
          <strong>TTL:</strong> {record.ttl}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationPopup;
