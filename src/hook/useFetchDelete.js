import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useFetchDelete = (endPoint, trigger, jwtToken) => {
	const didMount = useRef(false);

	const [data, setData] = useState({});

	useEffect(() => {
		if (didMount.current) {
			fetch(`${process.env.REACT_APP_API_URI}${endPoint}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			})
				.then((res) => {
					return res.json();
				})
				.then((result) => {
					setData(result);
				});

			console.log('fetching delete...');
		} else {
			didMount.current = true;
		}
	}, [trigger]);
	return { data: data };
};

export default useFetchDelete;
