import { Container, Row, Form, Button, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../global.css';
import React, { useEffect, useState, useRef } from 'react';
import useFetchPost from '../../hook/useFetchPost';

const Login = () => {
	document.title = 'Login';
	const location = useLocation();
	const navigate = useNavigate();
	const mount = useRef(false);

	const [trigger, setTrigger] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const { data } = useFetchPost(
		'/login',
		{
			userName: userName,
			password: password,
		},
		trigger
	);
	// check data fetch result after data result available :D
	useEffect(() => {
		if (mount.current) {
			if (data.success) {
				setIsLoading(false);
				localStorage.setItem('user-token', data.success.token);
				localStorage.setItem('user-id', data.success.userId);
				localStorage.setItem('user-email', data.success.email);
				localStorage.setItem('user-name', data.success.userName);
				localStorage.setItem('name', data.success.name);
				localStorage.setItem('profile-picture', data.success.profilePicture);
				localStorage.setItem('bio', data.success.bio);
				localStorage.setItem('web', data.success.web);
				navigate('/home');
			} else {
				setIsLoading(false);
				navigate('/login');
			}
		} else {
			mount.current = true;
		}
	}, [data]);
	const postLogin = () => {
		setIsLoading(true);
		if (trigger === false) {
			setTrigger(true);
		} else {
			setTrigger(false);
		}
	};

	return (
		<>
			<Container className='container d-flex flex-column justify-content-center align-items-center'>
				{location.state && (
					<Alert variant='success'>
						<Alert.Heading>{location.state.succes.message}</Alert.Heading>
						You can login now. Also check your email's inbox!
					</Alert>
				)}
				<h1>Lets get in!</h1>
				<Form>
					{data.error &&
						data.error
							.filter(
								(err) => err.param == 'userName' || err.param == 'password'
							)
							.map((msg) => {
								return (
									<Form.Text className='error-message'>
										{msg.msg}
										<br />
									</Form.Text>
								);
							})}
					<Form.Group>
						<Form.Label>
							Username<span className='required-symbol'> *</span>
						</Form.Label>
						<Form.Control
							type='text'
							className={data.error ? 'form-error' : ''}
							name='userName'
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>
							Password<span className='required-symbol'> *</span>
						</Form.Label>
						<Form.Control
							type='password'
							className={data.error ? 'form-error' : ''}
							name='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>
					<Form.Group>
						<Button type='button' onClick={() => postLogin()}>
							{isLoading ? 'Loading...' : 'Login'}
						</Button>
					</Form.Group>
					<Link to='/'>Don't have account? Register here</Link>
				</Form>
			</Container>
		</>
	);
};

export default Login;
