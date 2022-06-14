import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';
import {
	Container,
	Button,
	Alert,
	Row,
	Col,
	Card,
	Nav,
} from 'react-bootstrap/';
import React, { useState, useEffect } from 'react';
import Register from './pages/auth/Register';
import ControlledCarousel from './components/auth/Carousel';
import Navigation from './components/Navigation';
import Responsive from './responsive.module.css';

function App() {
	const [hasNav, setHasNav] = useState(false);

	return (
		<>
			<Container
				fluid
				className={`container d-flex justify-content-center align-items-center ${Responsive.container}`}
			>
				<Register />
			</Container>
		</>
	);
}

export default App;
