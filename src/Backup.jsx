import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";

export default function Cards() {
    const { userRoleTyps } = useContext(GeneralContext);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
            .then(res => res.json())
            .then(data => {
                // Add a clicked property to each card and initialize it to false
                const cardsWithClicked = data.map(card => ({ ...card, clicked: false }));
                setCards(cardsWithClicked);
            });
    }, []);

    function toggleCardClick(cardId) {
        // Toggle the clicked property for the specific card with cardId
        setCards(prevCards =>
            prevCards.map(card =>
                card.id === cardId ? { ...card, clicked: !card.clicked } : card
            )
        );
    }

    function addFav(cardId) {
        if (window.confirm('Are you sure you want to add this Card to your Favorites?')) {
            // Perform the favorite action for the specific card with cardId
            fetch(`https://api.shipap.co.il/cards/${cardId}/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    // Update the state for the specific card
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === cardId ? { ...card, favCard: true } : card
                        )
                    );
                });
        }
    }

    function removeFav(cardId) {
        if (window.confirm('Are you sure you want to remove this Card from your Favorites?')) {
            // Perform the unfavorite action for the specific card with cardId
            fetch(`https://api.shipap.co.il/cards/${cardId}/unfavorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    // Update the state for the specific card
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === cardId ? { ...card, favCard: false } : card
                        )
                    );
                });
        }
    }

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
                            <p>Address: {c.city + ' ' + c.street}</p>
                            <p>Card Number:{c.id}</p>
                            <div className="btn-box">
                                {userRoleTyps === RoleTyps.user || userRoleTyps === RoleTyps.business || userRoleTyps === RoleTyps.admin ? (
                                    <>
                                        {c.favCard ? <VscHeartFilled onClick={() => removeFav(c.id)} className="fav" /> :
                                            <VscHeart onClick={() => addFav(c.id)} className={`fav ${c.clicked ? 'clicked' : ''}`} />}
                                        <button onClick={() => toggleCardClick(c.id)}>Call(?)</button>
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


///With Loacl Storage//
import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { AiOutlinePhone } from "react-icons/ai";

export default function Cards() {
    const [cards, setCards] = useState([]);
    const { userRoleTyps } = useContext(GeneralContext);

    useEffect(() => {
        // Load favorite status from localStorage when the component mounts
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};

        fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
            .then(res => res.json())
            .then(data => {
                // Initialize the favorite status for each card
                const cardsWithFavorites = data.map(card => ({
                    ...card,
                    isFavorite: savedFavorites[card.id] || false
                }));
                setCards(cardsWithFavorites);
            });
    }, []);

    function addFav(cardId) {
        if (window.confirm('Are you sure you want to add this Card to your Favorites?')) {
            fetch(`https://api.shipap.co.il/cards/${cardId}/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    // Update the favorite status for the specific card
                    setCards(prevCards => prevCards.map(card => card.id === cardId ? { ...card, isFavorite: true } : card));

                    // Update localStorage to store the favorite status
                    localStorage.setItem("favorites", JSON.stringify({ ...JSON.parse(localStorage.getItem("favorites") || "{}"), [cardId]: true }));
                });
        }
    }

    function removeFav(cardId) {
        if (window.confirm('Are you sure you want to remove this Card from your Favorites?')) {
            fetch(`https://api.shipap.co.il/cards/${cardId}/unfavorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    // Update the favorite status for the specific card
                    setCards(prevCards => prevCards.map(card => card.id === cardId ? { ...card, isFavorite: false } : card));

                    // Update localStorage to store the favorite status
                    localStorage.setItem("favorites", JSON.stringify({ ...JSON.parse(localStorage.getItem("favorites") || "{}"), [cardId]: false }));
                });
        }
    }

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
                            <p>Address: {c.city + ' ' + c.street}</p>
                            <p>Card Number: {c.id}</p>
                            <div className="btn-box">
                                {userRoleTyps === RoleTyps.user || userRoleTyps === RoleTyps.business || userRoleTyps === RoleTyps.admin ? (
                                    <>
                                        {c.isFavorite ? (
                                            <VscHeartFilled onClick={() => removeFav(c.id)} className="fav" />
                                        ) : (
                                            <VscHeart onClick={() => addFav(c.id)} className="fav" />
                                        )}
                                        <AiOutlinePhone />
                                    </>
                                ) : (
                                    <AiOutlinePhone />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


///fav-with-local//
import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { AiOutlinePhone } from "react-icons/ai";

export default function Cards() {
    const [cards, setCards] = useState([]);
    const { userRoleTyps } = useContext(GeneralContext);

    // Initialize cards from local storage or API data
    useEffect(() => {
        // Check if there are cards in local storage
        const storedCards = JSON.parse(localStorage.getItem("favoriteCards")) || [];

        // Fetch cards from the API if local storage is empty
        if (storedCards.length === 0) {
            fetch(`https://api.shipap.co.il/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`)
                .then((res) => res.json())
                .then((data) => {
                    // Initialize the favorite status for each card
                    const cardsWithFavorites = data.map((card) => ({
                        ...card,
                        isFavorite: false,
                    }));
                    setCards(cardsWithFavorites);
                });
        } else {
            // Set cards from local storage
            setCards(storedCards);
        }
    }, []);

    // Function to update favorite status and local storage
    function updateFavoriteStatus(cardId, isFavorite) {
        // Update the favorite status for the specific card
        const updatedCards = cards.map((card) =>
            card.id === cardId ? { ...card, isFavorite } : card
        );

        // Update local storage
        localStorage.setItem("favoriteCards", JSON.stringify(updatedCards));

        // Update state
        setCards(updatedCards);
    }

    function addFav(cardId) {
        if (window.confirm("Are you sure you want to add this Card to your Favorites?")) {
            fetch(`https://api.shipap.co.il/cards/${cardId}/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: "include",
                method: "PUT",
            })
                .then(() => {
                    updateFavoriteStatus(cardId, true);
                });
        }
    }

    function removeFav(cardId) {
        if (window.confirm("Are you sure you want to remove this Card from your Favorites?")) {
            fetch(`https://api.shipap.co.il/cards/${cardId}/unfavorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
                credentials: "include",
                method: "PUT",
            })
                .then(() => {
                    updateFavoriteStatus(cardId, false);
                });
        }
    }


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
                            <p>Address: {c.city + ' ' + c.street}</p>
                            <p>Card Number: {c.id}</p>
                            <div className="btn-box">
                                {userRoleTyps === RoleTyps.user || userRoleTyps === RoleTyps.business || userRoleTyps === RoleTyps.admin ? (
                                    <>
                                        {c.isFavorite ? (
                                            <VscHeartFilled onClick={() => removeFav(c.id)} className="fav card-icon" />
                                        ) : (
                                            <VscHeart onClick={() => addFav(c.id)} className="fav card-icon" />
                                        )}
                                        <AiOutlinePhone className="card-icon" />
                                    </>
                                ) : (
                                    <AiOutlinePhone className="card-icon" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

<div>
<h2>FavCards</h2>
<div className="container">
    {favCards.map((c) => {
        if (c.id === undefined) {
            return null; // Skip rendering when c.id is undefined
        }

        return (
            <div key={c.id} className="card-box">
                <div className="img-box"><img src={c.imgUrl} alt={c.imgAlt} /></div>
                <div className="detail-box">
                    <div>
                        <h3>{c.title}</h3>
                        <p>{c.subtitle}</p>
                    </div>
                    <p>Email:{c.email}</p>
                    <p>Address: {c.street + ' ' + c.city + ' ' + c.state}</p>
                    <p>Card Number:{c.id}</p>
                    <div className="btn-box">
                        <VscHeartFilled className="fav card-icon" onClick={() => removeFav(c.id)} />
                        <AiOutlinePhone className="card-icon" />
                        {c.clientId === user.id || userRoleTyps === RoleTyps.admin ? (
                            <AiFillDelete className="card-icon" onClick={() => deleteCard(c.id)} />
                        ) : null}
                    </div>
                </div>
            </div>
        );
    })}

</div>
</div>

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
                {cardStructur.map((s) => {
                    if (s.name === 'description') {
                        return (
                            <textarea
                                key={s.name}
                                name={s.name}
                                placeholder={s.name}
                                id={s.name}
                                cols="30"
                                rows="10"
                                onChange={handleValid}
                                helperText={errors[s.name]} 
                                style={{ resize: 'none' }}
                            ></textarea>
                        );
                    } else {
                        return (
                            <label key={s.name}>
                                <input
                                    placeholder={s.name}
                                    type={s.type}
                                    name={s.name}
                                    value={formData[s.name]} // Use formData[s.name] to get the value dynamically
                                    onChange={handleValid}
                                    helperText={errors[s.name]} 
                                />
                            </label>
                        );
                    }
                })}
                {/* Add a submit button here */}
                <button type="submit" className="save-btn" disabled={!isFormValid}>Submit</button>
            </form>

        </div>
    </div>
)}


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
<>
          <div className="page-header">
                <h1 >Favorite Cards</h1>
                <p>Here you will find All your favorite cards.</p>
            </div>
            <div className="container">
                {filteredCards.length > 0 ? filteredCards.map((c) => (
                    localStorage.getItem(`favorite_${user.id}_${c.id}`) === 'true' ? (
                        <Card
                            c={c}
                            key={c.id}
                            cardEdited={updateCardInEdit}
                            cardDeleted={deleteCardFromState}
                            removeFromFav={removeFavFromState}
                        />
                    ) : null
                )) : (
                    <div className="empty-msg">
                        <p>You Don't Have Any Favorite Cards At The Moment Feel Free To Add Some</p>
                        <div className="cards-icon-box">
                            <TbCards className="cards-icon" /> <TbDots className="dots" />
                        </div>
                    </div>
                )}
            </div>

        </>


// fixed local storage clear but empty msg wont apper for other users
{user && (
    <div>
        <div className="page-header">
            <h1 >Favorite Cards</h1>
            <p>Here you will find All your favorite cards.</p>
        </div>
        <div className="container">
            {filteredCards.length > 0 &&localStorage.length ? filteredCards.map((c) => (
                localStorage.getItem(`favorite_${user.id}_${c.id}`) === 'true' ? (
                    <Card
                        c={c}
                        key={c.id}
                        cardEdited={updateCardInEdit}
                        cardDeleted={deleteCardFromState}
                        removeFromFav={removeFavFromState}
                    />
                ) : ''
            ))
                : (
                    <div className="empty-msg">
                        <p>You Don't Have Any Favorite Cards At The Moment Feel Free To Add Some</p>
                        <div className="cards-icon-box">
                            <TbCards className="cards-icon" /> <TbDots className="dots" />
                        </div>
                    </div>
                )}
        </div>
    </div>
)}