require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
dotenv.config();
const uri = process.env.MONGOURL;
const dbName = 'dnsManager';

const dnstypes = [
  { type: 'A', description: 'Address Record' },
  { type: 'AAAA', description: 'IPv6 Address Record' },
  { type: 'CNAME', description: 'Canonical Name Record' },
  { type: 'MX', description: 'Mail Exchange Record' },
  { type: 'NS', description: 'Name Server Record' },
  { type: 'PTR', description: 'Pointer Record' },
  { type: 'SOA', description: 'Start of Authority Record' },
  { type: 'SRV', description: 'Service Record' },
  { type: 'TXT', description: 'Text Record' },
  { type: 'DNSSEC', description: 'DNSSEC' }
];

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB successfully');
  const db = client.db(dbName);
  const dnsTypesCollection = db.collection('dnsTypes');
  dnsTypesCollection.insertMany(dnsTypesData, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return;
    }
    console.log('Data inserted successfully:', result.insertedCount);
    client.close();
    console.log('Connection closed');
  });
});