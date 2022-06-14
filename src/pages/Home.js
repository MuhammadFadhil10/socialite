import openSocket from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

import Navigation from '../components/Navigation';
import StoryBar from '../components/home/StoryBar';
import useFetchGet from '../hook/useFetchGet';
import PostList from '../components/post/PostList';

import Responsive from '../responsive.module.css';
import '../global.css';

const Home = () => {
	document.title = 'Social Dummy - Home';

	const [triggerGetPost, setTriggerGetPost] = useState(false);

	const userId = localStorage.getItem('user-id');
	const userName = localStorage.getItem('user-name');
	const jwtToken = localStorage.getItem('user-token');

	// fetch post for home
	const { data: posts } = useFetchGet(
		`/posts/${userId}`,
		triggerGetPost,
		jwtToken
	);
	console.log(posts);

	//trigger for fetch get post again after upload post
	useEffect(() => {
		const socket = openSocket(`${process.env.REACT_APP_API_URI}`);
		socket.on('post', (data) => {
			if (data.action === 'new post') {
				!triggerGetPost ? setTriggerGetPost(true) : setTriggerGetPost(false);
				socket.on('delete', (data) => {
					if (data.action === 'delete-post') {
						setTriggerGetPost(false);
					}
				});
			}
		});
	}, [posts]);

	return (
		<>
			<Navigation
				triggerGetPost={triggerGetPost}
				setTriggerGetPost={setTriggerGetPost}
			/>
			<Container
				style={{ padding: '5rem 1rem' }}
				fluid
				className={`container bg-dark ${Responsive.homeContainer}`}
			>
				<main>
					<StoryBar />
					<article className='d-flex post-list-home'>
						{posts && (
							<PostList
								posts={posts}
								userId={userId}
								userName={userName}
								jwtToken={jwtToken}
								triggerGetPost={triggerGetPost}
								setTriggerGetPost={setTriggerGetPost}
							/>
						)}

						{posts && posts.length < 1 && (
							<h1 className='text-danger align-self-center'>No post!</h1>
						)}
					</article>
				</main>
			</Container>
		</>
	);
};

export default Home;
