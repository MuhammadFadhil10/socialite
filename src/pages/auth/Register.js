import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useSpring, animated, config } from 'react-spring';

import useFetchPost from '../../hook/useFetchPost';
import '../../global.css';
import Responsive from '../../responsive.module.css';

const Register = () => {
	document.title = 'SociaLite';
	const navigate = useNavigate();
	const mount = useRef(false);
	const [trigger, setTrigger] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [flip, set] = useState(true);
	const words = [
		'uniqueness',
		'skills',
		'idea',
		'moment',
		'happiness',
		'coolside',
	];

	const [userName, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { data } = useFetchPost(
		'/create-account',
		{
			userName: userName,
			email: email,
			password: password,
			confirmPassword: confirmPassword,
		},
		trigger
	);

	// check data fetch result after data result available :D
	useEffect(() => {
		if (mount.current) {
			if (data.succes) {
				setIsLoading(false);
				navigate('/login', { state: data });
			} else {
				console.log(data);
				setIsLoading(false);
				navigate('/');
			}
		} else {
			mount.current = true;
		}
	}, [data]);

	const postRegister = () => {
		setIsLoading(true);
		if (trigger === false) {
			setTrigger(true);
		} else {
			setTrigger(false);
		}
	};

	// react-spring
	const { scroll } = useSpring({
		scroll: (words.length - 1) * 50,
		from: { scroll: 0 },
		reset: true,
		reverse: flip,
		delay: 1000,
		config: config.molasses,
		onRest: () => set(!flip),
	});

	return (
		<>
			<div className={`d-flex ${Responsive.registerContainer}`}>
				<h1 className='w-100'>
					Discover your
					<span>
						<animated.div
							style={{
								position: 'relative',
								width: '100%',
								height: 50,
								overflow: 'hidden',
								fontSize: '0.5em',
							}}
							scrollTop={scroll}
						>
							{words.map((word, i) => (
								<h1
									className='text-light'
									key={`${word}_${i}`}
									style={{ width: '100%', height: 50, textAlign: 'center' }}
								>
									{word}
								</h1>
							))}
						</animated.div>
					</span>
				</h1>
			</div>
			<Form>
				<h1>Create Account</h1>
				<Form.Group>
					<Form.Label>
						User Name<span className='required-symbol'> *</span>
					</Form.Label>
					<Form.Control
						type='text'
						name='userName'
						value={userName}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						placeholder='cool_username123'
					/>
					<Form.Text className='text-muted'>
						{/* {!data.error && `This username will be your account identity.`} */}
						{data.error &&
							data.error
								.filter((err) => err.param == 'userName')
								.map((msg) => {
									return <div className='error-message'>{msg.msg}</div>;
								})}
					</Form.Text>
				</Form.Group>
				<Form.Group>
					<Form.Label>
						Email<span className='required-symbol'> *</span>
					</Form.Label>
					<Form.Control
						type='email'
						name='email'
						id='emailRegister'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='myemail@gmail.com'
					/>
					{data.error &&
						data.error
							.filter((err) => err.param == 'email')
							.map((msg) => {
								return (
									<Form.Text className='error-message'>
										{msg.msg}
										<br />
									</Form.Text>
								);
							})}
				</Form.Group>
				<Form.Group>
					<Form.Label>
						Password<span className='required-symbol'> *</span>
					</Form.Label>
					<Form.Control
						type='password'
						name='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						id='passwordRegister'
					/>
					{data.error &&
						data.error
							.filter((err) => err.param == 'password')
							.map((msg) => {
								return (
									<Form.Text className='error-message'>
										{msg.msg}
										<br />
									</Form.Text>
								);
							})}
				</Form.Group>
				<Form.Group>
					<Form.Label>
						Confirm Password<span className='required-symbol'> *</span>
					</Form.Label>
					<Form.Control
						type='password'
						name='confirmPassword'
						id='confirmPasswordRegister'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					{data.error &&
						data.error
							.filter((err) => err.param == 'confirmPassword')
							.map((msg) => {
								return (
									<Form.Text className='error-message'>
										{msg.msg}
										<br />
									</Form.Text>
								);
							})}
				</Form.Group>
				<Form.Group className='mb-3' controlId='formBasicCheckbox'>
					<Form.Check
						type='checkbox'
						label='I agree to terms and condition'
						name='signupAgreement'
					/>
				</Form.Group>
				<Form.Group>
					<Button type='button' onClick={() => postRegister()}>
						{isLoading ? 'Loading...' : 'Register'}
					</Button>
				</Form.Group>
				<Link to='/login'>Have account? Login here</Link>
			</Form>
		</>
	);
};

export default Register;
