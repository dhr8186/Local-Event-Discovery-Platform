const Event = require('../models/Event');

// Helper function for Haversine distance
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const getEvents = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    let events = await Event.find({ ...keyword, ...category }).populate('organizer', 'name email');

    // Filter by location radius if coordinates are provided
    if (req.query.lat && req.query.lng && req.query.radius) {
      const userLat = parseFloat(req.query.lat);
      const userLng = parseFloat(req.query.lng);
      const radius = parseFloat(req.query.radius);

      events = events.filter(event => {
        if (!event.location || !event.location.coordinates || !event.location.coordinates.lat) {
          return false; // Skip events without coordinates
        }
        
        const distance = getDistanceFromLatLonInKm(
          userLat, 
          userLng, 
          event.location.coordinates.lat, 
          event.location.coordinates.lng
        );
        
        return distance <= radius;
      });
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, location, price, capacity, imageUrl } = req.body;

    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      price,
      capacity,
      imageUrl,
      organizer: req.user.id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized to update this event' });
      }

      event.title = req.body.title || event.title;
      event.description = req.body.description || event.description;
      event.category = req.body.category || event.category;
      event.date = req.body.date || event.date;
      event.time = req.body.time || event.time;
      event.location = req.body.location || event.location;
      event.price = req.body.price || event.price;
      event.capacity = req.body.capacity || event.capacity;
      event.imageUrl = req.body.imageUrl || event.imageUrl;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized to delete this event' });
      }

      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
