import React, { useRef, useState } from 'react';
import { ListGroup, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';

import Classes from './NotificationList.module.css';

const NotificationList = ({ notifications, setNotificationTab }) => {
	const navigate = useNavigate();
	const myId = localStorage.getItem('user-id');
	const [userName, setUserName] = useState('');
	const [getProfileTrigger, setGetProfileTrigger] = useState(null);
	const jwtToken = localStorage.getItem('user-token');

	return (
		<>
			<div className='notification-tab-header w-100 bg-dark'>
				<h1
					style={{ cursor: 'pointer' }}
					className='text-danger  '
					onClick={() => {
						setNotificationTab(false);
					}}
				>
					x
				</h1>
			</div>
			{notifications
				.filter((n) => n.from_id !== +myId)
				.map((notification) => {
					return (
						<ListGroup.Item className='d-flex justify-content-start'>
							<div
								className='d-flex'
								style={{
									flexDirection: 'column',
									width: '100%',
									lineHeight: '1rem',
								}}
							>
								<h1
									className='text-dark'
									style={{ fontSize: '1rem', cursor: 'pointer' }}
									onClick={() => {
										navigate(`/${notification.user_name}`);
									}}
								>
									{notification.user_name}
								</h1>
								<p className='text-dark' style={{ width: '100%' }}>
									{notification.text}
								</p>
								<p className='text-muted' style={{ width: '100%' }}>
									<Moment fromNow>{notification.created_at}</Moment>
								</p>
							</div>
						</ListGroup.Item>
					);
				})}

			{notifications.length === 0 && (
				<ListGroup.Item className='d-flex justify-content-start'>
					<h4 className='text-dark'>You have no notification</h4>
				</ListGroup.Item>
			)}
		</>
	);
};

export default NotificationList;
