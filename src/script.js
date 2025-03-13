import Experience from "./Experience/Experience.js";

//restoring experience to previous position
const [navigationEntry] = performance.getEntriesByType("navigation");
const navigateHome = JSON.parse(sessionStorage.getItem("home"));
if (
  (navigationEntry.type !== "back_forward" &&
    navigateHome?.navigate == false) ||
  navigationEntry.type == "reload"
) {
  sessionStorage.clear();
}

const experience = new Experience(document.querySelector("canvas.webgl"));
