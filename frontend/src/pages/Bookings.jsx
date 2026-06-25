import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Ticket, IndianRupee } from 'lucide-react';
import './Bookings.css';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/bookings', config);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchBookings();
  }, [user]);

  if (loading) return <div className="loading">Loading your bookings...</div>;

  return (
    <div className="bookings-container animate-fade-in">
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="no-events">You haven't booked any events yet.</div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-event-img">
                <img src={booking.event?.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} alt="event" />
              </div>
              <div className="booking-info">
                <h3>{booking.event?.title}</h3>
                <div className="info-row">
                  <Calendar size={16} />
                  <span>{new Date(booking.event?.date).toLocaleDateString()}</span>
                </div>
                <div className="booking-meta">
                  <span className="badge"><Ticket size={14}/> {booking.ticketCount} Tickets</span>
                  <span className="badge price"><IndianRupee size={14}/> {booking.totalAmount} Total</span>
                  <span className={`badge status ${booking.paymentStatus.toLowerCase()}`}>{booking.paymentStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
