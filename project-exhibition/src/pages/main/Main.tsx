import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useEffect, useState } from 'react';
import Post from './Post';

export interface PostItem {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
  createdAt: number;
}

const Main = () => {
  const [postList, setPostList] = useState<PostItem[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const getPosts = async () => {
      let q = query(collection(db, 'posts'));

      if (searchQuery !== '') {
        q = query(collection(db, 'posts'), where('title', '>=', searchQuery), orderBy('title'));
      } else {
        q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      }

      const data = await getDocs(q);
      const posts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as PostItem[];
      setPostList(posts);
    };
    getPosts();
  }, [searchQuery]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter the posts based on the search query
  const filteredPosts = postList?.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="main-container">
      <div>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {filteredPosts?.length ? (
        filteredPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))
      ) : (
        <div className="no-feed-found">
          <p>{searchQuery ? "No search results found" : "No feed found"}</p>
          <p>😑</p>
        </div>
      )}
      <style>
        {`
          .main-container {
            padding: 1.5rem;
          }
          .no-feed-found {
            padding: 9rem;
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 3rem;
          }
        `}
      </style>
    </div>
  );
};

export default Main;
