import React, { useContext, useEffect, useState } from "react";
import Card from "./Card";
import AddCard from "./AddCard";
export default function MyCards({ searchQuery }) {
    const [myCards, setMyCards] = useState([])
    const fetchMyCards = () => {
        fetch(`https://api.shipap.co.il/business/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            setMyCards(data);
        });
    };

    useEffect(() => {
        fetchMyCards();
    }, []); // Fetch cards when the component mounts

    function updateCardInEdit(updatedCard) {
        // Find the index of the updated card in the cards state and update it
        const updatedCards = myCards.map((c) =>
            c.id === updatedCard.id ? updatedCard : c
        );
        setMyCards(updatedCards);
    }
    function deleteCardFromState(deletedCardId) {
        // Filter out the deleted card from the cards state
        const updatedCards = myCards.filter((c) => c.id !== deletedCardId);
        setMyCards(updatedCards);
    }
    const filteredCards = myCards.filter((c) =>
        c.title.toLowerCase().includes((searchQuery || '').toLowerCase())
    );
    return (
        <>
            <h2>My Cards</h2>
            <div className="container">
                {filteredCards.map((c) => (
                    <Card c={c} key={c.id} cardEdited={updateCardInEdit} cardDeleted={deleteCardFromState} />
                ))}
                <AddCard added={() => fetchMyCards()} />
            </div>
        </>
    );
}
