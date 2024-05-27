import express from 'express';
import { createDnsType, getAllDnsTypes, getDnsTypeById, updateDnsType, deleteDnsType } from '../controllers/dnsTypeController.js';

const router = express.Router();

router.post('/', createDnsType);
router.get('/', getAllDnsTypes);
router.get('/:id', getDnsTypeById);
router.put('/:id', updateDnsType);
router.delete('/:id', deleteDnsType);

export default router;