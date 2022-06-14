import React, { useState, useEffect, useRef } from 'react';
import openSocket from 'socket.io-client';
import { Button, Container, Image } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import FeedList from '../../components/post/FeedList';
import useFetchGet from '../../hook/useFetchGet';
import useFetchPost from '../../hook/useFetchPost';

const ProfileDetail = () => {
	const mount = useRef(false);
	const jwtToken = localStorage.getItem('user-token');
	const myUserName = localStorage.getItem('user-name');
	const myId = localStorage.getItem('user-id');
	const io = openSocket('http://localhost:5000');

	const paramsUserName = useParams().userName;
	const navigate = useNavigate();

	const [getProfileTrigger, setGetProfileTrigger] = useState(false);
	const [getFeedsTrigger, setGetFeedsTrigger] = useState(false);
	const [postFollowTrigger, setPostFollowTrigger] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { data: user } = useFetchGet(
		`/profile/${paramsUserName}`,
		getProfileTrigger,
		jwtToken
	);

	useEffect(() => {
		if (!getFeedsTrigger) {
			setGetFeedsTrigger(true);
		} else {
			setGetFeedsTrigger(false);
		}
	}, [paramsUserName]);

	// send follows
	const { data: follow } = useFetchPost(
		`/follow/${user && user.result.userId.toString()}`,
		{
			followingUserId: myId,
		},
		postFollowTrigger,
		jwtToken
	);

	const sendFollow = () => {
		!postFollowTrigger
			? setPostFollowTrigger((prev) => (prev = true))
			: setPostFollowTrigger((prev) => (prev = false));
	};

	useEffect(() => {
		io.on('follow', (data) => {
			if (data.action === 'follow') {
				!getProfileTrigger
					? setGetProfileTrigger(true)
					: setGetProfileTrigger(false);
			}
		});
	}, [user]);

	return (
		<>
			<Navigation />
			{user && (
				<Container
					style={{ padding: '5rem 1rem' }}
					fluid
					className='container bg-dark profile-detail-container'
				>
					<div className='profile-detail-header'>
						<Image
							roundedCircle
							className='profile-picture-detail'
							src={user.result.profilePicture}
						></Image>
						<h1 className='username-detail'>{user.result.userName}</h1>
						<h3>{user.result.name}</h3>
						<div
							className='d-flex w-50 justify-content-evenly align-items-center'
							style={{ marginTop: '1rem' }}
						>
							<div
								className='followers d-flex flex-column align-items-center'
								style={{ lineHeight: '25%' }}
							>
								<p>
									<strong>{user.result.followers}</strong>
								</p>
								<p>Followers</p>
							</div>
							<div
								className='following d-flex flex-column align-items-center'
								style={{ lineHeight: '25%' }}
							>
								<p>
									<strong>{user.result.following}</strong>
								</p>
								<p>Following</p>
							</div>
						</div>
						<p className='user-detail-bio'>{user.result.bio}</p>

						<div
							className={
								user.result.userName !== myUserName
									? 'd-flex justify-content-between mt-5'
									: 'd-flex justify-content-center mt-5'
							}
							style={{ width: '80%' }}
						>
							<Button
								style={{ width: '65%' }}
								variant='primary'
								onClick={() =>
									user.result.userName === myUserName
										? navigate(`/edit-profile/${paramsUserName}`)
										: sendFollow()
								}
							>
								{user.result.userName === myUserName
									? 'Edit Profile'
									: 'Follow'}
							</Button>
							{user.result.userName !== myUserName && (
								<Button
									style={{ width: '30%' }}
									onClick={() => {
										navigate(`/chat/${user.result.userId}`);
									}}
								>
									message
								</Button>
							)}
						</div>
					</div>
					{user && <FeedList feeds={user.result.feeds} isLoading={isLoading} />}
				</Container>
			)}
		</>
	);
};

export default ProfileDetail;
