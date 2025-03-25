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
    this.messageTimeline = gsap.timeline({ paused: true });
    this.topDivTimeline = gsap.timeline({ paused: true });
    this.mainDivTimeline = gsap.timeline({ paused: true });
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
            Development, specializing in front-end. I'm looking for an apprenticeship starting in
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
            <p>THREEJS / SYMFONY / VUE</p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <p>Did you miss some of the projects ?</p>
        <a href="./projects/massage-sportif-annecy">Discover all projects</a>
      </div>`;

    const message = document.createElement("div");
    message.innerHTML = `<div class="message"><p>No project here yet ... Maybe yours ?</p></div>`;

    this.topDiv3D = new CSS2DObject(topDiv);
    this.topDiv3D.position.set(-198, 400, 200);
    this.mainDiv3D = new CSS2DObject(mainDiv);
    this.mainDiv3D.position.set(-198, 420, 200);
    this.message3D = new CSS2DObject(message);
    this.message3D.position.set(0, -100, 0);

    this.scene.add(this.topDiv3D);
    this.scene.add(this.mainDiv3D);
    this.scene.add(this.message3D);

    //wait for element to exist
    setTimeout(() => {
      this.setMessageAnimation();
      this.setCVAnimation();
    }, 500);
  }
  setCVAnimation() {
    this.topDivTimeline
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

    this.mainDivTimeline
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
  }
  setMessageAnimation() {
    this.messageTimeline.fromTo(
      ".message",
      {
        scale: 0,
      },
      {
        duration: 1.5,
        ease: "elastic.out(1,0.3)",
        scale: 1,
        onComplete: () => {
          gsap.delayedCall(2, () => {
            this.messageTimeline.reverse();
          });
        },
      }
    );
  }
}
