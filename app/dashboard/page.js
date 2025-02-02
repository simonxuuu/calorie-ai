import React from 'react';
import './dashboard.css'
import Header from './components/Header';
import Calories from './components/Calories';
import DateSelector from './components/DateSelector';
import Nav from './components/Nav';
import Snaps from './components/Snaps';
import Stats from './components/Stats';

const SnappitPage = () => {
    let userStatistics = {
        currentCalories: 2000,
        targetCalories: 2500,
        currentProtein: 150,
        targetProtein: 200,
        currentFats: 70,
        targetFats: 80,
        currentCarbs: 300,
        targetCarbs: 350,
        healthScore: 75
    } /* Retrieve from AppContext */

    return (
        <main>
            <Header /> {/* Contains inbox, settings */}
                <DateSelector />
                <div className="statGroup">
                    <Calories />
                    <Stats name="Protein"/>
                    <Stats name="Fats"/>
                    <Stats name="Carbs"/>
                    <Stats name="Health Score"/>
                </div>
                <Snaps /> {/* Snaps are loaded in this component /> */}
            <Nav />
        </main>
    );
    };

export default SnappitPage;