import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import useFetchGet from '../../hook/useFetchGet';
import Classes from './FeedList.module.css';

const FeedList = ({ feeds, isLoading }) => {
	// const [getFeedsTrigger, setGetFeedsTrigger] = useState(false);
	const jwtToken = localStorage.getItem('user-token');
	const userName = useParams().userName;
	const [getUsersTrigger, setGetUsersTrigger] = useState(false);

	// get targeted user
	const { data: user } = useFetchGet(
		`/user/${userName}`,
		getUsersTrigger,
		jwtToken
	);

	return (
		<>
			<div className={Classes.feedContainer}>
				{isLoading && <h1>loading...</h1>}
				{user &&
					feeds
						// .filter((feed) => feed.user_id === user.user_id)
						.map((feed) => {
							return (
								<Image
									key={feed.post_id}
									className={Classes.post}
									src={feed.image}
								></Image>
							);
						})}
				{feeds.length === 0 && (
					<h1 className='text-muted m-auto'>Not posted anything :p</h1>
				)}
			</div>
		</>
	);
};

export default FeedList;
