import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [contacts, setContacts] = useState([]);

  // Fetch all contacts from Backend
  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  // Handle Form Submission (AJAX - No Page Reload)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contacts', formData);
      alert("Contact Saved Successfully!");
      setFormData({ name: '', email: '', phone: '', message: '' }); // Clear form
      fetchContacts(); // Update table automatically
    } catch (err) {
      alert("Error saving contact");
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      fetchContacts();
    }
  };

  // UI Requirement: Validation (Disable button if fields are invalid)
  const isInvalid = !formData.name || !formData.email.includes('@') || !formData.phone;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Contact Management System</h2>
      
      {/* Contact Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', background: '#f9f9f9', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <input placeholder="Email (must contain @)" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <textarea placeholder="Message (Optional)" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '80px' }} />
        
        <button type="submit" disabled={isInvalid} style={{ padding: '12px', background: isInvalid ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: isInvalid ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
          SUBMIT CONTACT
        </button>
      </form>

      {/* Contacts Table */}
      <h3 style={{ marginTop: '40px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>Stored Contacts</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#333', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{contact.name}</td>
              <td style={{ padding: '12px' }}>{contact.email}</td>
              <td style={{ padding: '12px' }}>{contact.phone}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button onClick={() => deleteContact(contact._id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;