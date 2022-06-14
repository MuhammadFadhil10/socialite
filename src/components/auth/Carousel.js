import '../../global.css';
import { Carousel } from 'react-bootstrap';
import React, { useState } from 'react';
import firstSlide from '../../assets/carousel/first-carousel.jpg';
import secondSlide from '../../assets/carousel/second-carousel.jpg';
import thirdSlide from '../../assets/carousel/third-carousel.jpg';

const ControlledCarousel = () => {
	const pStyle = { color: '#4a85df' };
	const [index, setIndex] = useState(0);

	const handleSelect = (selectedIndex, e) => {
		setIndex(selectedIndex);
	};

	return (
		<Carousel fade activeIndex={index} onSelect={handleSelect}>
			<Carousel.Item>
				<img
					className='d-block w-100 carousel-img'
					src={firstSlide}
					alt='First slide'
				/>
				<Carousel.Caption>
					<h3>First slide label</h3>
					<p style={pStyle}>
						Nulla vitae elit libero, a pharetra augue mollis interdum.
					</p>
				</Carousel.Caption>
			</Carousel.Item>
			<Carousel.Item>
				<img
					className='d-block w-100 carousel-img'
					src={secondSlide}
					alt='Second slide'
				/>

				<Carousel.Caption>
					<h3>Second slide label</h3>
					<p style={pStyle}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
				</Carousel.Caption>
			</Carousel.Item>
			<Carousel.Item>
				<img
					className='d-block w-100 carousel-img'
					src={thirdSlide}
					alt='Third slide'
				/>

				<Carousel.Caption>
					<h3>Third slide label</h3>
					<p style={pStyle}>
						Praesent commodo cursus magna, vel scelerisque nisl consectetur.
					</p>
				</Carousel.Caption>
			</Carousel.Item>
		</Carousel>
	);
};

export default ControlledCarousel;
