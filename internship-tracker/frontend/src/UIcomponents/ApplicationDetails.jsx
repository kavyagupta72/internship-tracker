import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/applications/detail/${id}`);
      const data = response.data;
      const safeData = {
        ...data,
        company_name: data.company_name || "",
        role: data.role || "",
        location: data.location || "",
        stipend: data.stipend || "",
        notes: data.notes || ""
      };
      setDetails(data);
      setEditData(safeData); // Initialize form with current data
    } catch (err) {
      console.error("Could not fetch details");
    }
  };

  useEffect(() => { fetchDetails(); }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/applications/${id}`, editData);
      setDetails(editData);
      setIsEditing(false); // Switch back to view mode
      alert("Changes saved!");
    } catch (err) {
      console.error("Update failed");
    }
  };

  if (!details) return <p>Loading...</p>;

  return (
    <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>← Back</button>

      <div style={{ padding: '30px', border: '1px solid #ddd', borderRadius: '15px', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>{isEditing ? "Edit Application" : details.company_name}</h2>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            style={{ backgroundColor: isEditing ? '#28a745' : '#ffc107', color: 'black', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isEditing ? "Save Changes" : "Update Details"}
          </button>
        </div>
        <hr />

        <div style={{ lineHeight: '2' }}>
          {/* Company Name (Editable only in edit mode) */}
          {isEditing && (
             <p><strong>Company:</strong> <input type="text" value={editData.company_name} onChange={e => setEditData({...editData, company_name: e.target.value})} /></p>
          )}

          <p><strong>Role:</strong> 
            {isEditing ? 
              <input type="text" value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})} /> : 
              details.role}
          </p>
          
          <p><strong>Status:</strong> 
            <select 
              value={isEditing ? editData.status : details.status} 
              disabled={!isEditing}
              onChange={(e) => setEditData({...editData, status: e.target.value})}
              style={{ padding: '5px', marginLeft: '10px' }}
            >
              <option value="Applied">Applied</option>
              <option value="Interview Round-1">Interview Round-1</option>
              <option value="Interview Round-2">Interview Round-2</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </p>

          <p><strong>Location:</strong> 
            {isEditing ? 
              <input type="text" value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} /> : 
              details.location || 'N/A'}
          </p>

          <p><strong>Stipend:</strong> 
            {isEditing ? 
              <input type="text" value={editData.stipend} onChange={e => setEditData({...editData, stipend: e.target.value})} /> : 
              details.stipend || 'N/A'}
          </p>

          <div style={{ marginTop: '20px' }}>
            <strong>Additional Notes:</strong>
            {isEditing ? (
              <textarea 
                style={{ width: '100%', height: '100px', marginTop: '10px', padding: '10px' }}
                value={editData.notes}
                onChange={e => setEditData({...editData, notes: e.target.value})}
              />
            ) : (
              <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '10px', borderLeft: '4px solid #007bff' }}>
                {details.notes || 'No notes added yet.'}
              </div>
            )}
          </div>
        </div>

        {!isEditing && (
          <button 
            onClick={async () => {
              if(window.confirm("Delete this?")) {
                await axios.delete(`http://localhost:5000/applications/${id}`);
                navigate('/dashboard');
              }
            }}
            style={{ marginTop: '30px', width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Delete Application
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;