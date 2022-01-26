import Router from 'react';
import './about.css';
import godess from './godess.jpg'
const About = () =>{
    return (
        <div className="about">
            <div className="about-section">
                <h1>About Us</h1>
                <p>We are a couple of food lovers devoted to Gottin-sama the godess of the hungry.</p>
                <p>By all means, please search for any recipe on our home page, and register your ingredients in the inventory .</p>
            </div>


            <h2 className = "oteam">Our Team</h2>


            <div className="row">
            <div className="column">
                <div className="card">
                <img src={godess} alt="Jane" />
                <div className="container">
                    <h2>Gottin-sama</h2>
                    <p className="title">GOD</p>
                    <p>She feeds the hungry.</p>
                    <p>gottin@holy.com</p>
                    <p><button className="button">Contact</button></p>
                </div>
                </div>
            </div>
            </div>


        


        </div>


    );
}


export default About;
