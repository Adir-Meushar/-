import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './businessPage.css'
import { GeneralContext, darkTheme } from '../App';
import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { MdLocationPin } from "react-icons/md";

export default function BusinessPage() {
    const { id } = useParams();
    const { currentTheme, setLoader } = useContext(GeneralContext)
    const [card, setCard] = useState()
    useEffect(() => {
        setLoader(true)
        fetch(`https://api.shipap.co.il/cards/${id}?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setCard(data);
                setLoader(false)
            });
    }, []);

    return (
        <>
            {card &&
                <div>
                    <div className={`page-header ${currentTheme === darkTheme ? 'page-header-dark' : ''}`}>
                        <h1 >{card.title}</h1>
                        <p>Welcome! here you can find more information about {card.title}</p>
                    </div>

                    <div className={`business-page-container ${currentTheme === darkTheme ? 'business-page-container-dark' : ''}`}>
                        <div className='business-img-box'><img className='business-img' src={card.imgUrl ? card.imgUrl : 'https://cdn-icons-png.flaticon.com/512/3014/3014694.png'} alt={card.imgAlt} /></div>
                        <div className='business-title'>
                            <h1>{card.title}</h1>
                            <h2>"{card.subtitle}"</h2>
                        </div>
                        <div className='content'>
                            <h2>About Us</h2>
                            {card.description}
                        </div>
                        <div className={`contact ${currentTheme === darkTheme ? 'contact-dark' : ''}`}>
                            <h2>Any Question?</h2>
                            <p> Feel Free To Contact Us in one of the following ways: </p>
                            <div className='contact-way-box'>
                                <AiOutlinePhone className='contact-icon' />
                                <div>
                                    <span><b>Phone: <br /> </b>{card.phone}</span>
                                </div>
                            </div>
                            <div className='contact-way-box'>
                                <AiOutlineMail className='contact-icon' />
                                <div>
                                    <span><b>Email: <br /> </b>{card.email}</span>
                                </div>
                            </div>
                            <div className='contact-way-box'>
                                <CgWebsite className='contact-icon' />
                                <div>
                                    <span><b>Website: <br /> </b>{card.web}</span>
                                </div>
                            </div>
                            <div className='contact-way-box'>
                                <MdLocationPin className='contact-icon' />
                                <div>
                                    <span><b>Address: <br /> </b>{card.street} {card.houseNumber} {card.city} {card.state}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>}
        </>
    )
}


