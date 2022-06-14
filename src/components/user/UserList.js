import React, { useEffect, useRef, useState } from 'react';
import { ListGroup, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetchGet from '../../hook/useFetchGet';

const UserList = ({ users }) => {
	const location = useLocation();
	const mount = useRef(false);
	const navigate = useNavigate();
	const [userName, setUserName] = useState('');
	const [getProfileTrigger, setGetProfileTrigger] = useState(null);
	const jwtToken = localStorage.getItem('user-token');

	return (
		<>
			{users.map((user) => {
				return (
					<ListGroup.Item
						className='d-flex justify-content-start'
						style={{ cursor: 'pointer' }}
						onClick={(e) => {
							window.location.href = `/${user.user_name}`;
						}}
					>
						<div>
							<Image
								style={{
									width: '35px',
									height: '35px',
									backgroundColor: 'red',
									marginRight: '1rem',
								}}
								src={user.profile_picture}
								roundedCircle
								className='profile-picture'
							></Image>
						</div>
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
								style={{ fontSize: '1rem' }}
								id={user.user_id}
								key={user.user_id}
							>
								{user.user_name}
							</h1>
							<p className='text-muted' style={{ width: '100%' }}>
								{user.name}
							</p>
						</div>
					</ListGroup.Item>
				);
			})}
		</>
	);
};

export default UserList;
