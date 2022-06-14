import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../global.css';

import { Button, Container, Card, Image } from 'react-bootstrap';
import openSocket from 'socket.io-client';
import Moment from 'react-moment';
import useFetchPost from '../../hook/useFetchPost';
import CommentList from './Comments';
import useFetchGet from '../../hook/useFetchGet';
import Classes from './PostList.module.css';
import ModalContainer from '../Modal';
import ModalPrompt from '../ModalPrompt';
import { useNavigate } from 'react-router-dom';

import sendMessageIcon from '../../assets/icons/send.png';
import Responsive from '../../responsive.module.css';

// main component
const PostList = ({
	posts,
	userId,
	userName,
	jwtToken,
	triggerGetPost,
	setTriggerGetPost,
}) => {
	const navigate = useNavigate();
	const myId = localStorage.getItem('user-id');
	// const commentInput = document.querySelector('#comment-input');

	const [postLikeTrigger, setPostLikeTrigger] = useState(false);
	const [getLikeTrigger, setGetLikeTrigger] = useState(false);
	const [postCommentTrigger, setPostCommentTrigger] = useState(false);
	const [getCommentTrigger, setGetCommentTrigger] = useState(false);
	const [getEditPostTrigger, setGetEditPostTrigger] = useState(false);
	const [thisPostId, setThisPostId] = useState('');
	const [postLikedId, setPostLikedId] = useState('');
	const [postCommentId, setPostCommentId] = useState('');
	const [getUsersTrigger, setGetUsersTrigger] = useState(false);
	const [getFollowTrigger, setGetFollowTrigger] = useState(false);
	const [commentValue, setCommentValue] = useState('');
	const [deletePostId, setDeletePostId] = useState('');
	const [lgShow, setLgShow] = useState(false);
	const [showPrompt, setShowPrompt] = useState(false);
	const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

	// send like
	const { data: like } = useFetchPost(
		'/post/like',
		{
			userId: userId,
			userName: userName,
			postId: postLikedId,
		},
		postLikeTrigger,
		jwtToken
	);

	const sendLike = (targetId) => {
		// socket.emit('like', like);
		// !getLikeTrigger ? setGetLikeTrigger(true) : setGetLikeTrigger(false);
		setPostLikedId(targetId);
		if (postLikeTrigger) {
			setPostLikeTrigger(false);
		} else {
			setPostLikeTrigger(true);
		}
	};

	// Get Like
	const { data: getLike } = useFetchGet('/likes', getLikeTrigger, jwtToken);
	useEffect(() => {
		socket.on('like', (data) => {
			if (data.action === 'like post') {
				!getLikeTrigger ? setGetLikeTrigger(true) : setGetLikeTrigger(false);
			}
		});
	}, [getLike]);

	// fetch send comments
	const { data: comment } = useFetchPost(
		'/post/comments',
		{
			text: commentValue,
			userId: userId,
			userName: userName,
			postId: postCommentId,
		},
		postCommentTrigger,
		jwtToken
	);
	useEffect(() => {
		if (comment.success) {
			setCommentValue('');
			!getCommentTrigger
				? setGetCommentTrigger(true)
				: setGetCommentTrigger(false);
			setCommentValue('');
		}
	}, [comment]);

	const sendComment = (targetId) => {
		// setCommentValue((prev) => commentValue);
		setPostCommentId(targetId);
		if (!postCommentTrigger) {
			setPostCommentTrigger(true);
		} else {
			setPostCommentTrigger(false);
		}
	};

	// get comment
	const { data: getComment } = useFetchGet(
		'/comments',
		getCommentTrigger,
		jwtToken
	);
	useEffect(() => {
		socket.on('comment', (data) => {
			if (data.action === 'comment') {
				!getCommentTrigger
					? setGetCommentTrigger(true)
					: setGetCommentTrigger(false);
				setCommentValue('');
			}
		});
		socket.on('comment-delete', (data) => {
			if (data.action === 'comment-delete') {
				setGetCommentTrigger(true);
				!getCommentTrigger
					? setGetCommentTrigger(true)
					: setGetCommentTrigger(false);
			}
		});
		socket.on('comment-update', (data) => {
			if (data.action === 'comment-update') {
				setGetCommentTrigger(true);
				!getCommentTrigger
					? setGetCommentTrigger(true)
					: setGetCommentTrigger(false);
			}
		});
	}, [getComment]);

	// get all user to match profile pict in post list

	const { data: users } = useFetchGet('/users', getUsersTrigger, jwtToken);

	// get current post value for edit
	const getPostId = () => {
		if (!getEditPostTrigger) {
			setGetEditPostTrigger(true);
		} else {
			setGetEditPostTrigger(false);
		}
		console.log(thisPostId);
	};

	const { data: currentPostValue } = useFetchGet(
		`/post/edit/${thisPostId}`,
		getEditPostTrigger,
		jwtToken
	);

	// get post just from user following
	const { data: getFollow } = useFetchGet(
		'/followers',
		getFollowTrigger,
		jwtToken
	);

	const myFollowedUser =
		getFollow && getFollow.filter((follow) => follow.following_user_id == myId);
	const myFollowedUserId =
		myFollowedUser && myFollowedUser.map((id) => id.followed_user_id);

	return (
		<>
			<ModalPrompt
				showPrompt={showPrompt}
				setShowPrompt={setShowPrompt}
				deletePostId={deletePostId}
				triggerGetPost={triggerGetPost}
				setTriggerGetPost={setTriggerGetPost}
			/>
			{currentPostValue && (
				<ModalContainer
					lgShow={lgShow}
					setLgShow={setLgShow}
					context='edit-post'
					postValue={currentPostValue.post}
				/>
			)}

			{myFollowedUser &&
				posts.map((post) => {
					return (
						<Card
							className={`card-post ${Responsive.cardPost}`}
							bg='dark'
							key={post.post_id}
							id={post.post_id}
						>
							<Card.Body>
								<Card.Img
									className={`post-img ${Responsive.postImg}`}
									variant='top'
									src={post.image}
								/>
								<Card.Title>{post.title}</Card.Title>
								<div className={Responsive.cardBody}>
									<div className='post-profile d-flex'>
										<Image
											className='post-profile-img'
											src={
												users &&
												users.find((user) => user.user_id === post.user_id)
													.profile_picture
											}
											alt=''
											roundedCircle
										/>
										<p
											className='author '
											style={{ cursor: 'pointer' }}
											onClick={() => {
												navigate(
													`/${users &&
														users.find((user) => user.user_id === post.user_id)
															.user_name}`
												);
											}}
										>
											{users &&
												users.find((user) => user.user_id === post.user_id)
													.user_name}
										</p>
									</div>
									<div className='insight'>
										<p className='text-muted'>
											<Moment fromNow>{post.created_at}</Moment>
										</p>
										<p>
											<strong className={`${Responsive.postLikes}`}>
												{getLike &&
													getLike.filter(
														(like) => like.post_id === post.post_id
													).length}{' '}
												Likes
											</strong>
										</p>
									</div>
									<Card.Text>
										<p className={`${Responsive.caption}`}>{post.caption}</p>
									</Card.Text>
									<div
										className={`${Classes.cardActions} ${Responsive.cardActions}`}
									>
										<Button
											variant='primary'
											onClick={(e) => sendLike(post.post_id)}
										>
											Like
										</Button>
										<Button variant='primary'>Share</Button>
										{post.user_id == myId && (
											<>
												<Button
													variant='outline-primary'
													onClick={() => {
														setThisPostId((prev) => (prev = post.post_id));
														getPostId();
														setLgShow(true);
													}}
												>
													Edit
												</Button>
												<Button
													variant='danger'
													onClick={() => {
														setDeletePostId((prev) => (prev = post.post_id));
														setShowPrompt(true);
													}}
												>
													Delete
												</Button>
											</>
										)}
									</div>
								</div>
							</Card.Body>
							<div
								className={`post-comments d-flex flex-column justify-content-between align-items-center ${Responsive.commentContainer}`}
							>
								<div
									className={`user-comment-container d-flex ${Responsive.postCommentContainer}`}
								>
									<ul>
										<li>
											{getComment && (
												<CommentList
													jwtToken={jwtToken}
													comments={getComment}
													postId={post.post_id}
													getCommentTrigger={getCommentTrigger}
													setGetCommentTrigger={setGetCommentTrigger}
												/>
											)}
										</li>
									</ul>
								</div>
								<div
									className={`send-comment-container d-flex justify-content-evenly ${Responsive.SendCommentContainer}`}
								>
									<input
										id='comment-input'
										type='text'
										style={{ width: '250px' }}
										onChange={(e) => {
											setCommentValue(e.target.value);
										}}
									/>

									<Button
										onClick={(e) => {
											sendComment(post.post_id);
										}}
										className={!commentValue ? 'disabled' : ''}
									>
										<Image src={sendMessageIcon}></Image>
									</Button>
								</div>
							</div>
						</Card>
					);
				})}
		</>
	);
};

export default PostList;
