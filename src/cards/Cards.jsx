import React, { useContext, useEffect, useState } from "react";
import Cardiii from "./Card";
export default function Cards({ searchQuery }) {
    const [cards, setCards] = useState([])
    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
            .then(res => res.json())
            .then(data => {
                setCards(data)
            });
    }, [])
    function updateCardInEdit(updatedCard) {
        // Find the index of the updated card in the cards state and update it
        const updatedCards = cards.map((c) =>
          c.id === updatedCard.id ? updatedCard : c
        );
        setCards(updatedCards);
      }
      function deleteCardFromState(deletedCardId) {
        // Filter out the deleted card from the cards state
        const updatedCards = cards.filter((c) => c.id !== deletedCardId);
        setCards(updatedCards);
      }
   const filteredCards = cards.filter((c) =>
   c.title.toLowerCase().includes(searchQuery.toLowerCase())

 );
    return (
        <>
            <h2>Cards</h2>
            <div className="container">
                {filteredCards.map((c) => (
                    <Cardiii c={c} cardEdited={updateCardInEdit} cardDeleted={deleteCardFromState}/>
                ))}
            </div>
        </>
    );
}
