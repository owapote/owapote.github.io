import { MenuKindValues } from "./websiteModule";
import { TopPage }          from "../page/topPage";
import { DescriptionPage }  from "../page/description";
import { MyPastimePage } from "../page/myPastime";
import { ContactFormPage }  from "../page/contactForm";

//Factory Patternを組む
export const PageFactory = Object.freeze({
  [MenuKindValues.TopPage]: () => new TopPage(),
  [MenuKindValues.DescriptionPage]: () => new DescriptionPage(),
  [MenuKindValues.MyPastimePage]: () => new MyPastimePage(),
  [MenuKindValues.ContactFormPage]: () => new ContactFormPage(),
});
