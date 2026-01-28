import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddInternship from './AddInternship'; 
import Navbar from './Navbar';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      // Using user_id 1 for now until we handle dynamic IDs
      const response = await axios.get('http://localhost:5000/applications/1', {
        headers: { token: token }
      });
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const deleteApplication = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await axios.delete(`http://localhost:5000/applications/${id}`);
        setApplications(applications.filter(app => app.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/applications/${id}`, {
        status: newStatus
      });
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* 1. Global Navbar */}
      <Navbar />

      {/* 2. Main Content Container */}
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://i.pinimg.com/736x/96/4d/70/964d70ae48964365176820c3b420741e.jpg')" }}>
          <h1 style={{ margin: 0, color: '#ffffff' }}>My Internships</h1>
        </header>

        {/* Conditionally show the form */}
        {showAddForm && (
          <div style={{ 
            marginBottom: '40px', 
            padding: '25px', 
            backgroundColor: 'white', 
            border: '1px solid #ddd', 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
          }}>
            <AddInternship onAdd={() => {
              fetchApplications(); 
              setShowAddForm(false); 
            }} />
          </div>
        )}

        {/* Search Bar Section */}
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="🔍 Search by company or role..." 
            value={searchTerm} 
            style={{ 
              padding: '14px 20px', 
              width: '100%', 
              fontSize: '16px',
              borderRadius: '10px', 
              border: '1px solid #ddd',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
              boxSizing: 'border-box' 
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ 
              backgroundColor: showAddForm ? '#6c757d' : '#28a745', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '5px', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            {showAddForm ? 'Close Form' : '+ Add Internship'}
          </button>
        </div>

        {/* Filtered List Logic */}
        {(() => {
          const filteredApps = applications.filter(app => 
            app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            app.role.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return filteredApps.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '25px' 
            }}>
              {filteredApps.map(app => (
                <div key={app.id} className="app-card" style={{ 
                  padding: '25px', 
                  backgroundColor: 'white',
                  border: '1px solid #eee', 
                  borderRadius: '15px', 
                  boxShadow: '0 6px 15px rgba(0,0,0,0.04)',
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '220px',
                  transition: 'transform 0.2s'
                }}>
                  <div>
                    <h3 style={{ marginTop: 0, color: '#2c3e50', fontSize: '1.4rem' }}>{app.company_name}</h3>
                    <p style={{ color: '#666', marginBottom: '15px' }}><strong>Role:</strong> {app.role}</p>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '14px', color: '#888' }}><strong>STATUS</strong></label>
                      <select 
                        value={app.status} 
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        style={{ 
                          padding: '8px', 
                          borderRadius: '6px', 
                          width: '100%', 
                          marginTop: '8px',
                          border: '1px solid #ced4da',
                          backgroundColor: '#f8f9fa'
                        }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview Round-1">Interview Round-1</option>
                        <option value="Interview Round-2">Interview Round-2</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => window.location=`/application/${app.id}`}
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => deleteApplication(app.id)}
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        backgroundColor: '#fff', 
                        color: '#dc3545', 
                        border: '1px solid #dc3545', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px', backgroundColor: 'white', borderRadius: '15px' }}>
              <p style={{ fontSize: '18px', color: '#555' }}>No applications found matching <strong>"{searchTerm}"</strong>.</p>
              {searchTerm === "" && <p style={{ color: '#888' }}>Start by clicking the <strong>+ Add Internship</strong> button above!</p>}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Dashboard;