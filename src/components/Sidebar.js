import React from 'react';
import { Button, Image, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Classes from './Sidebar.module.css';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
	const navigate = useNavigate();
	const handleCloseSidebar = () => setShowSidebar(false);
	const profilePicture = localStorage.getItem('profile-picture');
	const userName = localStorage.getItem('user-name');
	const name = localStorage.getItem('name');
	const bio = localStorage.getItem('bio');
	console.log(localStorage);
	return (
		<>
			<Offcanvas
				show={showSidebar}
				onHide={handleCloseSidebar}
				placement='end'
				className={`bg-dark ${Classes.sidebarContainer}`}
				closeButton
			>
				<Offcanvas.Header className={Classes.sidebarHead}>
					<div className='d-flex'>
						<Image
							roundedCircle
							src={profilePicture}
							style={{ height: '40px', width: '40px' }}
						></Image>
						<h1>{userName}</h1>
					</div>
					<h3>{name}</h3>
					<p>{bio}</p>
				</Offcanvas.Header>
				<Offcanvas.Body className='d-flex flex-column justify-content-between'>
					<Button onClick={() => navigate(`/${userName}`)}>Profile</Button>
					<Button
						variant='outline-danger'
						onClick={() => {
							localStorage.clear();
							navigate(`/login`);
						}}
					>
						Logout
					</Button>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
};

export default Sidebar;
