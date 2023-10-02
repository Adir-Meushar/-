import { useEffect, useState } from "react";

export default function UsersMenagment() {
    const [users,setUsers]=useState([]);
    useEffect(()=>{
        fetch(`https://api.shipap.co.il/admin/clients?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
         })
         .then(res => res.json())
         .then(data => {
             console.log(data);
             setUsers(data)
         });
    },[])
   
   return (
        <div>
            <h2>Users Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        {/* Add other table headers if needed */}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.firstName}</td>
                            <td>{user.id}</td>
                            {/* Add other table cells for user data if needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



