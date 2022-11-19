"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");
const tabContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const allOperationsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const allSection = document.querySelectorAll(".section");
const allLazyImage = document.querySelectorAll("img[data-src]");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//Button scrolling
btnScrollTo.addEventListener("click", (e) => {
  const section1Rect = section1.getBoundingClientRect();
  console.log(section1Rect);
  // console.log(e.target.getBoundingClientRect());
  // console.log(window.pageXOffset, window.pageYOffset);
  // console.log(document.documentElement.clientHeight, document.documentElement);
  // window.scrollTo({
  //   left: section1Rect.left,
  //   top: section1Rect.top,
  //   behavior: "smooth",
  // });
  section1Rect.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".nav__links").addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const sectionID = e.target.getAttribute("href");
    document.querySelector(sectionID).scrollIntoView({ behavior: "smooth" });
  }
});

tabContainer.addEventListener("click", (e) => {
  tabs.forEach((tab) => {
    tab.classList.remove("operations__tab--active");
  });
  if (e.target.classList.contains("operations__tab")) {
    e.target.classList.add("operations__tab--active");
    allOperationsContent.forEach((content) => {
      content.classList.remove("operations__content--active");
    });
    document
      .querySelector(`.operations__content--${e.target.dataset.tab}`)
      .classList.add("operations__content--active");
  }
});

nav.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("nav__link")) {
    const allLink = e.target.closest(".nav").querySelectorAll(".nav__link");
    allLink.forEach((link) => {
      if (link !== e.target) {
        link.style.opacity = 0.3;
      }
    });
  }
});
nav.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("nav__link")) {
    const allLink = e.target.closest(".nav").querySelectorAll(".nav__link");
    allLink.forEach((link) => {
      if (link !== e.target) {
        link.style.opacity = 1;
      }
    });
  }
});

const headerObserver = new IntersectionObserver(
  (entries) => {
    if (!entries[0].isIntersecting) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  }
);

headerObserver.observe(header);

const sectionObserver = new IntersectionObserver(
  (entries, observer) => {
    if (!entries[0].isIntersecting) return;
    entries[0].target.classList.remove("section--hidden");
    observer.unobserve(entries[0].target);
  },
  {
    root: null,
    threshold: 0.2,
  }
);

allSection.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    if (!entries[0].isIntersecting) return;
    entries[0].target.src = entries[0].target.dataset.src;
    entries[0].target.addEventListener("load", () => {
      entries[0].target.classList.remove("lazy-img");
    });
    observer.unobserve(entries[0].target);
  },
  {
    root: null,
    threshold: 1,
  }
);

allLazyImage.forEach((imgLazy) => {
  imageObserver.observe(imgLazy);
});

const slider = () => {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = (curSlide) => {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i + curSlide) * 100}%)`;
    });
  };
  goToSlide(curSlide);

  const gotoRight = () => {
    curSlide--;
    if (curSlide > -3) goToSlide(curSlide);
    else {
      curSlide = 0;
      goToSlide(curSlide);
    }
  };
  const gotoLeft = () => {
    curSlide++;
    if (curSlide > 0) {
      curSlide = -2;
      goToSlide(curSlide);
    } else {
      goToSlide(curSlide);
    }
  };

  btnRight.addEventListener("click", gotoRight);
  btnLeft.addEventListener("click", gotoLeft);
  const createDots = () => {
    slides.forEach((slide, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();
  dotContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      const slideNumber = e.target.dataset.slide;
      const allDot = e.target.closest(".dots").childNodes;
      allDot.forEach((dot) => {
        dot.classList.remove("dots__dot--active");
      });
      e.target.classList.add("dots__dot--active");
      goToSlide(-slideNumber);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") gotoRight();
    if (e.key === "ArrowLeft") gotoLeft();
  });
};

slider();
