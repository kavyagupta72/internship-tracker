import React, { useState } from 'react';
import { apiClient } from '../api';

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

      await apiClient.post(
        '/applications',
        formData,
        {
          headers: {
            token
          }
        }
      );

      alert("Added successfully!");

      setFormData({
        company_name: '',
        role: '',
        status: 'Applied',
        stipend: '',
        location: ''
      });

      onAdd();
    } catch (err) {
      console.error("Failed to add application:", err);
      alert("Failed to add application");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h3>Add New Internship</h3>

      <input
        type="text"
        placeholder="Company"
        required
        value={formData.company_name}
        onChange={e =>
          setFormData({
            ...formData,
            company_name: e.target.value
          })
        }
      />

      <input
        type="text"
        placeholder="Role"
        required
        value={formData.role}
        onChange={e =>
          setFormData({
            ...formData,
            role: e.target.value
          })
        }
      />

      <input
        type="text"
        placeholder="Stipend (optional)"
        value={formData.stipend}
        onChange={e =>
          setFormData({
            ...formData,
            stipend: e.target.value
          })
        }
      />

      <input
        type="text"
        placeholder="Location (optional)"
        value={formData.location}
        onChange={e =>
          setFormData({
            ...formData,
            location: e.target.value
          })
        }
      />

      <select
        value={formData.status}
        onChange={e =>
          setFormData({
            ...formData,
            status: e.target.value
          })
        }
        required
      >
        <option value="Applied">Applied</option>
        <option value="Interview Round-1">Interview Round-1</option>
        <option value="Interview Round-2">Interview Round-2</option>
        <option value="Selected">Selected</option>
        <option value="Rejected">Rejected</option>
      </select>

      <button type="submit">Add to List</button>
    </form>
  );
};

export default AddInternship;