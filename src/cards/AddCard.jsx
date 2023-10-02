import React, { useContext, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { AiOutlinePlusCircle } from "react-icons/ai";

export const cardStructur = [
    { name: 'title', type: 'text', label: 'title', required: true, block: false },
    { name: 'description', type: 'text', label: 'description', required: true, block: false },
    { name: 'subtitle', type: 'text', label: 'subtitle', required: true, block: false },
    { name: 'phone', type: 'tel', label: 'Phone', required: true, block: false },
    { name: 'email', type: 'text', label: 'Email', required: true, block: false },
    { name: 'web', type: 'text', label: 'web', required: true, block: false, initialOnly: true },
    { name: 'imgUrl', type: 'text', label: 'Img Url', required: true, block: true },
    { name: 'imgAlt', type: 'text', label: 'Img Alt', required: true, block: false },
    { name: 'state', type: 'text', label: 'State', required: true, block: false },
    { name: 'country', type: 'text', label: 'Country', required: true, block: false },
    { name: 'city', type: 'text', label: 'City', required: true, block: false },
    { name: 'street', type: 'text', label: 'Street', required: true, block: false },
    { name: 'houseNumber', type: 'number', label: 'House Number', required: true, block: false },
    { name: 'zip', type: 'number', label: 'Zip', required: true, block: false },
];
 const initialFormData = cardStructur.reduce((obj, field) => {
    obj[field.name] = '';
    return obj;
}, {});
export default function AddCard({ added }) {
    const [ismodal, setIsModal] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const { userRoleTyps, setLoader } = useContext(GeneralContext);
    const inputChange = (ev) => {
        const { name, value } = ev.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    function addCard(ev) {
        ev.preventDefault();
        setLoader(true)
        fetch(`https://api.shipap.co.il/business/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then(res => res.json())
            .then((data) => {
                added(data)
                setLoader(false)
                setIsModal(false)
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
                            <h2> New Card</h2>
                        </header>
                        <form onSubmit={addCard}>
                            {cardStructur.map(s =>
                                <label key={s.name}>

                                    <input placeholder={s.name}
                                        type={s.type}
                                        name={s.name}
                                        value={formData.name}
                                        onChange={inputChange}
                                    />
                                </label>
                            )}
                            <button className="addBtn" >Add Card</button>
                        </form>
                    </div>
                </div>
            )}
          
                <AiOutlinePlusCircle onClick={() => setIsModal(true)} className="plusBtn" />
          
        </div>
    );
}
