
'use client';
import { Gear, Tray } from "@phosphor-icons/react";

export default function Header() {
    return (
        <div className="topBar">   
            <h1 className="snappitLogo">Snappit</h1>
            <div className="topButtons">
                <Gear size={'2.25rem'} weight='bold'/>
                <Tray size={'2.25rem'} weight='bold'/>
            </div>
        </div>
    );
}