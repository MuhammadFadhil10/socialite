import React, { useState, useEffect } from 'react';
import openSocket from 'socket.io-client';

import { Container, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import useFetchGet from '../hook/useFetchGet';
import Classes from './Message.module.css';
import useFetchPost from '../hook/useFetchPost';

const Message = () => {
	const socket = openSocket(`${process.env.REACT_APP_API_URI}`);
	const navigate = useNavigate();
	const myId = localStorage.getItem('user-id');
	const myPicture = localStorage.getItem('profile-picture');
	const myUserName = localStorage.getItem('user-name');
	const jwtToken = localStorage.getItem('user-token');

	const [messageId, setMessageId] = useState('');

	const [getMessageListTrigger, setGetMessageListTrigger] = useState(false);
	const { data: messageList } = useFetchGet(
		`/message/list/${myId}`,
		getMessageListTrigger,
		jwtToken
	);
	useEffect(() => {
		socket.on('messagelist', (data) => {
			if (data.action === 'messagelist') {
				!getMessageListTrigger
					? setGetMessageListTrigger(true)
					: setGetMessageListTrigger(false);
			}
		});
	}, [messageList]);

	// read message
	// const [readMessageTrigger, setReadMessageTrigger] = useState(false);
	// const { data: readMessageResult } = useFetchPost(
	// 	`/message/read/${messageId}`,
	// 	null,
	// 	readMessageTrigger,
	// 	jwtToken
	// );
	// const readMessage = () => {
	// 	!readMessageTrigger
	// 		? setReadMessageTrigger(true)
	// 		: setReadMessageTrigger(false);
	// };

	const [getUserTrigger, setGetUserTrigger] = useState(false);
	const { data: user } = useFetchGet('/users', getUserTrigger, jwtToken);
	return (
		<>
			<Navigation />
			<Container fluid className='container bg-dark'>
				<h1>Message</h1>
				<div className='message-list-container mt-5'>
					<ul>
						{messageList &&
							messageList.result.messageList.map((msg) => {
								return (
									<li
										id={msg.message_list_id}
										key={msg.message_list_id}
										className={`d-flex ${Classes.messageList}`}
										onClick={() => {
											// console.log(msg.message_list_id);
											// setMessageId((prev) => (prev = msg.message_list_id));
											// readMessage();

											navigate(
												`/chat/${
													msg.sender_id === +myId
														? msg.receiver_id
														: msg.sender_id
												}`
											);
										}}
									>
										<Image
											roundedCircle
											src={
												myPicture === msg.person_one_picture
													? msg.person_two_picture
													: msg.person_one_picture
											}
											className={`${Classes.notRead}`}
											style={{ height: '50px', width: '50px' }}
										></Image>
										<div>
											<p className={`${Classes.messageListUsername}`}>
												{myUserName === msg.person_one_username
													? msg.person_two_username
													: msg.person_one_username}
											</p>
											<p className={`${Classes.messageListValue} `}>
												{msg.is_read == 0 ? (
													<strong>{msg.value}</strong>
												) : (
													msg.value
												)}
											</p>
										</div>
									</li>
								);
							})}
					</ul>
				</div>
			</Container>
		</>
	);
};

export default Message;
