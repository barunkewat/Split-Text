import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const slides = [
    {
      title:
        "A hummingbird hovers gracefully, its delicate wings frozen in motion as it sips nectar from a vibrant pink flower glistening with morning dew.",
      image: "/slider_img_1.png",
    },
    {
      title:
        "Rolling green hills embrace a tranquil mountain lake, where nature's mirror reflects the sky above in this serene highland paradise at golden hour.",
      image: "/slider_img_2.png",
    },
    {
      title:
        "Warm sunlight fills this thoughtfully designed living room, where natural textures, earthy tones, and lush greenery create an inviting sanctuary for modern comfort and relaxation.",
      image: "/slider_img_3.png",
    },
    {
      title:
        "Ethereal petals unfold in a dreamy dance of light and color, revealing nature's delicate artistry through soft gradients and the flower's glowing golden heart.",
      image: "/slider_img_4.png",
    },
    {
      title:
        "A contemplative moment by the window, where natural light illuminates her profile as she holds a sunflower, lost in thought on this quiet afternoon.",
      image: "/slider_img_5.png",
    },
    {
      title:
        "Rooted in stone yet reaching toward light, this flowering bonsai embodies centuries of wisdom: that true strength lies not in size, but in graceful adaptation.",
      image: "/slider_img_6.png",
    },
    {
      title:
        "Motion and emotion blur together in electric blue and warm coral hues, capturing the fluid essence of movement through artistic long-exposure photography techniques.",
      image: "/slider_img_7.png",
    },
  ];

  const pinDistance = window.innerHeight * slides.length;
  const progressBar = document.querySelector(".slider-progress");
  const sliderImages = document.querySelector(".slider-images");
  const sliderTitle = document.querySelector(".slider-title");
  const sliderIndices = document.querySelector(".slider-indices");

  let activeSlide = 0;
  let currentSplit = null;

  function createIndices() {
    sliderIndices.innerHTML = "";

    slides.forEach((_, index) => {
      const indexNum = (index + 1).toString().padStart(2, "0");
      const indicatorElement = document.createElement("p");
      indicatorElement.dataset.index = index;
      indicatorElement.innerHTML = `<span class="marker"></span><span class="index">${indexNum}</span>`;
      sliderIndices.appendChild(indicatorElement);

      if (index === 0) {
        gsap.set(indicatorElement.querySelector(".index"), {
          opacity: 1,
        });
        gsap.set(indicatorElement.querySelector(".marker"), {
          scaleX: 1,
        });
      } else {
        gsap.set(indicatorElement.querySelector(".index"), {
          opacity: 0.5,
        });
        gsap.set(indicatorElement.querySelector(".marker"), {
          scaleX: 0,
        });
      }
    });
  }

  function animateNewSlide(index) {
    const newSliderImage = document.createElement("img");
    newSliderImage.src = slides[index].image;
    newSliderImage.alt = `Slide ${index + 1}`;

    gsap.set(newSliderImage, {
      opacity: 0,
      scale: 1.1,
    });

    sliderImages.appendChild(newSliderImage);

    gsap.to(newSliderImage, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(newSliderImage, {
      scale: 1,
      duration: 1,
      ease: "power2.out",
    });

    const allImages = sliderImages.querySelectorAll("img");
    if (allImages.length > 3) {
      const removeCount = allImages.length - 3;
      for (let i = 0; i < removeCount; i++) {
        sliderImages.removeChild(allImages[i]);
      }
    }

    animateNewTitle(index);
    animateIndicators(index);
  }

  function animateIndicators(index) {
    const indicators = sliderIndices.querySelectorAll("p");

    indicators.forEach((indicator, i) => {
      const markerElement = indicator.querySelector(".marker");
      const indexElement = indicator.querySelector(".index");

      if (i === index) {
        gsap.to(indexElement, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(markerElement, {
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(indexElement, {
          opacity: 0.5,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(markerElement, {
          scaleX: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  }

  function animateNewTitle(index) {
    if (currentSplit) {
      currentSplit.revert();
    }

    sliderTitle.innerHTML = `<h1>${slides[index].title}</h1>`;

    currentSplit = new SplitText(sliderTitle.querySelector("h1"), {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });

    gsap.set(currentSplit.lines, {
      yPercent: 100,
      opacity: 0,
    });

    gsap.to(currentSplit.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    });
  }

  createIndices();

  ScrollTrigger.create({
    trigger: ".slider",
    start: "top top",
    end: `+=${pinDistance}px`,
    scrub: 1,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      gsap.set(progressBar, {
        scaleY: self.progress,
      });

      const currentSlide = Math.floor(self.progress * slides.length);

      if (activeSlide !== currentSlide && currentSlide < slides.length) {
        activeSlide = currentSlide;
        animateNewSlide(activeSlide);
      }
    },
  });
});
