import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";

export default function Cards() {
    const { userRoleTyps } = useContext(GeneralContext);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
            .then(res => res.json())
            .then(data => {
                // Add a clicked property to each card and initialize it to false
                const cardsWithClicked = data.map(card => ({ ...card, clicked: false }));
                setCards(cardsWithClicked);
            });
    }, []);

    function toggleCardClick(cardId) {
        // Toggle the clicked property for the specific card with cardId
        setCards(prevCards =>
            prevCards.map(card =>
                card.id === cardId ? { ...card, clicked: !card.clicked } : card
            )
        );
    }

    function addFav(cardId) {
        if (window.confirm('Are you sure you want to add this Card to your Favorites?')) {
            // Perform the favorite action for the specific card with cardId
            fetch(`https://api.shipap.co.il/cards/${cardId}/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    // Update the state for the specific card
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === cardId ? { ...card, favCard: true } : card
                        )
                    );
                });
        }
    }

    function removeFav(cardId) {
        if (window.confirm('Are you sure you want to remove this Card from your Favorites?')) {
            // Perform the unfavorite action for the specific card with cardId
            fetch(`https://api.shipap.co.il/cards/${cardId}/unfavorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    // Update the state for the specific card
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === cardId ? { ...card, favCard: false } : card
                        )
                    );
                });
        }
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
                            <p>Address: {c.city + ' ' + c.street}</p>
                            <p>Card Number:{c.id}</p>
                            <div className="btn-box">
                                {userRoleTyps === RoleTyps.user || userRoleTyps === RoleTyps.business || userRoleTyps === RoleTyps.admin ? (
                                    <>
                                        {c.favCard ? <VscHeartFilled onClick={() => removeFav(c.id)} className="fav" /> :
                                            <VscHeart onClick={() => addFav(c.id)} className={`fav ${c.clicked ? 'clicked' : ''}`} />}
                                        <button onClick={() => toggleCardClick(c.id)}>Call(?)</button>
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


///With Loacl Storage//
import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { AiOutlinePhone } from "react-icons/ai";

export default function Cards() {
    const [cards, setCards] = useState([]);
    const { userRoleTyps } = useContext(GeneralContext);

    useEffect(() => {
        // Load favorite status from localStorage when the component mounts
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};

        fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
            .then(res => res.json())
            .then(data => {
                // Initialize the favorite status for each card
                const cardsWithFavorites = data.map(card => ({
                    ...card,
                    isFavorite: savedFavorites[card.id] || false
                }));
                setCards(cardsWithFavorites);
            });
    }, []);

    function addFav(cardId) {
        if (window.confirm('Are you sure you want to add this Card to your Favorites?')) {
            fetch(`https://api.shipap.co.il/cards/${cardId}/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    // Update the favorite status for the specific card
                    setCards(prevCards => prevCards.map(card => card.id === cardId ? { ...card, isFavorite: true } : card));

                    // Update localStorage to store the favorite status
                    localStorage.setItem("favorites", JSON.stringify({ ...JSON.parse(localStorage.getItem("favorites") || "{}"), [cardId]: true }));
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
                    // Update the favorite status for the specific card
                    setCards(prevCards => prevCards.map(card => card.id === cardId ? { ...card, isFavorite: false } : card));

                    // Update localStorage to store the favorite status
                    localStorage.setItem("favorites", JSON.stringify({ ...JSON.parse(localStorage.getItem("favorites") || "{}"), [cardId]: false }));
                });
        }
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
                            <p>Address: {c.city + ' ' + c.street}</p>
                            <p>Card Number: {c.id}</p>
                            <div className="btn-box">
                                {userRoleTyps === RoleTyps.user || userRoleTyps === RoleTyps.business || userRoleTyps === RoleTyps.admin ? (
                                    <>
                                        {c.isFavorite ? (
                                            <VscHeartFilled onClick={() => removeFav(c.id)} className="fav" />
                                        ) : (
                                            <VscHeart onClick={() => addFav(c.id)} className="fav" />
                                        )}
                                        <AiOutlinePhone />
                                    </>
                                ) : (
                                    <AiOutlinePhone />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

