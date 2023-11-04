import { useContext, useEffect, useState,useRef  } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import './usersManagement.css'
import { GeneralContext, darkTheme } from "../App";
import UsersEditAdmin from './UsersEditAdmin';

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [isEditUser,setIsEditUser]=useState(null);
    const { snackbar,currentTheme,setLoader } = useContext(GeneralContext)
    const usersRef = useRef(users);
    useEffect(() => {
        setLoader(true)
        fetch(`https://api.shipap.co.il/admin/clients?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data)
                usersRef.current = data;
                setLoader(false)
            });
    }, [])

    function deleteUser(userId) {
        if (!window.confirm(`Are you sure you want to delete this user?`)) {
            return;
        } else {
            fetch(`https://api.shipap.co.il/admin/clients/${userId}?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'DELETE',
            })
                .then(() => {
                    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                    snackbar(`User Number ${userId} Was Deleted Succesfully!`)
                });
        }
    }
    function closeUserEdit() {
        setIsEditUser(null);
      }
      const updateUserState = (updatedUser) => {
        // Create a new users array with the updated user
        const updatedUsers = usersRef.current.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
        );

        // Update both the state and the ref
        setUsers(updatedUsers);
        usersRef.current = updatedUsers;
    };
    return (
        <div >
            <div className={`page-header ${currentTheme===darkTheme?'page-header-dark':''}`}>
            <h1 >Users Management</h1>
            </div>
            <table className="users-table">
                <thead>
                    <tr style={{ color: currentTheme === darkTheme ? 'black' : '' }}>
                        <th>X</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Business</th>
                        <th>Edit User</th>
                        <th>Delete User</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.firstName + ' ' + user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.business === true ? 'Yes' : 'No'}</td>
                            <td >< FaRegEdit className="fa-edit"  onClick={() => setIsEditUser(user)} /></td>
                            <td ><AiFillDelete onClick={() => deleteUser(user.id)} className="ai-delete" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEditUser&&<UsersEditAdmin usersDetails={isEditUser} closeUserEdit={closeUserEdit}  updateUserState={updateUserState}/>}
        </div>
    );
}



