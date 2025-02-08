"use client"
import "./sponsor.css";
import { useState } from "react";

export default function SponsorPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        socials: '',
        why: '',
        video: '',
        other: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.other.trim() || formData.other.split(' ').length < 200) {
            newErrors.other = 'Please write at least 200 words';
        }
        return newErrors;
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            fetch('/api/sponsor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            console.log('Form submitted:', formData);
            // Reset form after successful submission
            setFormData({
                name: '', email: '', socials: '', why: '', video: '', other: ''
            });
            setErrors({});
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            <div className="sponsorBox">
                <h1>Interested in becoming a sponsored athlete?</h1>
                <h2>Submit the form and we'll review it within 3 business days.</h2>
                
                <form onSubmit={submitForm}>
                    {[
                        { id: 'name', label: 'Name', type: 'text' },
                        { id: 'email', label: 'Email', type: 'email' },
                        { id: 'socials', label: 'Socials', type: 'text' },
                        { id: 'why', label: 'What makes you a good fit for Snappit?', type: 'text' },
                        { id: 'video', label: 'Are you able to make videos about Snappit?', type: 'text' },
                        { id: 'other', label: "Snappit's program is highly selective, why should we choose you over other athletes? (min 200 words)", type: 'textarea' }
                    ].map(field => (
                        <div key={field.id} className="formRow">
                            <label htmlFor={field.id}>{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.id}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    className={errors[field.id] ? 'error' : ''}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.id}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    className={errors[field.id] ? 'error' : ''}
                                />
                            )}
                            {errors[field.id] && <span className="errorMessage">{errors[field.id]}</span>}
                        </div>
                    ))}
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </main>
    );
}