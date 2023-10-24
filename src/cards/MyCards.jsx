import React, { useContext, useEffect, useState } from "react";
import Card from "./Card";
import AddCard from "./AddCard";
import { GeneralContext } from "../App";
import { TbCards,TbDots } from "react-icons/tb";
import { darkTheme } from "../App";
export default function MyCards({ searchQuery }) {
    const [myCards, setMyCards] = useState([])
    const { setLoader,currentTheme } = useContext(GeneralContext)
    const fetchMyCards = () => {
        setLoader(true)
        fetch(`https://api.shipap.co.il/business/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setMyCards(data);
                setLoader(false)
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
           <div className={`page-header ${currentTheme===darkTheme?'page-header-dark':''}`}>
                <h1 >My Cards</h1>
                <p>Here you can find and create your own businesses and attractions cards.</p>
            </div>
            <div className="container">
                {filteredCards.length > 0 ? filteredCards.map((c) => (
                    <Card c={c} key={c.id} cardEdited={updateCardInEdit} cardDeleted={deleteCardFromState} />
                )) :
                    <div className="empty-msg">
                        <p>You Don't Have Any Business Cards At The Moment Feel Free To Create Some </p>
                        <div className="cards-icon-box" > <TbCards className="cards-icon" /> <TbDots className="dots" /></div>
                    </div>
                }  
                </div>
            <AddCard added={() => fetchMyCards()} />
        </>
    );
}
