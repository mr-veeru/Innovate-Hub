import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import defaultProfileImage from './default.jpg'; // Import the default profile image
import './MyPost.css'; 

const MyPost = () => {
    const [user] = useAuthState(auth);
    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    const postRef = collection(db, 'posts');

    useEffect(() => {
        const fetchUserPosts = async () => {
            const q = query(postRef, where("userId", "==", user?.uid));
            const querySnapshot = await getDocs(q);
            const posts: any[] = [];
            querySnapshot.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() });
            });
            setUserPosts(posts);
        };

        if (user) {
            fetchUserPosts();
        }
    }, [user, postRef]);

    const handleDeletePost = async (postId: string) => {
        try {
            await deleteDoc(doc(db, 'posts', postId));
            setUserPosts(userPosts.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post: ", error);
        }
    };

    const handleEditPost = async (postId: string) => {
        const postToEdit = userPosts.find(post => post.id === postId);
        setEditingPost(postToEdit);
        setEditedTitle(postToEdit.title);
        setEditedDescription(postToEdit.description);
    };

    const cancelEdit = () => {
        setEditingPost(null);
        setEditedTitle('');
        setEditedDescription('');
    };

    const saveEditedPost = async () => {
        try {
            await updateDoc(doc(db, 'posts', editingPost.id), {
                title: editedTitle,
                description: editedDescription
            });
            setUserPosts(userPosts.map(post => {
                if (post.id === editingPost.id) {
                    return {
                        ...post,
                        title: editedTitle,
                        description: editedDescription
                    };
                }
                return post;
            }));
            cancelEdit();
        } catch (error) {
            console.error("Error updating post: ", error);
        }
    };

    return (
        <div className="mypost-container">
            {user && (
                <div className="user-info">
                    <img src={user.photoURL || defaultProfileImage} alt="User Profile" />
                    <div>
                        <h2>{user.displayName}</h2>
                        <p>Total Posts: {userPosts.length}</p>
                    </div>
                </div>
            )}
            <div className="post-container">
                {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <div key={post.id} className="post-card">
                            {editingPost && editingPost.id === post.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                    />
                                    <textarea className='description'
                                        rows={3}
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                    ></textarea>
                                    <div className="post-buttons">
                                        <button className="save-button" onClick={saveEditedPost}>Save</button>
                                        <button className="cancel-button" onClick={cancelEdit}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3>{post.title}</h3>
                                    <p>{post.description}</p>
                                    <div className="post-buttons">
                                        <button className="delete-button" onClick={() => handleDeletePost(post.id)}>Delete</button>
                                        <button className="edit-button" onClick={() => handleEditPost(post.id)}>Edit</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-post-message">No post found</p>
                )}
            </div>
        </div>
    );
};

export default MyPost;
