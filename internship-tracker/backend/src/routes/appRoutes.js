const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth');
const appController = require('../controllers/appController');

router.get('/', authorize, appController.getAllApplications);
router.post('/', authorize, appController.createApplication);
router.get('/detail/:id', appController.getApplicationDetail);
router.put('/:id', appController.updateApplication);
router.delete('/:id', appController.deleteApplication);

module.exports = router;