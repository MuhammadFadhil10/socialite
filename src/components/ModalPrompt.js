import openSocket from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import useFetchDelete from '../hook/useFetchDelete';
import useFetchGet from '../hook/useFetchGet';

const ModalPrompt = ({
	showPrompt,
	setShowPrompt,
	deletePostId,
	triggerGetPost,
	setTriggerGetPost,
}) => {
	const mount = useRef(false);
	const jwtToken = localStorage.getItem('user-token');
	const [deletePostTrigger, setDeletePostTrigger] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const io = openSocket(`${process.env.REACT_APP_API_URI}`);

	const { data: deletePostResult } = useFetchDelete(
		`/post/delete/${deletePostId}`,
		deletePostTrigger,
		jwtToken
	);

	useEffect(() => {
		io.on('delete', (data) => {
			if (data.action === 'delete-post') {
				!triggerGetPost ? setTriggerGetPost(true) : setTriggerGetPost(false);
			}
		});
		setMessage(deletePostResult.message);
		setIsLoading(false);
		setTimeout(() => {
			setShowPrompt(false);
		}, 900);
	}, [deletePostResult]);

	const handlePostDelete = () => {
		console.log(deletePostId);
		if (!deletePostTrigger) {
			setDeletePostTrigger(true);
		} else {
			setDeletePostTrigger(false);
		}
	};

	return (
		<>
			<Modal size='m' show={showPrompt} onHide={() => setShowPrompt(false)}>
				<Modal.Header closeButton className='bg-dark'>
					<Modal.Title>
						<h1>Delete Post?</h1>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className='bg-dark'>
					{message && <p className='text-success'>{message}</p>}
					Are you sure?
					<div className='d-flex justify-content-evenly'>
						<Button
							variant='outline-primary'
							onClick={() => {
								setIsLoading(true);
								handlePostDelete();
							}}
						>
							{isLoading ? 'Deleting...' : 'Delete'}
						</Button>
						<Button variant='danger' onClick={() => setShowPrompt(false)}>
							Cancel
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default ModalPrompt;
