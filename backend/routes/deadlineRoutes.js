const express = require('express');
const router = express.Router();
const deadlineController = require('../controllers/deadlineController');

router.get('/', deadlineController.getAllDeadlines);
router.post('/', deadlineController.createDeadline);
router.put('/:id', deadlineController.updateDeadline);
router.delete('/:id', deadlineController.deleteDeadline);

module.exports = router;
