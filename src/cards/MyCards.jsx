import React, { useContext, useEffect, useState } from "react";
import AddCard from "./AddCard";
import { AiOutlinePhone, AiFillDelete } from "react-icons/ai";
import { VscHeartFilled,VscHeart } from "react-icons/vsc";
import { GeneralContext } from "../App";
export default function MyCards() {
    const [cards, setCards] = useState([])
    const { user,snackbar,setLoader } = useContext(GeneralContext);
    useEffect(() => {
        fetch(`https://api.shipap.co.il/business/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setCards(data)
                setLoader(false)
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
                    // Update the favorite status for the specific card
                    setCards(prevCards => prevCards.map(card => card.id === cardId ? { ...card, isFavorite: true } : card));
                    snackbar(`Card Number ${cardId} Was Added To your Favorite List`)
                });
        }
    }
    function deleteCard(id) {
        if (!window.confirm('Are you sure you want to delete this card?')) {
            return;
        } else {
            fetch(`https://api.shipap.co.il/business/cards/${id}?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'DELETE',
            })
                .then(() => {
                    setCards(cards.filter((c) => c.id !== id))
                    snackbar(`Card Number ${id} Was Deleted From your List`)
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
                    setCards(prevCards => prevCards.map(card => card.id === cardId ? { ...card, isFavorite: false } : card));
                    snackbar(`Card Number ${cardId} Was Removed From your Favorite List`)
                });
        }
    }
    return (
        <>
            <h2>My Cards</h2>
            <AddCard added={(newCard) => setCards([...cards, newCard])} />
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
                                {localStorage.getItem(`favorite_${user.id}_${c.id}`) ? (
                                    <VscHeartFilled onClick={() => removeFav(c.id)} className="fav card-icon" />
                                ) : (
                                    <VscHeart onClick={() => addFav(c.id)} className="fav card-icon" />
                                )}
                                <AiOutlinePhone className="card-icon" />
                                <AiFillDelete className="card-icon" onClick={() => deleteCard(c.id)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
