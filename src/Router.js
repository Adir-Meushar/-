import { Route, Routes } from 'react-router-dom';
import Login from './user/Login';
import Signup from './user/Signup';
import Account from './user/Account';
import Cards from './cards/Cards';
import MyCards from './cards/MyCards';
import FavCards from './cards/FavCards';

import About from './pages/About';
import UsersMenagment from './admin/UserMenagment';

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Cards />} />
            <Route path="/about" element={<About />} />
            <Route path="/mycards" element={<MyCards />} />
            <Route path="/favcards" element={<FavCards />} />
            <Route path="/admin" element={<UsersMenagment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
        </Routes>
    )
}