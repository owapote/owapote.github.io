import { JSX } from "react";
import { SetBaseFunction } from "../interface/componentTemplate";

function TopPageSlideShowComponent(): JSX.Element{
    
    return (
        <ul>
            {Array.from({ length: 10 }, (_, i) => (
                <li key={i}>今、結月ゆかり(雫)GeoGuessrがアツい！</li>
            ))}
        </ul>
    );
}

export default SetBaseFunction(TopPageSlideShowComponent,()=>{});