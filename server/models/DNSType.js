import mongoose from 'mongoose';

const dnsTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const DnsType = mongoose.model('DnsType', dnsTypeSchema);

export default DnsType;