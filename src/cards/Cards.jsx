import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { AiFillDelete, AiOutlinePhone } from "react-icons/ai";

export default function Cards() {
    const [cards, setCards] = useState([])
    const { userRoleTyps,user ,snackbar} = useContext(GeneralContext);

    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
            .then(res => res.json())
            .then(data => {
             setCards(data)
            });
    }, [])

    function addFav(cardId) {
        if (window.confirm('Are you sure you want to add this Card to your Favorites?')) {
            localStorage.setItem(`favorite_${user.id}_${cardId}`, 'true');
            fetch(`https://api.shipap.co.il/cards/${cardId}/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    snackbar(`Card Number ${cardId} Was Added To your Favorite List`)
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
                    snackbar(`Card Number ${cardId} Was Removed From your Favorite List`)
                });
        }
    }
    function deleteCard(id) {
        if (!window.confirm('Are you sure you want to delete this card?')) {
            return;
        } else {
            fetch(`https://api.shipap.co.il/${userRoleTyps===RoleTyps.admin?'admin':'business'}/cards/${id}?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'DELETE',
            })
                .then(() => {
                    setCards(cards.filter((c) => c.id !== id))
                    snackbar(`Card Number ${id} Was Deleted From your List`)
                });
        }
    }

    return (
        <>
            <h2>Cards</h2>
            <div className="container">
                {cards.map((c) => (
                    
                    <div key={c.id} className="card-box shadow-lg">
                        <div className="img-box"><img src={c.imgUrl} alt={c.imgAlt} /></div>
                        <div className="detail-box">
                            <div>
                                <h3>{c.title}</h3>
                                <p>{c.subtitle}</p>
                            </div>
                            <p>Email:{c.email}</p>
                            <p>Address: {c.street +' '+ c.city + ' ' + c.state}</p>
                            <p>Card Number: {c.id}</p>
                            <div className="btn-box">
                                {user ? (
                                    <>
                                        {localStorage.getItem(`favorite_${user.id}_${c.id}`) === 'true'? (
                                            <VscHeartFilled onClick={() => removeFav(c.id)} className="fav card-icon" />
                                        ) : (
                                            <VscHeart onClick={() => addFav(c.id)} className="fav card-icon" />
                                        )}
                                        <AiOutlinePhone className="card-icon" />
                                        {userRoleTyps===RoleTyps.admin?<AiFillDelete className="card-icon" onClick={() => deleteCard(c.id)} />:""}
                                    </>
                                ) : (
                                    <AiOutlinePhone className="card-icon" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
