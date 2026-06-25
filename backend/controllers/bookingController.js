const Booking = require('../models/Booking');
const Event = require('../models/Event');

const createBooking = async (req, res) => {
  try {
    const { eventId, ticketCount } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const totalAmount = event.price * ticketCount;

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      ticketCount,
      totalAmount,
      paymentStatus: 'Pending' // Simple mock, no actual payment gateway integration yet
    });

    const createdBooking = await booking.save();
    
    // Add user to attendees
    if (!event.attendees.includes(req.user.id)) {
      event.attendees.push(req.user.id);
      await event.save();
    }

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings };
