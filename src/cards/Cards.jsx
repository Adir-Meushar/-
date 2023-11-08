import React, { useContext, useEffect, useState } from "react";
import Card from "./Card";
import { GeneralContext } from "../App";
import { darkTheme } from "../App";
import { TbCards,TbDots } from "react-icons/tb";
export default function Cards({ searchQuery }) {
    const { currentTheme,setLoader } = useContext(GeneralContext);
    const [cards, setCards] = useState([])
    useEffect(() => {
        setLoader(true)
        fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
            .then(res => res.json())
            .then(data => {
                setCards(data)
                setLoader(false)
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
            <div className={`page-header ${currentTheme === darkTheme ? 'page-header-dark' : ''}`}>
                <h1>Business Cards</h1>
                <p>Welcome! Here you can find cards of various businesses and attractions.</p>
            </div>

            <div className="container">
                {filteredCards.length > 0 ? (
                    filteredCards.map((c) => (
                        <Card c={c} key={c.id} cardEdited={updateCardInEdit} cardDeleted={deleteCardFromState} />
                    ))
                ) : (
                    <div className={`empty-msg ${currentTheme===darkTheme?'empty-msg-dark':''}`}>
                        <p style={{textAlign:'center'}}>No cards matched your search...</p>
                        <div className="cards-icon-box">
                            <TbCards className="cards-icon" /> <TbDots className="dots" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
