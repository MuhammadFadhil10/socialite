import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useFetchPostImage = (endPoint, body, trigger, jwtToken) => {
	const didMount = useRef(false);
	const formData = new FormData();
	body.userId && formData.append('userId', body.userId);
	body.oldUserName && formData.append('oldUserName', body.oldUserName);
	body.userName && formData.append('userName', body.userName);
	body.image && formData.append('image', body.image);
	body.oldImage && formData.append('oldImage', body.oldImage);
	// body.imageUpdate && formData.append('imageUpdate', body.imageUpdate);
	body.oldImageProfile &&
		formData.append('oldImageProfile', body.oldImageProfile);
	body.imageProfile && formData.append('imageProfile', body.image);
	body.title && formData.append('title', body.title);
	body.caption && formData.append('caption', body.caption);
	body.name && formData.append('name', body.name);
	body.bio && formData.append('bio', body.bio);
	body.web && formData.append('web', body.web);
	const [data, setData] = useState({});

	useEffect(() => {
		// console.log(body.imageUpdate);
		if (didMount.current) {
			fetch(`${process.env.REACT_APP_API_URI}${endPoint}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				body: formData,
			})
				.then((res) => {
					return res.json();
				})
				.then((result) => {
					setData(result);
				});

			console.log('fetching post...');
		} else {
			didMount.current = true;
		}
	}, [trigger]);
	return { data: data };
};

export default useFetchPostImage;
