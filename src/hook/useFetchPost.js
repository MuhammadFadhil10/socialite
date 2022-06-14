import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useFetchPost = (endPoint, body, trigger, jwtToken) => {
	const didMount = useRef(false);

	const [data, setData] = useState({});

	useEffect(() => {
		if (didMount.current) {
			fetch(`${process.env.REACT_APP_API_URI}${endPoint}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				body: body ? JSON.stringify(body) : body,
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

export default useFetchPost;
