import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    createdAt: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data } = await api.get("/auth/profile");
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        createdAt: data.createdAt || "",
      });
    } catch {
      alert("Failed to load profile");
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    try {
      await api.put("/auth/profile", {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
      });
      alert("Profile updated successfully");
    } catch {
      alert("Update failed");
    }
  }

  return (
    <div style={pageContainer}>
      <div style={formCard}>
        <h2 style={{ marginBottom: 20 }}>My Profile</h2>

        <form onSubmit={saveProfile}>
          <label style={label}>Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            style={input}
          />

          <label style={label}>Email</label>
          <input
            type="text"
            value={profile.email}
            disabled
            style={{ ...input, opacity: 0.6 }}
          />

          <label style={label}>Phone Number</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            style={input}
          />

          <label style={label}>Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            style={input}
          />

          <label style={label}>Account Created</label>
          <input
            type="text"
            value={profile.createdAt ? new Date(profile.createdAt).toDateString() : ""}
            disabled
            style={{ ...input, opacity: 0.6 }}
          />

          <button type="submit" style={saveBtn}>
            Save
          </button>

          <button type="button" onClick={() => navigate("/receiver")} style={backBtn}>
            Back
          </button>
        </form>
      </div>
    </div>
  );
}

const pageContainer = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  display: "flex",
  justifyContent: "center",
  paddingTop: 60,
  fontFamily: "sans-serif",
};

const formCard = {
  background: "#0f172a",
  padding: 30,
  borderRadius: 16,
  width: 420,
};

const label = {
  display: "block",
  marginBottom: 6,
  marginTop: 10,
  fontSize: 14,
  color: "#cbd5f5",
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
  boxSizing: "border-box",
};

const saveBtn = {
  width: "100%",
  padding: 10,
  marginTop: 12,
  borderRadius: 10,
  border: "none",
  background: "#f97316",
  color: "white",
  cursor: "pointer",
};

const backBtn = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 10,
  border: "none",
  background: "#1e293b",
  color: "white",
  cursor: "pointer",
};

export default Profile;