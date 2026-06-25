const express = require('express');
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, adminOrOrganizer } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, adminOrOrganizer, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, adminOrOrganizer, updateEvent)
  .delete(protect, adminOrOrganizer, deleteEvent);

module.exports = router;
