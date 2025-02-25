import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api/blogApi';


const PostsPage = () => {
    const [posts, setPosts] = useState([]);  // ברירת מחדל למערך ריק
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            const data = await fetchPosts();
            setPosts(data);
            setLoading(false);
        };

        loadPosts();
    }, []);

    return (
        <div>
            <h1>Blog Posts</h1>
            {loading ? (
                <p>Loading...</p>
            ) : posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </div>
                ))
            ) : (
                <p>No posts found.</p>
            )}
        </div>
    );
};

export default PostsPage;
