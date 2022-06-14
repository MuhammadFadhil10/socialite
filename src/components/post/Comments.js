import React, { useEffect, useState } from 'react';
import { Image, Form } from 'react-bootstrap';
import Moment from 'react-moment';
import openSocket from 'socket.io-client';

import { useNavigate } from 'react-router-dom';
import useFetchDelete from '../../hook/useFetchDelete';
import useFetchGet from '../../hook/useFetchGet';
import useFetchPost from '../../hook/useFetchPost';

const CommentList = ({
	jwtToken,
	comments,
	postId,
	getCommentTrigger,
	setGetCommentTrigger,
}) => {
	const navigate = useNavigate();
	const myId = localStorage.getItem('user-id');
	const [getUsersTrigger, setGetUsersTrigger] = useState(false);
	const [updateCommentTrigger, setUpdateCommentTrigger] = useState(false);
	const [deleteCommentTrigger, setDeleteCommentTrigger] = useState(false);
	const [editComment, setEditComment] = useState(false);
	const [editCommentTrigger, setEditCommentTrigger] = useState(false);
	const [newCommentValue, setNewCommentValue] = useState('');
	const [commentId, setCommentId] = useState('');

	// delete comment
	const { data: deleteComment } = useFetchDelete(
		`/post/comment/delete/${commentId}`,
		deleteCommentTrigger,
		jwtToken
	);
	const deleteCommentHandler = () => {
		!deleteCommentTrigger
			? setDeleteCommentTrigger(true)
			: setDeleteCommentTrigger(false);
	};

	// update comment
	const updateComentHandler = () => {
		!editCommentTrigger
			? setEditCommentTrigger(true)
			: setEditCommentTrigger(false);
	};

	const { data: editCommentResult } = useFetchPost(
		`/post/comment/edit/${commentId}/${newCommentValue}`,
		{},
		editCommentTrigger,
		jwtToken
	);

	// get all user to match profile pict in comments
	const { data: users } = useFetchGet('/users', getUsersTrigger, jwtToken);
	return (
		<>
			{comments
				.filter((comment) => comment.post_id === postId)
				.map((comment) => {
					return (
						<div className='user-comment' key={comment.comment_id}>
							<Image
								src={
									users &&
									users.find((user) => user.user_id === comment.user_id)
										.profile_picture
								}
								roundedCircle
								style={{ backgroundColor: 'blue' }}
							></Image>
							<p className='comment-value'>
								<strong
									style={{ cursor: 'pointer' }}
									onClick={() => navigate(`/${comment.user_name}`)}
								>
									{users &&
										users.find((user) => user.user_id === comment.user_id)
											.user_name}
								</strong>{' '}
								{comment.text}
								{+myId === comment.user_id && editComment && (
									<Form.Control
										type='text'
										value={newCommentValue}
										onChange={(e) =>
											setNewCommentValue((prev) => (prev = e.target.value))
										}
									></Form.Control>
								)}
								<p className='text-muted'>
									<Moment fromNow>{comment.created_at}</Moment>
								</p>
								<div className='comment-action d-flex  justify-content-start'>
									{+myId === comment.user_id && !editComment && (
										<p
											style={{ marginRight: '15px', cursor: 'pointer' }}
											onClick={() => {
												setEditComment(true);
											}}
										>
											Edit
										</p>
									)}
									{+myId === comment.user_id && editComment && (
										<p
											style={{ marginRight: '15px', cursor: 'pointer' }}
											onClick={() => {
												setCommentId(comment.comment_id);
												updateComentHandler();
												setEditComment(false);
											}}
										>
											Update
										</p>
									)}
									{+myId === comment.user_id && editComment && (
										<p
											style={{ marginRight: '15px', cursor: 'pointer' }}
											onClick={() => {
												setEditComment(false);
											}}
										>
											cancel
										</p>
									)}
									{+myId === comment.user_id && (
										<p
											className='text-danger'
											style={{ cursor: 'pointer' }}
											onClick={() => {
												setCommentId(comment.comment_id);
												deleteCommentHandler();
											}}
										>
											Delete
										</p>
									)}
								</div>
							</p>
						</div>
					);
				})}
		</>
	);
};

export default CommentList;
