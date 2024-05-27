import mongoose from 'mongoose';

const dnsRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dnsType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DnsType',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  ttl: {
    type: String,
    required: true,
  }
}, { collection: 'dnsrecords' });

const DNSRecord = mongoose.model('DNSRecord', dnsRecordSchema);

export default DNSRecord;