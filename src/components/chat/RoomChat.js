import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Image } from 'react-bootstrap';
import Moment from 'react-moment';
import openSocket from 'socket.io-client';

import Classes from './RoomChat.module.css';
import Navigation from '../Navigation';
import useFetchPost from '../../hook/useFetchPost';
import useFetchGet from '../../hook/useFetchGet';
import { useParams } from 'react-router-dom';

import sendMessageIcon from '../../assets/icons/send.png';

const Message = () => {
	document.title = userInfo.user_name;
	const jwtToken = localStorage.getItem('user-token');
	const myId = localStorage.getItem('user-id');
	const myProfilePicture = localStorage.getItem('profile-picture');
	const { userId } = useParams();
	const mount = useRef();

	const [messageValue, setMessageValue] = useState('');
	const [sendMessageTrigger, setSendMessageTrigger] = useState(false);
	const [getMessageTrigger, setGetMessageTrigger] = useState(false);
	const [getUserInfoTrigger, setGetUserInfoTrigger] = useState(false);

	const io = openSocket(`${process.env.REACT_APP_API_URI}`);

	const { data: userInfo } = useFetchGet(
		`/chat/user/info/${userId}`,
		getUserInfoTrigger,
		jwtToken
	);

	// sending message
	const sendMessageHandler = () => {
		const element = document.getElementById('roomchat');
		element.scrollTop = element.scrollHeight;
		!sendMessageTrigger
			? setSendMessageTrigger(true)
			: setSendMessageTrigger(false);
		// setMessageValue('');
	};

	const { data: sendMessageResult } = useFetchPost(
		`/message/${myId}/${userId}`,
		{
			value: messageValue,
			myId: myId,
		},
		sendMessageTrigger,
		jwtToken
	);

	// getMessage
	const { data: message } = useFetchGet(
		`/chat/message/${myId}/${userId}`,
		getMessageTrigger,
		jwtToken
	);

	useEffect(() => {
		io.on('message', (data) => {
			if (data.action === 'message') {
				!getMessageTrigger
					? setGetMessageTrigger(true)
					: setGetMessageTrigger(false);
				setMessageValue('');
			}
		});
	}, [sendMessageResult]);

	// get message list
	const [getMessageListTrigger, setGetMessageListTrigger] = useState(false);
	const { data: messageList } = useFetchGet(
		`/message/list/${myId}`,
		getMessageListTrigger,
		jwtToken
	);

	const lastMessage =
		messageList &&
		message &&
		message.result &&
		messageList.result.messageList.filter(
			(msg) => msg.value === message.result[message.result.length - 1].value
		);
	// console.log(lastMessage && lastMessage[0].message_list_id);
	// console.log(message && message.result[message.result.length - 1].value);

	// read message
	const [readMessageTrigger, setReadMessageTrigger] = useState(false);
	const { data: readMessageResult } = useFetchPost(
		`/message/read`,
		{
			messageId:
				lastMessage && lastMessage.length > 0
					? lastMessage[0].message_list_id
					: '',
		},
		readMessageTrigger,
		jwtToken
	);
	useEffect(() => {
		if (lastMessage) {
			if (lastMessage.length > 0) {
				!readMessageTrigger
					? setReadMessageTrigger(true)
					: setReadMessageTrigger(false);
			}
		}
	}, [messageList]);

	return (
		<>
			<Navigation className='mb-5' />
			<Container fluid className='container bg-dark'>
				<div
					className={`d-flex ${Classes.roomchatHeader}`}
					style={{ cursor: 'pointer' }}
					onClick={() => {
						window.location.href = `/${userInfo.userDetail.userName}`;
					}}
				>
					<Image
						roundedCircle
						// className={`${}`}
						src={userInfo && userInfo.userDetail.profilePicture}
					></Image>
					<div>
						<h1>{userInfo && userInfo.userDetail.userName}</h1>
						<h3 className='text-muted'>
							{userInfo && userInfo.userDetail.name}
						</h3>
					</div>
				</div>
				<div
					className={Classes.roomchatContainer}
					id='roomchat'
					onLoad={(e) => {
						const element = document.getElementById('roomchat');
						element.scrollTop = element.scrollHeight;
					}}
				>
					{message &&
						message.status === 'success' &&
						message.result.map((msg) => {
							return (
								<div
									className={
										msg.sender_id == myId
											? ` d-flex flex-row-reverse`
											: `d-flex`
									}
								>
									<Image
										style={
											msg.sender_id == myId
												? {
														height: '40px',
														width: '40px',
														marginLeft: '1rem',
												  }
												: {
														height: '40px',
														width: '40px',
														marginRight: '1rem',
												  }
										}
										roundedCircle
										src={
											msg.sender_id == myId
												? myProfilePicture
												: userInfo && userInfo.userDetail.profilePicture
										}
									></Image>
									<div
										className={
											msg.sender_id == myId
												? ` bg-primary  ${Classes.myBubbleChat} ${Classes.bubbleChat}`
												: ` bg-primary ${Classes.bubbleChat}`
										}
									>
										<div id='last-message'>
											<p className={` ${Classes.messageText}`}>{msg.value}</p>
										</div>
									</div>

									<p
										className='text-muted'
										style={
											msg.sender_id == myId
												? { marginRight: '1rem' }
												: { marginLeft: '1rem' }
										}
									>
										<Moment format='ddd hh:mm'>{msg.created_at}</Moment>
									</p>
								</div>
							);
						})}

					<Form
						className={`bg-dark  ${Classes.chatInputContainer}`}
						style={{ margin: 'auto' }}
					>
						<Form.Group className={`d-flex ${Classes.chatInput}`}>
							<Form.Control
								as='textarea'
								style={{ resize: 'none', display: 'block' }}
								value={messageValue}
								onChange={(e) => {
									setMessageValue((prev) => (prev = e.target.value));
								}}
							></Form.Control>
							<Button
								variant='none'
								className={!messageValue && 'disabled'}
								onClick={() => {
									sendMessageHandler();
								}}
							>
								<Image
									src={sendMessageIcon}
									style={{ height: '30px', width: '30px' }}
								></Image>
							</Button>
						</Form.Group>
					</Form>
				</div>
			</Container>
		</>
	);
};

export default Message;
