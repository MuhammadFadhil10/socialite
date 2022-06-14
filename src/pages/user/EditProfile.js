import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Button, Container, Form, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import useFetchGet from '../../hook/useFetchGet';
import useFetchPostImage from '../../hook/useFetchPostImage';

const EditProfile = () => {
	document.title = 'socialite - edit profile';
	const navigate = useNavigate();
	const myUserName = localStorage.getItem('user-name');
	const [isSaving, setIsSaving] = useState(false);
	const [getEditProfileTrigger, setGetEditProfileTrigger] = useState(false);
	const [sendUpdateTrigger, setSendUpdateTrigger] = useState(false);
	const jwtToken = localStorage.getItem('user-token');

	const [thumbnail, setThumbnail] = useState('');
	const [oldImage, setOldImage] = useState('');
	const [imageValue, setImageValue] = useState('');
	const [userNameValue, setUserNameValue] = useState('');
	const [nameValue, setNameValue] = useState('');
	const [bioValue, setBioValue] = useState('');
	const [webValue, setWebValue] = useState('');

	// get profile detail
	const { data: myProfile } = useFetchGet(
		`/profile/${myUserName}`,
		getEditProfileTrigger,
		jwtToken
	);
	useEffect(() => {
		myProfile &&
			myProfile.result &&
			setThumbnail(myProfile.result.profilePicture);
		myProfile &&
			myProfile.result &&
			setOldImage(myProfile.result.profilePicture);
		myProfile &&
			myProfile.result &&
			setUserNameValue(myProfile.result.userName);
		myProfile && myProfile.result && setNameValue(myProfile.result.name);
		myProfile && myProfile.result && setBioValue(myProfile.result.bio);
		myProfile && myProfile.result && setWebValue(myProfile.result.web);
	}, [myProfile]);

	// send update profile
	const sendUpdateProfile = () => {
		setIsSaving(true);
		if (!sendUpdateTrigger) {
			setSendUpdateTrigger(true);
		} else {
			setSendUpdateTrigger(false);
		}
	};

	const { data: profileUpdated } = useFetchPostImage(
		`/profile/update/${myUserName}`,
		{
			oldImageProfile: oldImage,
			image: imageValue,
			oldUserName: myUserName,
			userName: userNameValue,
			name: nameValue,
			bio: bioValue,
			web: webValue,
		},
		sendUpdateTrigger,
		jwtToken
	);

	useEffect(() => {
		if (profileUpdated.status) {
			localStorage.setItem('user-name', profileUpdated.updatedData.userName);
			localStorage.setItem('name', profileUpdated.updatedData.name);
			localStorage.setItem(
				'profile-picture',
				profileUpdated.updatedData.profilePicture
			);
			localStorage.setItem('bio', profileUpdated.updatedData.bio);
			localStorage.setItem('web', profileUpdated.updatedData.web);
			navigate(`/${profileUpdated.updatedData.userName}`);
			if (!getEditProfileTrigger) {
				setGetEditProfileTrigger(true);
			} else {
				setGetEditProfileTrigger(false);
			}
			setIsSaving(false);
		}
	}, [profileUpdated]);

	return (
		<>
			<Navigation />
			<Container
				fluid
				className='container bg-dark d-flex flex-column align-items-center justify-content-center'
			>
				{myProfile && (
					<>
						<Image
							roundedCircle
							className='profile-picture-detail'
							src={thumbnail}
						></Image>
						<Form style={{ width: '70%' }}>
							<Form.Group>
								<Form.Label>Change profile picture</Form.Label>
								<div className='d-flex'>
									<Form.Control
										type='file'
										name='image'
										onChange={(e) => {
											console.log(e.target.files[0]);
											setImageValue(e.target.files[0]);

											setThumbnail(URL.createObjectURL(e.target.files[0]));
										}}
									></Form.Control>
									<Button
										variant='outline-danger'
										onClick={() => {
											setImageValue('delete');
											setThumbnail(
												'http://localhost:5000/public/images/default_profile/profile.png'
											);
										}}
									>
										Delete profile Picture
									</Button>
								</div>
							</Form.Group>
							<Form.Group>
								<Form.Label>Change username</Form.Label>
								<Form.Control
									type='text'
									name='userName'
									value={userNameValue}
									onChange={(e) => {
										setUserNameValue((prev) => (prev = e.target.value));
									}}
								></Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Change name</Form.Label>
								<Form.Control
									type='text'
									name='name'
									value={nameValue}
									onChange={(e) => {
										setNameValue((prev) => (prev = e.target.value));
									}}
								></Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Change bio</Form.Label>
								<Form.Control
									type='text'
									name='bio'
									value={bioValue}
									onChange={(e) => {
										setBioValue((prev) => (prev = e.target.value));
									}}
								></Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Change web</Form.Label>
								<Form.Control
									type='text'
									name='web'
									value={webValue}
									onChange={(e) => {
										setWebValue((prev) => (prev = e.target.value));
									}}
								></Form.Control>
							</Form.Group>
							<Form.Group>
								<Button
									onClick={() => {
										sendUpdateProfile();
									}}
								>
									{isSaving ? 'Saving...' : 'Save'}
								</Button>
							</Form.Group>
						</Form>
					</>
				)}
			</Container>
		</>
	);
};

export default EditProfile;
