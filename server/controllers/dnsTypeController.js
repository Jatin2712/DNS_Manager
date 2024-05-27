import DnsType from '../models/DnsType.js';

// Create a new DNS type
export const createDnsType = async (req, res) => {
  try {
    const { type, description } = req.body;
    const newDnsType = new DnsType({ type, description });
    await newDnsType.save();
    res.status(201).json(newDnsType);
  } catch (error) {
    console.error('Error creating DNS type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all DNS types
export const getAllDnsTypes = async (req, res) => {
  try {
    const dnsTypes = await DnsType.find();
    res.json(dnsTypes);
  } catch (error) {
    console.error('Error fetching DNS types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single DNS type by ID
export const getDnsTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const dnsType = await DnsType.findById(id);
    if (!dnsType) {
      return res.status(404).json({ message: 'DNS type not found' });
    }
    res.status(200).json(dnsType);
  } catch (error) {
    console.error('Error fetching DNS type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a DNS type
export const updateDnsType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description } = req.body;
    const updatedDnsType = await DnsType.findByIdAndUpdate(id, { type, description }, { new: true });
    if (!updatedDnsType) {
      return res.status(404).json({ message: 'DNS type not found' });
    }
    res.status(200).json(updatedDnsType);
  } catch (error) {
    console.error('Error updating DNS type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a DNS type
export const deleteDnsType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDnsType = await DnsType.findByIdAndDelete(id);
    if (!deletedDnsType) {
      return res.status(404).json({ message: 'DNS type not found' });
    }
    res.status(200).json({ message: 'DNS type deleted successfully' });
  } catch (error) {
    console.error('Error deleting DNS type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};