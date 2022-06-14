import { useEffect, useState } from 'react';

const useFetchGet = (endpoint, triggerGet, jwtToken) => {
	const [data, setData] = useState(null);
	useEffect(() => {
		console.log('fetching get...');
		fetch(`${process.env.REACT_APP_API_URI}${endpoint}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
		})
			.then((response) => response.json())
			.then((result) => setData(result));
	}, [triggerGet]);

	return { data: data };
};

export default useFetchGet;
