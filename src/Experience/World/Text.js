import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "../Experience.js";

gsap.registerPlugin(ScrollTrigger);

export default class Text {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.parameters = {};

    this.setText();
  }

  setText() {
    const topDiv = document.createElement("div");
    topDiv.classList.add("topDiv");
    topDiv.innerHTML = `<div class="topDiv">
      <img src="/icons/arrow.svg" alt="" width="100px" />
      <p>
        Looks like you've reached the top of the mountain, learn more about
        myself above
      </p>
    </div>`;
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("mainDiv");
    mainDiv.innerHTML = `  <div class="top">
        <div class="box1">
          <h2>MICHEL Arnaud</h2>
          <h1>Web Developer</h1>
          <h3>
            Based in Annecy
            <img src="/icons/france.svg" alt="" width="40px" />
          </h3>
        </div>
        <div class="box2">
          <div>
            I'm transitioning careers and pursuing a Bachelor's in Web
            Development, specializing in front-end. I'm looking for a 2-month
            internship starting in April 2025 and an apprenticeship starting in
            September.
          </div>
          <div>
            <p>Contact :</p>
            <div>
              <a href="mailto:arnaud.michel420@gmail.com"
                ><img src="/icons/mail.svg" alt="" width="40px"
              /></a>
              <a
                href="https://www.linkedin.com/in/arnaud-michel-52b880292/"
                target="_blank"
                ><img src="/icons/linkedin.svg" alt="" width="40px"
              /></a>
            </div>
          </div>
        </div>
        <div class="box3">
          <div>
            <span>Language :</span>
            <p>HTML / CSS / JS / PHP / GLSL</p>
          </div>
          <div>
            <span>Framework / Libraries :</span>
            <p>THREEJS / Looking to learn more</p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <p>Did you miss some of the projects ?</p>
        <a href="">Discover all projects</a>
      </div>`;

    const topDiv3D = new CSS2DObject(topDiv);
    topDiv3D.position.set(-192, 400, 200);
    const mainDiv3D = new CSS2DObject(mainDiv);
    mainDiv3D.position.set(-192, 410, 200);

    this.scene.add(topDiv3D);
    this.scene.add(mainDiv3D);
  }
  setAnimation() {
    this.currentSection = this.experience.animateCamera.currentSection;

    let topDiv = gsap.timeline({});
    let mainDiv = gsap.timeline({});

    topDiv
      .fromTo(
        ".topDiv",
        {
          y: -30,
          opacity: 0,
        },
        {
          delay: 0.2,
          duration: 1,
          ease: "power2.inOut",
          y: 0,
          opacity: 1,
        }
      )
      .fromTo(
        ".topDiv img",
        {
          opacity: 0,
        },
        {
          delay: 0.2,
          duration: 1.5,
          ease: "power2.inOut",
          opacity: 1,
          repeat: -1,
          yoyo: true,
        },
        "<"
      );

    mainDiv
      .fromTo(
        ".bottom",
        {
          y: 30,
          opacity: 0,
        },
        {
          duration: 1,
          ease: "power2.inOut",
          y: 0,
          opacity: 1,
        }
      )
      .fromTo(
        ".box3",
        {
          y: 30,
          opacity: 0,
        },
        {
          delay: 0.1,
          duration: 1,
          ease: "power2.inOut",
          y: 0,
          opacity: 1,
        },
        "<"
      )
      .fromTo(
        ".box2",
        {
          y: 30,
          opacity: 0,
        },
        {
          delay: 0.2,
          duration: 1,
          ease: "power2.inOut",
          y: 0,
          opacity: 1,
        },
        "<"
      )
      .fromTo(
        "h3",
        {
          y: 30,
          opacity: 0,
        },
        {
          delay: 0.3,
          duration: 1,
          ease: "power2.inOut",
          y: 0,
          opacity: 1,
        },
        "<"
      )
      .fromTo(
        "h1",
        {
          y: 30,
          opacity: 0,
        },
        {
          delay: 0.4,
          duration: 1,
          ease: "power2.inOut",
          y: 0,
          opacity: 1,
        },
        "<"
      )
      .fromTo(
        "h2",
        {
          y: 30,
          opacity: 0,
        },
        {
          delay: 0.6,
          duration: 1,
          ease: "power2.inOut",
          y: 0,
          opacity: 1,
        },
        "<"
      );

    switch (this.currentSection) {
      case 5:
        topDiv.play();
        mainDiv.pause();
        break;
      case 6:
        mainDiv.play();
        topDiv.pause();
        break;

      default:
        break;
    }
  }
}
