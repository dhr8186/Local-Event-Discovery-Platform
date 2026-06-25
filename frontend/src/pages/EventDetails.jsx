import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, IndianRupee, Users, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './EventDetails.css';

// Fix for default marker icon in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBookTicket = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setBookingLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.post('http://localhost:5000/api/bookings', { eventId: id, ticketCount }, config);
      alert('Booking successful!');
      navigate('/bookings'); // Redirect to bookings page (to be created)
    } catch (error) {
      alert('Booking failed');
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (!event) return <div className="no-events">Event not found</div>;

  return (
    <div className="event-details-container animate-fade-in">
      <div className="event-details-hero">
        <img src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} alt={event.title} />
        <div className="hero-overlay">
          <span className="category-badge">{event.category}</span>
          <h1>{event.title}</h1>
          <p className="organizer">Organized by {event.organizer?.name}</p>
        </div>
      </div>

      <div className="event-content-layout">
        <div className="event-main-info">
          <h2>About this Event</h2>
          <p className="description">{event.description}</p>
        </div>

        <div className="event-sidebar">
          <div className="sidebar-card">
            <h3>Date & Time</h3>
            <div className="info-row">
              <Calendar className="icon" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="info-row">
              <Clock className="icon" />
              <span>{event.time}</span>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Location</h3>
            <div className="info-row">
              <MapPin className="icon" />
              <span>{event.location.address}</span>
            </div>
            {event.location.coordinates && event.location.coordinates.lat !== 0 && (
              <div className="map-wrapper" style={{ height: '200px', width: '100%', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                <MapContainer 
                  center={[event.location.coordinates.lat, event.location.coordinates.lng]} 
                  zoom={13} 
                  scrollWheelZoom={false} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={[event.location.coordinates.lat, event.location.coordinates.lng]}>
                    <Popup>{event.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>

          <div className="sidebar-card ticket-card">
            <h3>Tickets</h3>
            <div className="price-display">
              <IndianRupee className="icon lg" />
              <span className="price-val">{event.price === 0 ? 'Free' : event.price}</span>
            </div>
            
            <div className="ticket-counter">
              <label>Quantity:</label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={ticketCount} 
                onChange={(e) => setTicketCount(parseInt(e.target.value))}
              />
            </div>

            <button 
              className="btn-primary w-100" 
              onClick={handleBookTicket}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Processing...' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
