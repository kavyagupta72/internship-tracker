import React, { useState, useEffect } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({ username: "Loading...", email: "" });
  const [passwordForm, setPasswordForm] = useState({ 
    currentPassword: "", 
    newPassword: "",
    confirmNewPassword: "" // Added field tracking
  });
  const [showForm, setShowForm] = useState(false); // Controls form visibility
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setProfile({ username: "Guest", email: "Not Logged In" });
      return;
    }

    fetch("http://localhost:5000/users/profile", {
      headers: { token: token }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        if (data && data.username) {
          setProfile(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setProfile({ username: "Error", email: "Could not retrieve profile" });
      });
  }, [token]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!token) return setMessage("You must be logged in.");

    // Frontend validation: Check if new passwords match
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setIsError(true);
      setMessage("New passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsError(false);
        setMessage(data.message || "Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        setTimeout(() => {
          setShowForm(false);
          setMessage("");
        }, 2000); // Automatically collapse form after 2 seconds on success
      } else {
        setIsError(true);
        setMessage(data.error || "Failed to update password");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Server connection error");
    }
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <h3 style={{ margin: "0 0 10px 0" }}>My Profile</h3>
      <p style={{ margin: "5px 0" }}><strong>Username:</strong> {profile.username}</p>
      <p style={{ margin: "5px 0" }}><strong>Email:</strong> {profile.email}</p>

      <div style={{ marginTop: "15px" }}>
        {/* Toggle Button for the form */}
        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)}
            style={{
              width: "100%",
              padding: "8px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordChange}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0 }}>Change Password</h4>
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setMessage(""); }}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px' }}
              >
                Cancel
              </button>
            </div>
            
            {message && (
              <p style={{ 
                color: isError ? "red" : "green", 
                fontSize: "14px", 
                margin: "5px 0",
                fontWeight: "500"
              }}>
                {message}
              </p>
            )}

            <input
              type="password"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordForm.confirmNewPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
              required
            />
            <button 
              type="submit" 
              style={{ 
                width: "100%", 
                marginTop: "10px", 
                padding: "8px", 
                background: "#28a745", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}