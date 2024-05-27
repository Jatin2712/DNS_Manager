import express from 'express';
import { body } from 'express-validator';
import { getAllDNSRecords, getDNSRecordById, createDNSRecord, updateDNSRecord, deleteDNSRecord} from '../controllers/dnsRecordController.js';

const router = express.Router();

router.get('/', getAllDNSRecords);
router.get('/:id', getDNSRecordById);
router.post('/',
  [
    body('user').notEmpty().withMessage('User ID is required'),
    body('dnsType').notEmpty().withMessage('DNS type is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('value').notEmpty().withMessage('Value is required'),
    body('ttl').notEmpty().withMessage('TTL is required'),
  ],
  createDNSRecord
);
router.put('/:id', 
  [
    body('user').notEmpty().withMessage('User ID is required'),
    body('dnsType').notEmpty().withMessage('DNS type is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('value').notEmpty().withMessage('Value is required'),
    body('ttl').notEmpty().withMessage('TTL is required'),
  ],
  updateDNSRecord
);
router.delete('/:id', deleteDNSRecord); // Changed route to '/:id'

export default router;