import { AiOutlinePlusCircle } from "react-icons/ai";
export default function About() {
    return (
        <div>
            <div className="page-header">
                <h1>About</h1>
                <p>Welcome to CardCraft, your ultimate destination for creating eye-catching cards for businesses and attractions. Our innovative application enables you to create cards that leave a lasting impression on your customers and visitors.</p>
            </div>
            <div>
                <h3>How It Works</h3>
                <ol className="steps">
                    <li>Sign up and create a Business Type user.</li>
                    <li>Login to CardCraft with the new user.</li>
                    <li>Navigate to MyCards.</li>
                    <li>Click on the "<AiOutlinePlusCircle style={{ marginBottom: '-3px' }} />" Button at the bottom of the page.</li>
                    <li>Fill in your Business/Attraction Details and Submit.</li>
                </ol>
                <p>After following these steps, your card will be added to the main page, and you can repeat the last three steps to create new cards with your user.</p>
                <h3>Additional Information</h3>
                <ul className="steps">
                    <li>You can edit and update your card after creating it.</li>
                    <li>Only a Business Type user can create cards.</li>
                    <li>If your current user isn't a Business Type, you can create one totally free!</li>
                </ul>
            </div>
        </div>

    )
}


