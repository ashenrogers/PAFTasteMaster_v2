import React from 'react';
import ContactCard from './ContactCard';

const Contacts = ({ contacts }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Contact Messages</h2>
      {contacts.length > 0 ? (
        contacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))
      ) : (
        <p style={{ color: '#777' }}>No contact messages yet.</p>
      )}
    </div>
  );
};

export default Contacts;
