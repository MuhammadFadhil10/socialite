import { Modal, Button, Form, Image } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import useFetchPostImage from '../hook/useFetchPostImage';
import { useNavigate } from 'react-router-dom';
import useFetchGet from '../hook/useFetchGet';

const ModalContainer = ({
	lgShow,
	setLgShow,
	context,
	triggerGetPost,
	setTriggerGetPost,
	postValue,
}) => {
	const mount = useRef(false);
	const navigate = useNavigate();

	const [image, setImage] = useState(null);
	const [title, setTitle] = useState(null);
	const [caption, setCaption] = useState(null);

	const [newImage, setNewImage] = useState('');
	const [newTitle, setNewTitle] = useState('');
	const [newCaption, setNewCaption] = useState('');
	const [thumbnail, setThumbnail] = useState('');

	const [isLoading, setIsLoading] = useState(false);
	const [getPost, setGetPost] = useState(false);
	const [trigger, setTrigger] = useState(false);
	const [updatePostTrigger, setUpdatePostTrigger] = useState(false);

	const userId = localStorage.getItem('user-id');
	const userName = localStorage.getItem('user-name');
	const jwtToken = localStorage.getItem('user-token');

	const { data } = useFetchPostImage(
		`/post`,
		{
			userId: userId,
			userName: userName,
			image: image,
			title: title,
			caption: caption,
		},
		trigger,
		jwtToken
	);

	useEffect(() => {
		if (mount.current) {
			if (data) {
				if (data.success) {
					setIsLoading(false);
					setImage(null);
					setTitle(null);
					setCaption(null);

					//fetch get post again after posting new data || setTrigger from props from home
					!triggerGetPost ? setTriggerGetPost(true) : setTriggerGetPost(false);
					setTimeout(() => {
						setLgShow(false);
						data.success.message = '';
					}, 1500);
				}
			}
		} else {
			mount.current = true;
		}
	}, [data]);

	const sendPost = () => {
		if (trigger) {
			setIsLoading(true);
			setTrigger(false);
		} else {
			setTrigger(true);
		}
	};

	// set existing post value
	useEffect(() => {
		postValue &&
			postValue.image &&
			setThumbnail((prev) => (prev = postValue.image));
		postValue &&
			postValue.image &&
			setImage((prev) => (prev = postValue.image));
		postValue &&
			postValue.image &&
			setNewImage((prev) => (prev = postValue.image));
		postValue &&
			postValue.title &&
			setNewTitle((prev) => (prev = postValue.title));
		postValue &&
			postValue.caption &&
			setNewCaption((prev) => (prev = postValue.caption));
	}, [postValue]);

	const { data: updatingPost } = useFetchPostImage(
		`/post/update/${postValue && postValue.post_id}`,
		{
			oldImage: image,
			image: newImage,
			title: newTitle,
			caption: newCaption,
		},
		updatePostTrigger,
		jwtToken
	);

	const sendUpdatePost = () => {
		console.log(newImage);
		if (!updatePostTrigger) {
			setUpdatePostTrigger(true);
		} else {
			setUpdatePostTrigger(false);
		}
	};
	// fetch post again
	const { data: post } = useFetchGet('/posts', getPost, jwtToken);

	useEffect(() => {
		if (updatingPost) {
			if (updatingPost.status) {
				setLgShow(false);
			}
		}
	}, [updatingPost]);

	return (
		<>
			<Modal
				size='lg'
				show={lgShow}
				onHide={() => setLgShow(false)}
				aria-labelledby='example-modal-sizes-title-lg'
			>
				<Modal.Header closeButton className='bg-dark'>
					<Modal.Title id='example-modal-sizes-title-lg'>
						{context === 'edit-post' ? (
							<h1>Edit-Post</h1>
						) : (
							<h1>Create-Post</h1>
						)}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className='bg-dark'>
					<Form style={{ width: '80%', margin: 'auto' }}>
						{data.error &&
							data.error.map((msg) => {
								return <p className='text-danger'>{msg.msg}</p>;
							})}
						{data.success && (
							<p className='text-success'>{data.success.message}</p>
						)}

						<Form.Group>
							{context === 'edit-post' ? (
								<Form.Label style={{ color: '#5a5aaa' }}>
									change Image
								</Form.Label>
							) : (
								<Form.Label style={{ color: '#5a5aaa' }}>
									Image<span className='required-symbol'> *</span>
								</Form.Label>
							)}

							<Image
								src={thumbnail}
								style={{ height: '200px', width: '200px' }}
							></Image>

							<Form.Control
								type='file'
								name='image'
								onChange={(e) => {
									if (context === 'edit-post') {
										setNewImage((prev) => (prev = e.target.files[0]));
										setThumbnail(URL.createObjectURL(e.target.files[0]));
									} else {
										setImage(e.target.files[0]);
										setThumbnail(URL.createObjectURL(e.target.files[0]));
									}
								}}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label style={{ color: '#5a5aaa' }}>
								Title - (optional)
							</Form.Label>
							<Form.Control
								type='text'
								name='title'
								value={context === 'edit-post' ? newTitle : title}
								onChange={(e) => {
									context === 'edit-post'
										? setNewTitle((prev) => (prev = e.target.value))
										: setTitle(e.target.value);
								}}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label style={{ color: '#5a5aaa' }}>
								Caption - (optional)
							</Form.Label>
							<Form.Control
								type='text'
								name='caption'
								value={context === 'edit-post' ? newCaption : caption}
								onChange={(e) => {
									context === 'edit-post'
										? setNewCaption((prev) => (prev = e.target.value))
										: setCaption(e.target.value);
								}}
							/>
						</Form.Group>
						<Form.Group>
							<Button
								type='button'
								style={{ width: '100px' }}
								onClick={() => {
									context === 'edit-post' ? sendUpdatePost() : sendPost();
								}}
							>
								{isLoading
									? context === 'edit-post'
										? 'Saving...'
										: 'Uploading...'
									: context === 'edit-post'
									? 'Save'
									: 'Upload'}
							</Button>
						</Form.Group>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default ModalContainer;
