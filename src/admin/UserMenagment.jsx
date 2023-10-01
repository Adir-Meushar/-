export default function UsersMenagment() {
    fetch(`https://api.shipap.co.il/admin/clients?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
   credentials: 'include',
})
.then(res => res.json())
.then(data => {
    console.log(data);
});
    return (
        <div>
            <h2>UsersMenagment</h2>
        </div>
    )
}


