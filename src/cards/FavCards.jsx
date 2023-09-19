import { useEffect, useState } from "react"
import { AiOutlinePhone, AiFillDelete } from "react-icons/ai";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
export default function FavCards() {
    const [favCards, setFavCards] = useState([])
    const [favCard, setFavCard] = useState(false)
    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards/favorite?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setFavCards(data)
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
                    setFavCards(favCards.filter((c) => c.id !== id))
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
                    setFavCards(favCards.filter((c) => c.id !== cardId))
                    setFavCard(false)
                });
        }

    }
    return (
        <div>
            <h2>FavCards</h2>
            <div className="container">


                {favCards.map((c) => (
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
                                <VscHeartFilled className="fav" onClick={()=>removeFav(c.id)} />
                                <AiOutlinePhone />
                                <AiFillDelete onClick={() => deleteCard(c.id)} />
                            </div>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}


