import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Button, Form, ListGroup, Image } from 'react-bootstrap';
import '../global.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import openSocket from 'socket.io-client';

import Classes from './Navigation.module.css';
import ModalContainer from './Modal';
import useFetchPost from '../hook/useFetchPost';
import UserList from './user/UserList';
import Sidebar from './Sidebar';
import NotificationList from './NotificationList';

// icons
import homeIcon from '../assets/icons/home.png';
import exploreIcon from '../assets/icons/explore.png';
import postIcon from '../assets/icons/post.png';
import notificationIcon from '../assets/icons/notification.png';
import messageIcon from '../assets/icons/message.png';
import logo from '../assets/icons/socialite-logo.png';
import NotificationClass from './NotificationList.module.css';
import useFetchGet from '../hook/useFetchGet';
import useFetchDelete from '../hook/useFetchDelete';
import Responsive from '../responsive.module.css';

const Navigation = ({ triggerGetPost, setTriggerGetPost }) => {
	const navigate = useNavigate();

	const jwtToken = localStorage.getItem('user-token');
	const myProfilePicture = localStorage.getItem('profile-picture');
	const myId = localStorage.getItem('user-id');

	const [searchTab, setSearchTab] = useState(false);
	const [notificationTab, setNotificationTab] = useState(false);
	const [triggerSearchUser, setTriggerSearchUser] = useState(false);
	const [lgShow, setLgShow] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [showSidebar, setShowSidebar] = useState(false);
	const [getMessageListTrigger, setGetMessageListTrigger] = useState(false);
	const [getNotificationTrigger, setGetNotificationTrigger] = useState(false);
	const [readNotificationTrigger, setReadNotificationTrigger] = useState(false);

	const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

	const postNav = () => {
		setLgShow(true);
	};

	// control trigger for send value search
	const searchUser = (value) => {
		setSearchValue(value);
		if (!triggerSearchUser) {
			setTriggerSearchUser(true);
		} else {
			setTriggerSearchUser(false);
		}
	};
	// search user
	const { data: users } = useFetchPost(
		`/user/${searchValue}`,
		{
			userName: searchValue,
		},
		triggerSearchUser,
		jwtToken
	);

	// show user list tab
	const showSearchTab = (value) => {
		const searchTabContainer = document.querySelector('.list-group');
		if (value !== '') {
			setSearchTab(true);
			searchTabContainer.style.position = 'fixed';
		} else {
			setSearchTab(false);
		}
	};

	// show notification list tab
	const showNotificationTab = () => {
		!notificationTab ? setNotificationTab(true) : setNotificationTab(false);
	};

	// sidebar
	const handleShowSidebar = () => setShowSidebar(true);

	// get message notification
	const { data: messageList } = useFetchGet(
		`/message/list/${myId}`,
		getMessageListTrigger,
		jwtToken
	);
	const readList =
		messageList &&
		messageList.result.messageList.filter(
			(msg) => msg.is_read === 0 && msg.sender_id !== +myId
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

	// get notification
	const { data: notifications } = useFetchGet(
		`/notification/${myId}`,
		getNotificationTrigger,
		jwtToken
	);
	// setup live notification with socket.io
	useEffect(() => {
		socket.on('follow', (data) => {
			if (data.action === 'follow') {
				!getNotificationTrigger
					? setGetNotificationTrigger(true)
					: setGetNotificationTrigger(false);
			}
		});
		socket.on('like', (data) => {
			if (data.action === 'like post') {
				!getNotificationTrigger
					? setGetNotificationTrigger(true)
					: setGetNotificationTrigger(false);
			}
		});
		socket.on('comment', (data) => {
			if (data.action === 'comment') {
				!getNotificationTrigger
					? setGetNotificationTrigger(true)
					: setGetNotificationTrigger(false);
			}
		});
	}, [notifications]);

	// read notification
	const notificationReadList =
		notifications &&
		notifications.result.filter(
			(n) => n.is_read === 0 && n.to_id === +myId && n.from_id !== +myId
		);
	const notificationHandler = () => {
		!readNotificationTrigger
			? setReadNotificationTrigger(true)
			: setReadNotificationTrigger(false);
	};
	const { data: readNotification } = useFetchDelete(
		`/notification/read/${myId}`,

		readNotificationTrigger,
		jwtToken
	);
	return (
		<>
			<Navbar
				bg='dark'
				className={`navbar d-flex justify-content-around ${Responsive.navigation}`}
				variant='dark'
			>
				<Navbar.Brand href='/home'>
					<img
						alt=''
						src={logo}
						width='30'
						height='30'
						className='d-inline-block align-top'
					/>{' '}
					SociaLite
				</Navbar.Brand>
				<div className='navbar-pages d-flex'>
					<div className='d-flex justify-content-evenly'>
						<h1
							className='text-light'
							style={{ cursor: 'pointer' }}
							onClick={() => {
								navigate(-1);
							}}
						>
							{'<'}
						</h1>
						<h1
							className='text-light'
							style={{ cursor: 'pointer', marginLeft: '2rem' }}
							onClick={() => {
								navigate(+1);
							}}
						>
							{'>'}
						</h1>
					</div>
					<div className='navbar-search-container'>
						<Form.Control
							className='search-input'
							type='text'
							placeholder='Search'
							autoCapitalize='none'
							onChange={(e) => {
								searchUser(e.target.value);
								showSearchTab(e.target.value);
							}}
						></Form.Control>
						<ListGroup className={searchTab ? '' : 'visually-hidden'}>
							{users.result && (
								<UserList users={users.result && users.result} />
							)}
						</ListGroup>
					</div>

					<div
						className='navbar-pages-action d-flex justify-content-between align-items-center'
						style={{ width: '130px' }}
					>
						<Link to='/home'>
							<Image title='home' src={homeIcon}></Image>
						</Link>
						<Button
							variant='none'
							onClick={() => postNav()}
							style={{ marginRight: '15px' }}
						>
							<Image title='post' src={postIcon}></Image>
						</Button>
						<Link to='/explore'>
							<Image title='explore' src={exploreIcon}></Image>
						</Link>
					</div>
				</div>
				<div className='d-flex'>
					<div
						className='d-flex justify-content-between mt-2'
						style={{ width: '70px' }}
					>
						<div
							// to='/home'
							className={
								notificationReadList && notificationReadList.length > 0
									? Classes.messageIcon
									: ''
							}
							style={{ cursor: 'pointer' }}
							onClick={() => {
								notificationHandler();
								setNotificationTab(true);
							}}
						>
							<Image
								title='notifications'
								style={{ height: '30px' }}
								src={notificationIcon}
							></Image>
						</div>
						<ListGroup
							className={
								notificationTab
									? `${Classes.notificationList} ${NotificationClass.notificationTab}`
									: 'visually-hidden'
							}
						>
							{notifications && (
								<NotificationList
									notifications={notifications.result}
									setNotificationTab={setNotificationTab}
								/>
							)}
						</ListGroup>
						<Link
							className={
								readList && readList.length > 0 ? Classes.messageIcon : ''
							}
							to='/message'
						>
							<Image title='message' src={messageIcon}></Image>
						</Link>
					</div>

					<Image
						className={Classes.profileNav}
						roundedCircle
						src={myProfilePicture}
						style={{
							height: '45px',
							widtth: '45px',
							cursor: 'pointer',
							marginLeft: '2rem',
						}}
						onClick={handleShowSidebar}
					></Image>
					<Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
				</div>
			</Navbar>
			<ModalContainer
				lgShow={lgShow}
				setLgShow={setLgShow}
				context='create-post'
				triggerGetPost={triggerGetPost}
				setTriggerGetPost={setTriggerGetPost}
			/>
		</>
	);
};

export default Navigation;
