import { AiOutlinePlusCircle } from "react-icons/ai";
import './about.css'
import { useContext } from "react";
import { GeneralContext } from "../App";
import { darkTheme } from "../App";
import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
export default function About() {
    const { currentTheme } = useContext(GeneralContext)
    return (
        <div className={`about-container ${currentTheme === darkTheme ? 'dark-mode' : 'light-mode'}`}>
            <div className="page-header">
                <h1>About</h1>
                <p>Welcome to CardCraft, your ultimate destination for creating eye-catching cards for businesses and attractions. Our innovative application enables you to create cards that leave a lasting impression on your customers and visitors.</p>
            </div>
            <div className="about-box">
                <h3>How It Works</h3>
                <ol className="steps">
                    <li>Sign up and create a Business Type user.</li>
                    <li>Login to CardCraft with the new user.</li>
                    <li>Navigate to MyCards.</li>
                    <li>Click on the "<AiOutlinePlusCircle style={{ marginBottom: '-3px' }} />" button at the top/bottom of the page (depending on your device).</li>
                    <li>Fill in your Business/Attraction Details and Submit.</li>
                </ol>
                <p>After following these steps, your card will be added to the main page, and you can repeat the last three steps to create new cards with your user.</p>
                <br />
                <h3>Additional Information</h3>
                <ul className="steps">
                    <li>You can edit and update your card after creating it.</li>
                    <li>Only a Business Type user can create cards.</li>
                    <li>If your current user isn't a Business Type, you can contact the admin with the Information below 
                        or create a new one totally free!</li>
                </ul>
                <br />
                <p>If you have any further question feel free to contact 😀</p>
                <br />
                <h3>Contact Information</h3>
                <div className='contact-way-box'>
                    <AiOutlinePhone className='contact-icon' />
                    <div>
                        <span><b>Phone: <br /> </b>0555664959</span>
                    </div>
                </div>
                <div className='contact-way-box'>
                    <AiOutlineMail className='contact-icon' />
                    <div>
                        <span><b>Email: <br /> </b> cardcraft@gmail.com</span>
                    </div>
                </div>
            
            </div>
        </div>

    )
}


