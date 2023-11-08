import React, { useContext, useEffect, useState } from "react";
import Card from "./Card";
import { GeneralContext } from "../App";
import { TbCards, TbDots } from "react-icons/tb";
import { darkTheme } from "../App";
export default function FavCards({ searchQuery }) {
    const [favCards, setFavCards] = useState([])
   
    const { setLoader, user,currentTheme } = useContext(GeneralContext)
    useEffect(() => {
        setLoader(true)
        fetch(`https://api.shipap.co.il/cards/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setFavCards(data)
                setLoader(false)
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
        {user&&(
            <div>
               <div className={`page-header ${currentTheme===darkTheme?'page-header-dark':''}`}>
              <h1 >Favorite Cards</h1>
              <p>Here you will find All your favorite cards.</p>
          </div>
          <div className="container">
              {filteredCards.length > 0 ? filteredCards.map((c) => (
                  (
                      <Card
                          c={c}
                          key={c.id}
                          cardEdited={updateCardInEdit}
                          cardDeleted={deleteCardFromState}
                          removeFromFav={removeFavFromState}
                      />
                  ) 
              )) : 
                  <div className={`empty-msg empty-msg-fav ${currentTheme===darkTheme?'empty-msg-dark':''}`}>
                      <p>You Don't Have Any Favorite Cards At The Moment Feel Free To Add Some</p>
                      <div className="cards-icon-box">
                          <TbCards className="cards-icon" /> <TbDots className="dots" />
                      </div>
                  </div>
              }
          </div>
          </div>
        )}

        </>
    );
}


