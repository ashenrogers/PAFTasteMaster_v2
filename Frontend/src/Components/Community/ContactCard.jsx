import React, { useState } from 'react';
import ContactService from '../service/contact.jsx';
import Contact from '../model/contact.jsx';

const ContactCard = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null); // Reset status

    const contactData = new Contact(name, email, phone, message);

    try {
      const response = await ContactService.submitContactForm(contactData);
      console.log('Contact form submitted successfully:', response);
      setSubmissionStatus('success');
      // Clear the form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex', // Added for layout
      flexDirection: 'column', // Added for layout
      alignItems: 'center', // Centers content horizontally
      gap: '20px' //Added gap
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <img
          alt="contact person"
          src="image/contact_1.jpg" //  You'll need to provide the correct path
          style={{
            width: '150px',  // Adjust as needed
            height: '150px', // Adjust as needed
            borderRadius: '50%', // Makes it a circle
            objectFit: 'cover', // Ensures image fills the circle
            marginBottom: '10px'
          }}
        />
        <p style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        }}>Senu De Silva</p>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%' // Ensure form takes full width of container
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="name" style={{ fontWeight: 'bold', marginBottom: '4px' }}>Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="email" style={{ fontWeight: 'bold', marginBottom: '4px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="phone" style={{ fontWeight: 'bold', marginBottom: '4px' }}>Phone:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="message" style={{ fontWeight: 'bold', marginBottom: '4px' }}>Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows="4"
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
            ...(isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}), // Conditional styling
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Send Message'}
        </button>

        {submissionStatus === 'success' && (
          <div style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>
            Message sent successfully!
          </div>
        )}
        {submissionStatus === 'error' && (
          <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
            Failed to send message. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactCard;
