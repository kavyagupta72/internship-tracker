import React, { useEffect, useState } from 'react';
import { apiClient } from '../api';
import AddInternship from './AddInternship'; 
import Navbar from './Navbar';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get('/applications', {
        headers: { token }
      });
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const deleteApplication = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await apiClient.delete(`/applications/${id}`);
        setApplications(applications.filter(app => app.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/applications/${id}`, {
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

  // Filter logic calculated neatly during rendering phase
  const filteredApps = applications.filter(app => 
    app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#e0e0e0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 1. Global Navbar */}
      <Navbar />

      {/* 2. Main Content Container */}
      <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #2d2d2d', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#ffffff', fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.5px' }}>My Internships</h1>
            <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '0.95rem' }}>Track, manage, and optimize your application pipelines.</p>
          </div>
        </header>

        {/* Action Controls (Search + Add Button Side-by-Side) */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}></span>
            <input 
              type="text" 
              placeholder="Search by company or role..." 
              value={searchTerm} 
              style={{ 
                padding: '14px 16px 14px 44px', 
                width: '100%', 
                fontSize: '15px',
                borderRadius: '10px', 
                border: '1px solid #2d2d2d',
                backgroundColor: '#1e1e1e',
                color: '#ffffff',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ 
              backgroundColor: showAddForm ? '#3a3a3a' : '#238636', 
              color: 'white', 
              padding: '14px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'background-color 0.2s, transform 0.1s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = showAddForm ? '#4e4e4e' : '#2ea043'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = showAddForm ? '#3a3a3a' : '#238636'}
          >
            {showAddForm ? 'Close Form' : '＋ Add Internship'}
          </button>
        </div>

        {/* Conditionally show the form */}
        {showAddForm && (
          <div style={{ 
            marginBottom: '32px', 
            padding: '28px', 
            backgroundColor: '#1e1e1e', 
            border: '1px solid #2d2d2d', 
            borderRadius: '14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)' 
          }}>
            <AddInternship onAdd={() => {
              fetchApplications(); 
              setShowAddForm(false); 
            }} />
          </div>
        )}

        {/* Main List Rendering */}
        {filteredApps.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {filteredApps.map(app => (
              <div key={app.id} className="app-card" style={{ 
                padding: '24px', 
                backgroundColor: '#1e1e1e',
                border: '1px solid #2d2d2d', 
                borderRadius: '14px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '240px',
                transition: 'transform 0.2s, border-color 0.2s'
              }}>
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: '6px', color: '#ffffff', fontSize: '1.35rem', fontWeight: '600' }}>
                    {app.company_name}
                  </h3>
                  <p style={{ color: '#aaa', margin: '0 0 20px 0', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666', fontWeight: '500' }}>Role:</span> {app.role}
                  </p>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '11px', color: '#888', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Status
                    </label>
                    <select 
                      value={app.status} 
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      style={{ 
                        padding: '10px 12px', 
                        borderRadius: '8px', 
                        width: '100%', 
                        marginTop: '6px',
                        border: '1px solid #3a3a3a',
                        backgroundColor: '#252525',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
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
                      padding: '11px', 
                      backgroundColor: '#21262d', 
                      color: '#c9d1d9', 
                      border: '1px solid #30363d', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#30363d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#21262d'}
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => deleteApplication(app.id)}
                    style={{ 
                      flex: 1, 
                      padding: '11px', 
                      backgroundColor: 'transparent', 
                      color: '#f85149', 
                      border: '1px solid rgba(248, 81, 73, 0.4)', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'background-color 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(248, 81, 73, 0.1)';
                      e.currentTarget.style.borderColor = '#f85149';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(248, 81, 73, 0.4)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '40px', padding: '60px 40px', backgroundColor: '#1e1e1e', border: '1px solid #2d2d2d', borderRadius: '14px' }}>
            <p style={{ fontSize: '16px', color: '#aaa', margin: 0 }}>
              No applications found matching <strong style={{ color: '#fff' }}>"{searchTerm}"</strong>.
            </p>
            {searchTerm === "" && (
              <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>
                Start by clicking the <strong style={{ color: '#2ea043' }}>＋ Add Internship</strong> button above!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;