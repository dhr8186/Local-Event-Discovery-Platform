import { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { Search, Filter, MapPin } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/events?';
      if (keyword) url += `keyword=${keyword}&`;
      if (category) url += `category=${category}&`;
      if (userLocation) {
        url += `lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radius}`;
      }
      
      const { data } = await axios.get(url);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, userLocation, radius]); // Re-fetch when these change

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        alert('Unable to retrieve your location');
      }
    );
  };

  return (
    <div className="home-container animate-fade-in">
      <section className="hero-section">
        <h1>Discover Amazing Local Events</h1>
        <p>Find and book events happening right in your community.</p>
        
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-input">
            <Search size={20} className="icon" />
            <input 
              type="text" 
              placeholder="Search for events..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </section>

      <section className="filters-section">
        <div className="location-filter">
          <button 
            type="button" 
            className={`btn-outline ${userLocation ? 'active' : ''}`}
            onClick={requestLocation}
            title={userLocation ? "Using your location" : "Click to use your location"}
          >
            <MapPin size={18} />
            {userLocation ? 'Location Active' : 'Use My Location'}
          </button>
          
          {userLocation && (
            <select className="radius-select" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))}>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>
          )}
        </div>

        <div className="filter-wrapper">
          <Filter size={20} className="icon" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Music">Music</option>
            <option value="Tech">Tech</option>
            <option value="Art">Art</option>
            <option value="Sports">Sports</option>
            <option value="Food">Food</option>
            <option value="Education">Education</option>
          </select>
        </div>
      </section>

      <section className="events-section">
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="no-events">No events found matching your criteria.</div>
        ) : (
          <div className="events-grid">
            {events.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
