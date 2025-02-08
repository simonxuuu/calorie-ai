import React from 'react';
import './dashboard.css';


import Nav from './components/Nav';
import Header from './components/Header';
export default function Dashboard() {

    const getDate = () =>  {
        let d = new Date();
        let utcTime = d.toUTCString();
        utcTime = new Date(utcTime);
        return {
            date : utcTime.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            time : utcTime.toLocaleTimeString('en-US',{ hour: 'numeric', minute: 'numeric'})
        }
    }

    return (
        <main> 
            <Header/>
            
            <div className="navBar">
                <div className="navInfo">
                    <h1 className="navTitle">{getDate().date}</h1>
                    <h1 className="navsubTitle">{getDate().time.split()}</h1>
                </div>
            </div>
                  

            <div className="calContainer">
                <div className="card big">
                    <div className="card-content">
                        <div className="text-container">
                            <h2 className="card-data">1244</h2>
                            <p className="card-label">Calories left</p>
                        </div>
                        <div className="progress-circle"/>
                    </div>
                </div>
            </div>

            <div className="smallCards">
                
                <div className="card small">
                    <div className="card-content">
                        <div className="text-container">
                        <h2 className="card-data">58g</h2>
                        <p className="card-label">Protein</p>
                        </div>
                        <div className="progress-circle"/>
                    </div>
                </div>
                <div className="card small">
                    <div className="card-content">
                        <div className="text-container">
                        <h2 className="card-data">58g</h2>
                        <p className="card-label">Protein</p>
                        </div>
                        <div className="progress-circle"/>
                    </div>
                </div>
                <div className="card small">
                    <div className="card-content">
                        <div className="text-container">
                        <h2 className="card-data">58g</h2>
                        <p className="card-label">Protein</p>
                        </div>
                        <div className="progress-circle"/>
                    </div>
                </div>
                <div className="card small">
                    <div className="card-content">
                        <div className="text-container">
                        <h2 className="card-data">58g</h2>
                        <p className="card-label">Protein</p>
                        </div>
                        <div className="progress-circle" style={{'--fillPercentage':`${69}%`}}/>
                    </div>
                </div>
            </div>
        

            <div className="yourSnaps">
                <h2>Your snaps</h2>
                <div className="snapCard">
                    <div className="snap-image">Image</div>
                    <div className="snap-details">
                    <h3>Diced chicken</h3>
                    <p>542 calories</p>
                    <p>11g 24g 84g</p>
                    </div>
                    <span className="snap-time">9:11 PM</span>
                    <span className="snap-status green"></span>
                </div>

                <div className="snapCard">
                    <div className="snap-image">Image</div>
                    <div className="snap-details">
                    <h3>Pizza</h3>
                    <p>992 calories</p>
                    <p>80g 10g 5g</p>
                    </div>
                    <span className="snap-time">9:11 PM</span>
                    <span className="snap-status orange"></span>
                </div>

                <div className="snapCard">
                    <div className="snap-image">Image</div>
                        <div className="snap-details">
                        <h3>Burger</h3>
                        <p>885 calories</p>
                        <p>30g 154g 40g</p>
                    </div>
                        <span className="snap-time">9:11 PM</span>
                        <span className="snap-status red"></span>
                    </div>

                <button className="viewAll">View all</button>
             </div>

             <Nav/>

                
        </main>
    )
}