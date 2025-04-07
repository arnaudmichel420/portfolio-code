import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
//Create Timeline

let arrowHeaderT = gsap.timeline({
  scrollTrigger: {
    trigger: "header",
  },
});
let burgerT = gsap.timeline({
  scrollTrigger: {
    trigger: "header",
  },
});
let burgerOpenT = gsap.timeline();
let menuOpenT = gsap.timeline();
let extendOpenT = gsap.timeline();
let footerT = gsap.timeline({
  scrollTrigger: {
    trigger: "footer",
  },
});

let section1T = gsap.timeline({
  scrollTrigger: {
    trigger: ".section1",
  },
});
let section2T = gsap.timeline({
  scrollTrigger: {
    trigger: ".section2",
    start: "30% bottom",
  },
});
let section3T = gsap.timeline({
  scrollTrigger: {
    trigger: ".section3",
    start: "30% bottom",
  },
});
let section4T = gsap.timeline({
  scrollTrigger: {
    trigger: ".section4",
    start: "30% bottom",
  },
});

//header launch instantly
arrowHeaderT
  .to(".backArrowHeader div", {
    duration: 1,
    ease: "power2.inOut",
    width: "2.5rem",
  })
  .to(".backArrowHeader div:first-child", {
    duration: 0.5,
    ease: "power2.inOut",
    rotate: "-40deg",
    marginBottom: "-0.4rem",
  })
  .to(
    ".backArrowHeader div:last-child",
    {
      duration: 0.5,
      ease: "power2.inOut",
      rotate: "40deg",
      marginTop: "-0.4rem",
    },
    "<"
  );

burgerT
  .to(".burger div:nth-child(2)", {
    duration: 1,
    ease: "power2.inOut",
    width: "3.5rem",
  })
  .to(
    ".burger div:nth-child(2)",
    {
      duration: 0.5,
      ease: "power2.inOut",
      height: "0.3rem",
    },
    "<"
  )
  .to(".burger", {
    duration: 1,
    ease: "power2.inOut",
    gap: "0.6rem",
  })
  .to(
    ".burger div:nth-child(1)",
    {
      duration: 1,
      ease: "power2.inOut",
      width: "3.5rem",
    },
    "<"
  )
  .to(
    ".burger div:nth-child(1)",
    {
      duration: 0.5,
      ease: "power2.inOut",
      height: "0.4rem",
    },
    "<"
  )
  .to(
    ".burger div:nth-child(3)",
    {
      duration: 1,
      ease: "power2.inOut",
      width: "3.5rem",
    },
    "<"
  )
  .to(
    ".burger div:nth-child(3)",
    {
      duration: 0.5,
      ease: "power2.inOut",
      height: "0.4rem",
    },
    "<"
  );

//animate burger rotation
burgerOpenT
  .to(".burger", {
    duration: 1,
    ease: "power2.inOut",
    rotate: "90deg",
  })
  .to(
    ".burger",
    {
      duration: 0.5,
      ease: "power2.inOut",
      gap: "1.2rem",
      delay: 0.4,
    },
    "<"
  );
burgerOpenT.pause();

menuOpenT.to(".menu ul", {
  duration: 0,
  ease: "power2.inOut",
  gap: "1rem",
});
menuOpenT
  .fromTo(
    ".menu",
    {
      height: 0,
      padding: 0,
      gap: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      height: "auto",
      padding: "1rem 0",
      gap: "1rem",
    }
  )
  .fromTo(
    ".li-first",
    {
      y: "2rem",
      autoAlpha: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      y: 0,
      autoAlpha: 1,
      stagger: 0.1,
      delay: 0.5,
    },
    "<"
  );

menuOpenT.pause();

let menuStatus = false;
const burger = document.querySelector(".burger");
const extend = document.querySelector(".extend");

document.querySelector("html").addEventListener("click", (event) => {
  if (
    menuStatus === true &&
    !document.querySelector("header").contains(event.target)
  ) {
    handleBurgerAnimation();
    // if (
    //   extendStatus === true &&
    //   (getComputedStyle(extend).display === "none") == false
    // ) {
    //   extend.click();
    // }
  }
});
burger.addEventListener("click", () => {
  handleBurgerAnimation();
});

function handleBurgerAnimation() {
  if (menuStatus === false) {
    burgerOpenT.timeScale(1.5).restart();
    menuOpenT.timeScale(1.5).restart();
    menuStatus = true;
  } else if (extendStatus === true && menuStatus === true) {
    extendOpenT.eventCallback("onReverseComplete", () => {
      burgerOpenT.timeScale(2).reverse();
      menuOpenT.timeScale(2).reverse();
      menuStatus = false;
      extendStatus = false;

      extendOpenT.eventCallback("onReverseComplete", null);
    });
    extendOpenT.timeScale(1.5).reverse();
  } else {
    burgerOpenT.timeScale(1.5).reverse();
    menuOpenT.timeScale(1.5).reverse();
    menuStatus = false;
  }
}

extendOpenT.to(".extend ul", {
  duration: 0,
  ease: "power2.inOut",
  gap: "1rem",
  padding: "1rem 0",
  autoAlpha: 1,
});
extendOpenT
  .fromTo(
    ".extend",
    {
      height: "24px",
      padding: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      height: "auto",
    }
  )
  .fromTo(
    ".extend ul",
    {
      boxShadow: "none",
    },
    {
      duration: 0.3,
      ease: "power2.inOut",
      boxShadow: "inset 0 0 1rem 0 rgba(0, 0, 0, 0.3)",
    },
    "<"
  )
  .fromTo(
    ".extend li",
    {
      y: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      y: 0,
      opacity: 1,

      stagger: 0.1,
      delay: 0.5,
    },
    "<"
  );

extendOpenT.pause();

let extendStatus = false;
extend.addEventListener("click", () => {
  if (extendStatus === false) {
    extendOpenT.timeScale(1).play();
    extendStatus = true;
  } else {
    extendOpenT.timeScale(1.5).reverse();
    extendStatus = false;
  }
});

//footer
footerT
  .to(".backArrowFooterLeft div", {
    duration: 1,
    ease: "power2.inOut",
    width: "2.5rem",
  })
  .to(
    ".backArrowFooterRight div",
    {
      duration: 1,
      ease: "power2.inOut",
      width: "2.5rem",
    },
    "<"
  )
  .fromTo(
    "footer a:first-child p ",
    {
      x: "-1rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      x: 0,
      opacity: 1,
      delay: 0.5,
    },
    "<"
  )
  .fromTo(
    "footer a:last-child p ",
    {
      x: "1rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      x: 0,
      opacity: 1,
    },
    "<"
  )
  .to(".backArrowFooterLeft div:first-child", {
    duration: 0.5,
    ease: "power2.inOut",
    rotate: "-40deg",
    marginBottom: "-0.5rem",
  })
  .to(
    ".backArrowFooterLeft div:last-child",
    {
      duration: 0.5,
      ease: "power2.inOut",
      rotate: "40deg",
      marginTop: "-0.5rem",
    },
    "<"
  )
  .to(
    ".backArrowFooterRight div:first-child",
    {
      duration: 0.5,
      ease: "power2.inOut",
      rotate: "40deg",
      marginBottom: "-0.5rem",
    },
    "<"
  )
  .to(
    ".backArrowFooterRight div:last-child",
    {
      duration: 0.5,
      ease: "power2.inOut",
      rotate: "-40deg",
      marginTop: "-0.5rem",
    },
    "<"
  );

//section1

section1T
  .fromTo(
    "h1",
    {
      y: "2rem",
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
    ".section1 li",
    {
      y: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      y: 0,
      opacity: 1,
      stagger: 0.2,
    },
    "<"
  )
  .fromTo(
    ".section1 .rightPart",
    {
      x: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      x: 0,
      opacity: 1,
      delay: 0.3,
    },
    "<"
  );

//section2
section2T
  .fromTo(
    ".section2 h2",
    {
      y: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      y: 0,
      opacity: 1,
    },
    "<"
  )
  .fromTo(
    ".section2 li",
    {
      y: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      y: 0,
      opacity: 1,
      stagger: 0.1,
    },
    "<"
  )
  .fromTo(
    ".section2 h3",
    {
      y: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      y: 0,
      opacity: 1,
      delay: 0.3,
    },
    "<"
  )
  .fromTo(
    ".section2 p",
    {
      y: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      y: 0,
      opacity: 1,
    },
    "<"
  )

  .fromTo(
    ".section2 .leftPart",
    {
      x: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      x: 0,
      opacity: 1,
      delay: 0.3,
    },
    "<"
  );

//section3
section3T
  .fromTo(
    ".section3 p",
    {
      y: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      y: 0,
      opacity: 1,
      stagger: 0.1,
    }
  )
  .fromTo(
    ".section3 h2",
    {
      y: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      y: 0,
      opacity: 1,
    },
    "<"
  )
  .fromTo(
    ".section3 .rightPart",
    {
      x: "2rem",
      opacity: 0,
    },
    {
      duration: 1,
      ease: "power2.inOut",
      x: 0,
      opacity: 1,
      delay: 0.3,
    },
    "<"
  );

//section4
section4T.fromTo(
  ".section4",
  {
    y: "2rem",
    opacity: 0,
  },
  {
    duration: 1,
    ease: "power2.inOut",
    y: 0,
    opacity: 1,
  }
);
