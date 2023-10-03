import { useContext, useEffect, useState } from "react"
import { AiOutlinePhone, AiFillDelete } from "react-icons/ai";
import { VscHeartFilled } from "react-icons/vsc";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import EditCard from "./EditCard";
export default function FavCards() {
    const [favCards, setFavCards] = useState([])
    const [editCard,setEditCard]=useState();
    const { user, snackbar, setLoader, userRoleTyps } = useContext(GeneralContext);
    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setFavCards(data)
                setLoader(false)
            });
    }, [])

    function deleteCard(id) {
        if (!window.confirm('Are you sure you want to delete this card?')) {
            return;
        } else {
            setLoader(true)
            fetch(`https://api.shipap.co.il/${userRoleTyps === RoleTyps.admin ? 'admin' : 'business'}/cards/${id}?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'DELETE',
            })
                .then(() => {
                    setFavCards(favCards.filter((c) => c.id !== id))
                    snackbar(`Card Number ${id} Was Deleted From your List`)
                    setLoader(false)
                });
        }

    }
    function removeFav(cardId) {
        if (window.confirm('Are you sure you want to remove this Card from your Favorites?')) {
            fetch(`https://api.shipap.co.il/cards/${cardId}/unfavorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    localStorage.removeItem(`favorite_${user.id}_${cardId}`);
                    setFavCards(favCards.filter((c) => c.id !== cardId));
                    snackbar(`Card Number ${cardId} Was Removed From your Favorite List`);
                }
                );
        }
    }
    function update(c){
        if(c){
            const i=favCards.findIndex((x)=>x.id==c.id);
            favCards.splice(i,1,c);
            setFavCards([...favCards])
        }
        setEditCard();
   }
    return (
        <div>
            <h2>FavCards</h2>
            <div className="container">
                {favCards.map((c) => (
                    <div key={c.id} className="card-box">
                        <div className="img-box"><img src={c.imgUrl} alt={c.imgAlt} /></div>
                        <div className="detail-box">
                            <div>
                                <h3>{c.title}</h3>
                                <p>{c.subtitle}</p>
                            </div>
                            <p>Email:{c.email}</p>
                            <p>Adress: {c.street + ' ' + c.city + ' ' + c.state}</p>
                            <p>Card Number:{c.id}</p>
                            <div className="btn-box">
                                <VscHeartFilled className="fav card-icon" onClick={() => removeFav(c.id)} />
                                <AiOutlinePhone className="card-icon" />
                                {user && (c.clientId === user.id || userRoleTyps === RoleTyps.admin) ? (
                                    <>
                                    <EditCard card={c} cardEdited={update}/> 
                                    <AiFillDelete className="card-icon" onClick={() => deleteCard(c.id)} /> 
                                    </>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}


