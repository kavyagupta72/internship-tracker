import React, { useState } from 'react';
import axios from 'axios';

const AddInternship = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    status: 'Applied',
    stipend: '',
    location: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Note: We are using user_id 1 for now. 
      // Later we will decode the token to get the real ID!
      const res = await axios.post('http://localhost:5000/applications', 
        { ...formData, user_id: 1 }, 
        { headers: { token: token } }
      );
      
      alert("Added successfully!");
      onAdd(); // This refreshes the list on the dashboard
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h3>Add New Internship</h3>
      <input type="text" placeholder="Company" required 
        onChange={e => setFormData({...formData, company_name: e.target.value})} />
      <input type="text" placeholder="Role" required 
        onChange={e => setFormData({...formData, role: e.target.value})} />
      <input type="text" placeholder="Stipend (optional)" 
        onChange={e => setFormData({...formData, stipend: e.target.value})} />
      <select 
        value={formData.status} 
        onChange={e => setFormData({...formData, status: e.target.value})}
        required
        >
        <option value="Applied">Applied</option>
        <option value="Interview Round-1">Interview Round-1</option>
        <option value="Interview Round-2">Interview Round-2</option>
        <option value="Selected">Selected</option>
        </select>
      <button type="submit">Add to List</button>
    </form>
  );
};

export default AddInternship;