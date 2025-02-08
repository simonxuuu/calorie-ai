'use client';
import { House, CameraPlus, PresentationChart } from "@phosphor-icons/react";


export default function Nav(){

    return(
        <div className="bottomBar">
               <House size={'2rem'} weight='bold'style={{marginBottom:
                '-0.5rem'
               }}/>
               <CameraPlus size={'3rem'}  weight='fill'/>
               <PresentationChart size={'2rem'} weight='bold'style={{marginBottom:
                '-0.5rem'
               }}/>
    
        </div>
    );

}