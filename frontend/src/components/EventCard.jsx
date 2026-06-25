import { Link } from 'react-router-dom';
import { Calendar, MapPin, IndianRupee } from 'lucide-react';
import './EventCard.css';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <div className="event-image">
        <img src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={event.title} />
        <span className="event-category">{event.category}</span>
      </div>
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
          </div>
          <div className="detail-item">
            <MapPin size={16} />
            <span>{event.location.address}</span>
          </div>
          <div className="detail-item price">
            <IndianRupee size={16} />
            <span>{event.price === 0 ? 'Free' : event.price}</span>
          </div>
        </div>
        <Link to={`/events/${event._id}`} className="btn-primary w-100 text-center" style={{display: 'block', marginTop: '1rem'}}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
