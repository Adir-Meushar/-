import React, { useContext, useEffect, useState } from "react";
import AddCard from "./AddCard";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";

export default function Cards() {
    const [cards, setCards] = useState([])
    const { userRoleTyps } = useContext(GeneralContext);

    useEffect(() => {
        fetch(`https://api.shipap.co.il/business/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setCards(data)
            });
    }, [])

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
                                <button>Fav</button>
                                <button>Call(?)</button>
                                <button onClick={() => deleteCard(c.id)}>Del</button>
                            </div>

                        </div>
                    </div>
                ))}

            </div>
        </>
    );
}
