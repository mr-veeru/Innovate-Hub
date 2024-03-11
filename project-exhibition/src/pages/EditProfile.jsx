import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';

const EditProfile = ({ user, onClose }) => {
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [photoURL, setPhotoURL] = useState(user.photoURL || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: photoURL
            });
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Display Name:
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </label>
                <label>
                    Photo URL:
                    <input type="text" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
                </label>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
