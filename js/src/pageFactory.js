import { MenuKind } from "../websiteModule.js";
import { TopPage }          from "../page/topPage.js";
import { DescriptionPage }  from "../page/description.js";
import { InterestListPage } from "../page/interestList.js";
import { ContactFormPage }  from "../page/contactForm.js";

//Factory Patternを組む
export const PageFactory = Object.freeze({
  [MenuKind.TopPage]: () => new TopPage(),
  [MenuKind.DescriptionPage]: () => new DescriptionPage(),
  [MenuKind.InterestListPage]: () => new InterestListPage(),
  [MenuKind.ContactFormPage]: () => new ContactFormPage(),
});
