import React, { useContext, useEffect, useState } from "react";
import Cardiii from "./Card";
export default function FavCards({ searchQuery }) {
    const [favCards, setFavCards] = useState([])
    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setFavCards(data)
            });
    }, [])
    function updateCardInEdit(updatedCard) {
        // Find the index of the updated card in the cards state and update it
        const updatedCards = favCards.map((c) =>
          c.id === updatedCard.id ? updatedCard : c
        );
        setFavCards(updatedCards);
      }
      function deleteCardFromState(deletedCardId) {
        // Filter out the deleted card from the cards state
        const updatedCards = favCards.filter((c) => c.id !== deletedCardId);
        setFavCards(updatedCards);
      }
      function removeFavFromState(deletedCardId) {
        // Filter out the deleted card from the cards state
        const updatedCards = favCards.filter((c) => c.id !== deletedCardId);
        setFavCards(updatedCards);
      }
    const filteredCards = favCards.filter((c) =>
        c.title.toLowerCase().includes((searchQuery || '').toLowerCase())
    );
    return (
        <>
            <h2>Fav Cards</h2>
            <div className="container">
                {filteredCards.map((c) => (
                    <Cardiii c={c} 
                    cardEdited={updateCardInEdit}
                    cardDeleted={deleteCardFromState}
                    removeFromFav={removeFavFromState} />
                ))}
            </div>
        </>
    );
}



