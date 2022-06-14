import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Image, Navbar } from 'react-bootstrap';

const StoryBar = () => {
	const profilePicture = localStorage.getItem('profile-picture');
	return (
		<>
			<div
				className='story-bar '
				style={{ width: '100%', height: '4rem', marginBottom: '3rem' }}
			>
				<ul className='d-flex justify-content-start'>
					<li>
						<Image
							roundedCircle
							src={profilePicture}
							style={{ height: '50px', width: '50px' }}
						></Image>
					</li>
				</ul>
			</div>
		</>
	);
};

export default StoryBar;
