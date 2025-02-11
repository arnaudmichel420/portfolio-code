import Experience from "./Experience/Experience.js";

const [navigationEntry] = performance.getEntriesByType("navigation");

if (navigationEntry.type !== "back_forward") {
  localStorage.clear();
} else {
  console.log(localStorage);
}

const experience = new Experience(document.querySelector("canvas.webgl"));
