import { addDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../config/firebase";
import { PostItem as IPost } from "./Main";

interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
  userId: string;
}

const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState<Like[] | null>(null);
  const likesRef = collection(db, "likes");
  const likesQuery = query(likesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesQuery);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev ? [...prev, { userId: user.uid, likeId: newDoc.id }] : [{ userId: user.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(likesRef, where("postId", "==", post.id), where("userId", "==", user?.uid));
      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="post-container">
      <h2 className="post-title">{post.title}</h2>
      <p>{post.description}</p>
      <div className="post-footer">
        
        <button className={hasUserLiked ? "like-button liked" : "like-button"} onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? "Unlike" : "Like"}
        </button>
        <p style={{ color: "#666" }}> @{post.username} </p>
        <p style={{ color: "#666" }}> Likes: {likes && likes.length} </p>
      </div>
      <style>
        {`
          body {
            background: linear-gradient(to bottom, #f5f7fa, #c3cfe2);
          }
          .post-container {
            margin-bottom: 20px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: linear-gradient(to bottom, #ffffff, #e6e6e6);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .post-title {
            color: #333;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
          }
          .post-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
          }
          .like-button {
            cursor: pointer;
            border: 3px solid green;
            color: green;
            padding: 8px 16px;
            border-radius: 4px;
            transition: background-color 0.3s ease;
          }
          
          .like-button:hover {
            background-color: green; 
            color: #fff;
          }
          
          .liked {
            background-color: #27ae60; 
            border: none;
            color: #fff;
          }
        
        `}
      </style>
    </div>
  );
};

export default Post;
