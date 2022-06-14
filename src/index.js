import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProfileDetail from './pages/user/ProfileDetail';
import EditProfile from './pages/user/EditProfile';
import Message from './pages/Message';
import RoomChat from './components/chat/RoomChat';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<App />}></Route>
			<Route path='/login' element={<Login />}></Route>
			<Route path='/home' element={<Home />}></Route>
			<Route path='/explore' element={<Explore />}></Route>
			<Route path='/edit-profile/:userName' element={<EditProfile />}></Route>
			<Route path='/message' element={<Message />}></Route>
			<Route path='/:userName' element={<ProfileDetail />}></Route>
			<Route path='/chat/:userId' element={<RoomChat />}></Route>
		</Routes>
	</BrowserRouter>
);
