import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { VscHeart } from "react-icons/vsc";

export default function Cards() {
    const [cards, setCards] = useState([])
    const { userRoleTyps } = useContext(GeneralContext);
   

    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
            .then(res => res.json())
            .then(data => {
                setCards(data)
            });
    }, [])
    
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
                                      <VscHeart className="fav"/>
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


