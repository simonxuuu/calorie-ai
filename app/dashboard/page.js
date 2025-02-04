import React from 'react';
import './dashboard.css';

export default function Dashboard() {
    return (
        <main> 
            <div className="topBar">   
                <h1 className="snappitLogo">Snappit</h1>
                <div className="topButtons">
                    <button className="iconNav">Settings</button>
                    <button className="iconNav">Inbox</button>
                </div>
            </div>
            
            <div className="navBar">
                <div className="navInfo">
                    <h1 className="navTitle">Date</h1>
                    <h1 className="navsubTitle">Time</h1>
                </div>
            </div>
                  

            <div className="calContainer">
                <div className="card big">
                    <div className="card-content">
                        <div className="text-container">
                            <h2 className="calories-count">1244</h2>
                            <p className="calories-label">Calories left</p>
                        </div>
                        <div className="progress-circle">
                            Circle
                        </div>
                    </div>
                </div>
            </div>

            <div className="smallCards">
                
                <div className="card small">
                    <div className="card-content">
                        <div className="text-container">
                        <h2 className="calories-count">58g</h2>
                        <p className="calories-label">Protein</p>
                        </div>
                        <div className="progress-circle">
                            Circle
                        </div>
                    </div>
                </div>
                <div className="card small">
                    <div className="card-content">
                        <div className="text-container">
                        <h2 className="calories-count">58g</h2>
                        <p className="calories-label">Protein</p>
                        </div>
                        <div className="progress-circle">
                            Circle
                        </div>
                    </div>
                </div>
                <div className="card small">
                    <div className="card-content">
                        <div className="text-container">
                        <h2 className="calories-count">58g</h2>
                        <p className="calories-label">Protein</p>
                        </div>
                        <div className="progress-circle">
                            Circle
                        </div>
                    </div>
                </div>
                <div className="card small">
                    <div className="card-content">
                        <div className="text-container">
                        <h2 className="calories-count">58g</h2>
                        <p className="calories-label">Protein</p>
                        </div>
                        <div className="progress-circle">
                            Circle
                        </div>
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

             <div className="bottomBar">
                <button className="iconNav">Home</button>
                <button className="iconNav">Search</button>
                <button className="iconNav">Add</button>
                <button className="iconNav">Profile</button>
             </div>

                
        </main>
    )
}