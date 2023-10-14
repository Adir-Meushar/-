import { Route, Routes } from 'react-router-dom';
import Login from './user/Login';
import Signup from './user/Signup';
import Account from './user/Account';
import Cards from './cards/Cards';
import MyCards from './cards/MyCards';
import FavCards from './cards/FavCards';
import About from './pages/About';
import UsersManagement from './admin/UsersManagement';
import BussinessPage from './pages/BusinessPage';

export default function Router({query}) {
    return (
        <Routes>
            <Route path="/" element={<Cards searchQuery={query}/>} />
            <Route path="/about" element={<About />} />
            <Route path="/mycards" element={<MyCards searchQuery={query}/>} />
            <Route path="/favcards" element={<FavCards searchQuery={query} />} />
            <Route path="/admin" element={<UsersManagement />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
            <Route path='/bussiness' element ={<BussinessPage/>}/>
        </Routes>
    )
}