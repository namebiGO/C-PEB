import express from 'express';
import Service from '../models/Service.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/admin/services
// @desc    Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/admin/services
// @desc    Create a service
router.post('/', async (req, res) => {
  try {
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const service = await Service.create(req.body);
    
    if (req.io) req.io.emit('content_updated', { type: 'service_created' });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Slug already exists' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/admin/services/:id
// @desc    Update a service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    if (req.io) req.io.emit('content_updated', { type: 'service_updated' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/admin/services/:id
// @desc    Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    await service.deleteOne();
    if (req.io) req.io.emit('content_updated', { type: 'service_deleted' });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
