import DNSRecord from '../models/DNSRecord.js';
import { validationResult } from 'express-validator';

export const getAllDNSRecords = async (req, res) => {
  const userId = req.query.userId;
  try {
    const dnsRecords = await DNSRecord.find({ user: userId });
    res.json(dnsRecords);
  } catch (error) {
    console.error('Error getting DNS records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single DNS record by ID
export const getDNSRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const dnsRecord = await DNSRecord.findById(id);
    if (!dnsRecord) {
      return res.status(404).json({ message: 'DNS record not found' });
    }
    res.json(dnsRecord);
  } catch (error) {
    console.error('Error getting DNS record by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new DNS record
export const createDNSRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user, dnsType, name, value, ttl } = req.body;
    const userId = req.body.user || req.user.id;
    const dnsTypeId = req.body.dnsType;

    const existingRecord = await DNSRecord.findOne({
      user: userId,
      dnsType: dnsTypeId,
      name,
      value
    });

    if (existingRecord) {
      return res.status(400).json({ message: 'DNS Record already exists' });
    }
    
    const dnsRecord = new DNSRecord({
      user: userId,
      dnsType: dnsTypeId,
      name,
      value,
      ttl,
    });
    await dnsRecord.save();
    res.status(201).json({ message: 'DNS Record Created Successfully', dnsRecord });
  } catch (error) {
    console.error('Error creating DNS record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an existing DNS record
export const updateDNSRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { dnsType, name, value, ttl } = req.body;
    
    const dnsRecord = await DNSRecord.findByIdAndUpdate(id, { dnsType, name, value, ttl }, { new: true });
    if (!dnsRecord) {
      return res.status(404).json({ message: 'DNS record not found' });
    }
    res.json({ message: 'DNS Record Updated Successfully', dnsRecord });
  } catch (error) {
    console.error('Error updating DNS record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an existing DNS record
export const deleteDNSRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const dnsRecord = await DNSRecord.findByIdAndDelete(id);
    if (!dnsRecord) {
      return res.status(404).json({ message: 'DNS record not found' });
    }
    res.json({ message: 'DNS Record Deleted Successfully' });
  } catch (error) {
    console.error('Error deleting DNS record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};