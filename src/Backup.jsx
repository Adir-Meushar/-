import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";

export default function Cards() {
    const [cards, setCards] = useState([]);
    const [favorites, setFavorites] = useState(new Set()); // Use a Set to store favorite card IDs
    const { userRoleTyps } = useContext(GeneralContext);

    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
            .then(res => res.json())
            .then(data => {
                setCards(data);
            });
    }, []);

    function addToFav(cardId) {
        // Update the set of favorites with the new card ID
        setFavorites(prevFavorites => new Set([...prevFavorites, cardId]));

        fetch(`https://api.shipap.co.il/cards/${cardId}/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'PUT',
         })
         .then(() => {
             
         });
    }

    function removeFromFav(cardId) {
        // Remove the card ID from the set of favorites
        setFavorites(prevFavorites => {
            const updatedFavorites = new Set(prevFavorites);
            updatedFavorites.delete(cardId);
            return updatedFavorites;
        });

        // You can also send a request to the server here if needed
    }

    return (
        <>
            <h2>Cards</h2>
            <div className="container">
                {cards.map((c) => (
                    <div key={c.id} className="card-box">
                        <div className="img-box"><img src={c.imgUrl} alt={c.imgAlt} /></div>
                        <div className="detail-box">
                            <div>
                                <h3>{c.title}</h3>
                                <p>{c.description}</p>
                            </div>
                            <p>{c.phone}</p>
                            <p>Adress: {c.city + ' ' + c.street}</p>
                            <p>Card Number:{c.id}</p>
                            <div className="btn-box">
                                {userRoleTyps === RoleTyps.user || userRoleTyps === RoleTyps.business || userRoleTyps === RoleTyps.admin ? (
                                    <>
                                        {favorites.has(c.id) ? (
                                            <VscHeartFilled className="fav" onClick={() => removeFromFav(c.id)} />
                                        ) : (
                                            <VscHeart className="fav" onClick={() => addToFav(c.id)} />
                                        )}
                                        <button>Call(?)</button>
                                    </>
                                ) : (
                                    <button>Call(?)</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

