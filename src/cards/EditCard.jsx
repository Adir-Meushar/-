///same as the add card!
import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { cardStructur } from "./AddCard"
import { FaRegEdit } from "react-icons/fa";

export default function EditCard({ card, cardEdited }) {
    const [formData, setFormData] = useState({});
    const [ismodal, setIsModal] = useState(false);
    const {setLoader } = useContext(GeneralContext);
    useEffect(() => {
        if (card) {
            console.log(card);
            setFormData(card);
        } else {
            setFormData({});
        }
    }, [card])
    const inputChange = (ev) => {
        const { name, value } = ev.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    function editCard(ev) {
        ev.preventDefault();
        setLoader(true)
        fetch(`https://api.shipap.co.il/business/cards/${card.id}?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then(() => {
                cardEdited(formData)
                setIsModal(false)
                setLoader(false)
               
            });
    }
    return (
        <div>
            {ismodal && (
                <div className="modal-frame">
                    <div className="modal">
                        <header>
                            <button className="close" onClick={() => setIsModal(false)}>
                                X
                            </button>
                            <h2>Edit Card</h2>
                        </header>
                        <form onSubmit={editCard}>
                            {cardStructur.map(s =>
                                <label key={s.name}>
                                    <input placeholder={s.name}
                                        type={s.type}
                                        name={s.name}
                                        value={formData[s.name]||''}
                                        onChange={inputChange}/>
                                </label>
                            )}
                            <button className="save-btn" >Save Changes</button>
                        </form>
                    </div>
                </div>
            )}
            <FaRegEdit className="card-icon" onClick={()=>setIsModal(true)}/>
        </div>
    );
}
