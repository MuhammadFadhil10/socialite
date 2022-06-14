import React from 'react';
import { Container } from 'react-bootstrap';
import Navigation from '../components/Navigation';

const Explore = () => {
	return (
		<>
			<Navigation />
			<Container
				fluid
				style={{ padding: '5rem 1rem' }}
				className='container bg-dark'
			>
				<h1>Coming Soon</h1>
			</Container>
		</>
	);
};

export default Explore;
