import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music',
    date: '',
    time: '',
    locationAddress: '',
    price: 0,
    capacity: 100,
    imageUrl: ''
  });

  if (!user || user.role !== 'Organizer') {
    return <div className="loading">Access Denied. Only Organizers can view this page.</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      let lat = 0;
      let lng = 0;
      
      // Basic geocoding with OpenStreetMap Nominatim
      try {
        const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.locationAddress)}`);
        if (geoRes.data && geoRes.data.length > 0) {
          lat = parseFloat(geoRes.data[0].lat);
          lng = parseFloat(geoRes.data[0].lon);
        }
      } catch (geoErr) {
        console.warn('Geocoding failed', geoErr);
      }

      const payload = {
        ...formData,
        location: { 
          address: formData.locationAddress,
          coordinates: { lat, lng }
        }
      };

      await axios.post('http://localhost:5000/api/events', payload, config);
      alert('Event created successfully!');
      navigate('/');
    } catch (error) {
      alert('Error creating event');
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <h2>Organizer Dashboard</h2>
      
      <div className="dashboard-card">
        <h3>Create New Event</h3>
        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-group">
            <label>Event Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Music">Music</option>
                <option value="Tech">Tech</option>
                <option value="Art">Art</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Location Address</label>
            <input type="text" name="locationAddress" value={formData.locationAddress} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (0 for free)</label>
              <input type="number" name="price" min="0" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input type="number" name="capacity" min="1" value={formData.capacity} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>

          <button type="submit" className="btn-primary w-100">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
