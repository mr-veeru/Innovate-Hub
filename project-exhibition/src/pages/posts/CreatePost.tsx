import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import './CreatePost.css';

interface CreateFormData {
    title: string;
    description: string;
}

const CreatePost = () => {
    const [user] = useAuthState(auth);
    const  navigate = useNavigate();

    const schema = yup.object().shape({
        title: yup.string().required('You must add a Title'),
        description: yup.string().required('You must add a Description'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<CreateFormData>({
        resolver: yupResolver(schema),
    });

    const postRef = collection(db, 'posts');

    const onCreatePost = async (data: CreateFormData) => {
        await addDoc(postRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid,
            createdAt: serverTimestamp(),
        });
        navigate('/main');
    };

    return (
        <form className="create-form" onSubmit={handleSubmit(onCreatePost)}>
            <h1> Add Your Project Here </h1>
            <h2> Title </h2>
            <input className="input-title" placeholder="Title..." {...register('title')} />
            <p className="error-message">{errors.title?.message}</p>
            
            <h2> Description </h2>
            <textarea rows={8} className="input-description" placeholder="Description..." {...register('description')} />
            <p className="error-message">{errors.description?.message}</p>
            
            <input className="submit-button" type="submit" value="Submit"/>
        </form>
    );
};

export default CreatePost;