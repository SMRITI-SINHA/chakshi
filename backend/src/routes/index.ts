import { Router } from 'express';
import { chatController } from '../controllers/chatController';

const router = Router();

// Health check
router.get('/health', (req, res) => chatController.healthCheck(req, res));

// Chat endpoint
router.post('/chat', (req, res) => chatController.handleMessage(req, res));

// Direct search endpoint
router.post('/search', (req, res) => chatController.searchCases(req, res));

// Static data endpoints
router.get('/states', (req, res) => chatController.getStates(req, res));
router.post('/districts', (req, res) => chatController.getDistricts(req, res));

export default router;
