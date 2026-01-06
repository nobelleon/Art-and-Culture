document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger,SplitText,CustomEase)
  // gsap code here!
  // Create custom eases and register GSAP plugins
CustomEase.create("smoothIn", "0.4, 0, 0.2, 1");
CustomEase.create("smoothOut", "0.8, 0, 0.6, 1");
CustomEase.create("textReveal", "0.25, 1, 0.5, 1");


// Initialize variables
let lenis = null;
let splitTextInstances = [];
let isWebEntered = false;
let activeIndex = 0;
let isAnimating = false;

// DOM elements
const preloader = document.getElementById("preloader");
const preloaderCounter = document.getElementById("preloader-counter");
const body = document.body;
const mainContent = document.querySelector("main");
const expandingImage = document.getElementById("expandingImage");
const enterButton = document.getElementById("enterButton");
const switchContainer = document.getElementById("switchContainer");
const scrollText = document.getElementById("scrollText");
const contentSection = document.getElementById("contentSection");
const heroSection = document.querySelector(".hero-section");
const slideTitle = document.getElementById("slideTitle");
const contentParagraph = document.getElementById("content-paragraph");
const slideCaption = document.getElementById("slideCaption");
const slideCategory = document.getElementById("slideCategory");
const grid = document.querySelector(".columns");
const columnsInner = {
  up: grid.querySelectorAll(".column-moveup > .column-inner"),
  down: grid.querySelectorAll(".column-movedown > .column-inner")
};
const content = document.querySelector(".content");
const thumbnails = document.querySelector(".thumbnails");
const thumbnailItems = thumbnails.querySelectorAll(".thumbnail");

// Lock scrolling initially
document.body.style.overflow = "hidden";

// Image and content data
const imageUrls = [
  "assets/img/ART_1.jpg",
  "assets/img/ART_2.jpg",
  "assets/img/ART_3.jpg",
  "assets/img/ART_4.jpg",
  "assets/img/ART_5.jpg",
  "assets/img/ART_6.jpg",
  "assets/img/ART_7.jpg",
  "assets/img/ART_8.jpg",
  "assets/img/ART_9.jpg",
  "assets/img/ART_10.jpg",
  "assets/img/ART_11.jpg",
  "assets/img/ART_12.jpg",
  "assets/img/ART_13.jpg",
  "assets/img/ART_14.jpg",
  "assets/img/ART_15.jpg",
  "assets/img/ART_16.jpg",
  "assets/img/ART_17.jpg"
];

const slideTitles = [
  { first: "Leonardo", second: "daVin" },
  { first: "Mildred", second: "Bendall" },
  { first: "Leonardo", second: "daVin" },
  { first: "Mildred", second: "Bendall" },
  { first: "James", second: "Rizzi" },
  { first: "Paula", second: "Becker" },
  { first: "Edvard", second: "Munch" },
  { first: "Caspar", second: "David F" },
  { first: "Hieronymus", second: "Bos" },
  { first: "Kazimir", second: "Malevi" },
  { first: "Katsushika", second: "Hokusai" },
  { first: "Oskar", second: "Schlemmer" },
  { first: "Hieronymus", second: "Bos" },
  { first: "Johanes", second: "Vermer" },
  { first: "Paul", second: "Cézanne" },
  { first: "Paul", second: "Gauguin" },
  { first: "Paula", second: "Becker" },
];

const slideCaptions = [
  "01 / PAINTING",
  "02 / PRESENCE",
  "03 / PAINTING",
  "04 / ESSENCE",
  "05 / TEXTURE",
  "06 / PATTERN",
  "07 / PRESENCE",
  "08 / AWARENESS",
  "09 / ESSENCE",
  "10 / TEXTURE",
  "11 / PATTERN",
  "12 / PRESENCE",
  "13 / AWARENESS",
  "14 / ESSENCE",
  "15 / TEXTURE",
  "16 / PATTERN",
  "17 / EXPRESSIONIST",
];

const slideCategories = [
  "VISUAL ART",
  "SURVIVAL", 
  "VISUAL ART",
  "SENSATION",
  "MEDITATION",
  "VISUAL MODERN",
  "CONTEMPLATION",
  "SENSATION",
  "OBSERVATION",
  "PRACTICE",
  "SENSATION",
  "MODERN ART",
  "CONTEMPLATION",
  "EXPLORATION",
  "CONTEMPLATION",
  "OBSERVATION",
  "MODERN ART"
];

const slideContent = [
  "La Belle Ferronnière, attributed to Leonardo da Vinci (c. 1490-1499), is a famous portrait housed in the Louvre Museum (Paris), depicting a noblewoman wearing a delicate jeweled chain (a ferronnière) across her forehead, though her identity remains debated, with theories suggesting Lucrezia Crivelli or Isabella of Aragon, and its title mistakenly applied later, possibly from a legend about King Francis I.",
  "Mildred Bendall's Still Life with Bottle and Jug is an oil painting created in the mid-20th century that exemplifies her post-impressionist style, blending Fauvist color sensibilities with strong composition. The specific history of this particular piece involves its sale at auction and its availability as an art print.",
  "Leonardo at the Milanese court: In 1482, one of the most famous painters in world history, Leonardo da Vinci, took up residence at the court of Ludovico Sforza, Duke of Milan - as a musician and inventor. Not long after, he became the official court painter, and was commissioned to paint a portrait of Ludovico’s 17-year-old mistress. This commission would engender one of the most fascinating portraits in Western European art, The Lady with an Ermine.",
  "Lemon, Jugs and Books is a notable still-life painting by the French artist Mildred Bendall (1891–1977). Bendall was a significant figure in the avant-garde movement in Bordeaux and was heavily influenced by her friendship with Henri Matisse, which is evident in the bold colors and rhythmic compositions of her work.",
  "James Rizzi's artwork A Drive with my Girl in a Swirl is a hand-signed, three-dimensional (3D) graphic from 2008, known for its vibrant Pop Art style. ",
  "The painting Still Life with Fried Eggs in the Pan by Paula Modersohn-Becker was created around 1905 and is an important example of her modern, simplified visual language.",
  "The Girls on the Bridge (1927) is a later version of one of Edvard Munch’s most enduring motifs, which he returned to approximately 12 times over nearly 30 years.",
  "The painting Chalk Cliffs on Rügen (Kreidefelsen auf Rügen) is an oil painting from circa 1818 by the German Romantic artist Caspar David Friedrich. The artwork is a masterpiece of German Romanticism and is currently housed at the Museum Oskar Reinhart in Winterthur, Switzerland.",
  "The Garden of Earthly Delights (Dutch: De tuin der lusten, lit. 'The garden of lusts') is the modern title[a] given to a triptych oil painting on oak panel painted by the Early Netherlandish master Hieronymus Bosch, between 1490 and 1510, when Bosch was between 40 and 60 years old.[1] Because of Bosch's religious beliefs, interpretations of the work typically assume it is a warning against the perils of temptation.",
  "Kazimir Malevich's A Girl with a Red Pole (1932-1933) is a striking portrait blending figurative elements with his characteristic geometric abstraction, showing a figure holding a bold red pole against a simple background, residing in the State Tretyakov Gallery in Moscow, and exemplifies his shift towards Neo-Suprematism/Neoclassicism late in his career.",
  "Under the Wave off Kanagawa (Kanagawa oki nami ura), or The Great Wave, is a famous Japanese woodblock print by Katsushika Hokusai, created around 1830–1832 during the Edo period, depicting fishermen in boats threatened by a massive wave, with Mount Fuji visible in the background. As the first print in his Thirty-six Views of Mount Fuji series, it's celebrated for its dramatic composition, use of Prussian blue, and innovative perspective, becoming an iconic symbol of Japanese art that influenced Western artists.",
  "Oskar Schlemmer's Bauhaus Stairway (Bauhaustreppe), painted in 1932, depicts figures on the iconic Dessau Bauhaus staircase, capturing the school's spirit just before the Nazis closed it, serving as both a memorial and a commentary on the fading modernist dream, blending geometric forms with graceful movement and featuring simplified, almost marionette-like figures reflecting Schlemmer's theatrical work, now held at the Museum of Modern Art (MoMA).",
  "The Garden of Earthly Delights (Dutch: De tuin der lusten, lit. 'The garden of lusts') is the modern title[a] given to a triptych oil painting on oak panel painted by the Early Netherlandish master Hieronymus Bosch, between 1490 and 1510, when Bosch was between 40 and 60 years old.[1] Because of Bosch's religious beliefs, interpretations of the work typically assume it is a warning against the perils of temptation.",
  "The Milkmaid (c. 1660) by Johannes Vermeer is a renowned Dutch Baroque oil painting in the Rijksmuseum, depicting a humble kitchen maid pouring milk with intense focus, symbolizing domestic virtue, quiet dignity, and the beauty found in ordinary tasks through masterful use of light, texture, and composition, with details like bread, Delft tiles (including a hidden Cupid), and a foot warmer adding layers of meaning about work, love, and household life.",
  "The House with the Cracked Walls (La Maison lézardée) is an oil-on-canvas landscape painted by Paul Cézanne between 1892 and 1894.",
  "The Siesta is an 1892-1894 oil on canvas painting by Paul Gauguin, now in the Metropolitan Museum of Art in New York.[1] It was painted during Gauguin's first extended trip to the island of Tahiti. The picture is an unpretentious representation of a group of Tahitian women in westernised clothes chatting in the cool shade of a verandah during the hot afternoon sun. One of the women is doing her ironing.[2] Although the subject matter was an aspect of everyday life, Gauguin worked on the canvas over a long period, making several changes - the shopping bag in the foreground.",
  "Paula Modersohn-Becker's Still Life with Leafy Plant, Lemon, and Orange (c. 1906) is a significant early Expressionist work, showcasing her distinctive style of simplified forms, intense colors, and emotional depth, influenced by Cézanne and Gauguin, and is known for its focus on everyday objects with profound intensity, capturing the essence of modern art."
];

// Preloader function
function runPreloader() {
  gsap.set(mainContent, {
    opacity: 0,
    visibility: "hidden"
  });

  let counter = 0;
  const duration = 2000;
  const interval = 20;
  const increment = 100 / (duration / interval);

  const counterInterval = setInterval(() => {
    counter += increment;
    if (counter >= 100) {
      counter = 100;
      clearInterval(counterInterval);

      gsap.to(preloader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          preloader.style.display = "none";
          gsap.to(mainContent, {
            opacity: 1,
            visibility: "visible",
            duration: 0.5
          });

          gsap.timeline().set(grid, { opacity: 1 }).fromTo(
            ".column",
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.6,
              ease: "power2.out"
            }
          );
        }
      });
    }
    preloaderCounter.textContent = Math.floor(counter);
  }, interval);
}

// Text animation function using GSAP SplitText
function animateText(element, delay = 0, staggered = false) {
  gsap.set(element, { opacity: 1 });

  // Clean up previous split instances
  splitTextInstances = splitTextInstances.filter((instance) => {
    if (instance.target === element) {
      instance.revert();
      return false;
    }
    return true;
  });

  // Create new SplitText instance - using chars instead of lines for better control
  const splitText = new SplitText(element, {
    type: "words,chars",
    charsClass: "char",
    wordsClass: "word"
  });

  splitTextInstances.push(splitText);

  // Create animation timeline
  const tl = gsap.timeline();

  // Animate based on whether it's staggered or not
  if (staggered && element.children.length > 1) {
    // First line (first child)
    tl.from(element.children[0].querySelectorAll(".char"), {
      duration: 0.9,
      yPercent: 100,
      opacity: 0.2,
      stagger: 0.03,
      ease: "textReveal",
      delay: delay
    });

    // Second line (second child) with delay
    tl.from(
      element.children[1].querySelectorAll(".char"),
      {
        duration: 0.9,
        yPercent: 100,
        opacity: 0.2,
        stagger: 0.03,
        ease: "textReveal"
      },
      "-=0.5"
    );
  } else {
    // Regular animation for all chars
    tl.from(splitText.chars, {
      duration: 0.9,
      yPercent: 100,
      opacity: 0.2,
      stagger: 0.02,
      ease: "textReveal",
      delay: delay
    });
  }

  return tl;
}

// Update slide content with animation
function updateSlideContent(index) {
  // Clean up previous SplitText instances
  splitTextInstances.forEach((instance) => {
    if (instance.revert) instance.revert();
  });
  splitTextInstances = [];

  // Update content
  const title = slideTitles[index];
  slideTitle.innerHTML = `
    <span class="content-title">${title.first}</span>
    <span class="content-title">${title.second}</span>
  `;

  contentParagraph.textContent = slideContent[index];
  slideCaption.textContent = slideCaptions[index];
  slideCategory.textContent = slideCategories[index];

  // Create animation timeline
  const masterTl = gsap.timeline();

  // Animate elements
  masterTl.fromTo(
    [slideCaption, slideCategory],
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
    0
  );

  const titleTl = animateText(slideTitle, 0.05, true);
  const paragraphTl = animateText(contentParagraph, 0.4);

  masterTl.add(titleTl, 0);
  masterTl.add(paragraphTl, 0);

  return masterTl;
}

// Find leftmost visible image
function findLeftmostVisibleImage() {
  const images = document.querySelectorAll(".column-item-img");
  let leftmostImage = null;
  let leftmostX = Infinity;

  images.forEach((img) => {
    const rect = img.getBoundingClientRect();
    if (
      rect.left < window.innerWidth &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.bottom > 0
    ) {
      if (rect.left < leftmostX) {
        leftmostX = rect.left;
        leftmostImage = img;
      }
    }
  });
  return leftmostImage;
}

// Initialize Lenis smooth scrolling
function initializeLenis() {
  if (!lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }
}

// Enter the web animation
const enterTheWeb = () => {
  if (isAnimating || isWebEntered) return;
  isAnimating = true;

  switchContainer.style.paddingLeft = "30px";

  gsap.to(switchContainer, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      switchContainer.style.display = "none";
    }
  });

  content.classList.add("content--current");

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      isWebEntered = true;

      gsap.set(
        [
          ".expanding-image",
          ".content",
          ".content-paragraph",
          ".thumbnails",
          ".scroll-text",
          ".slide-caption",
          ".slide-category"
        ],
        { position: "absolute" }
      );

      initializeLenis();
      document.body.style.overflow = "auto";

      gsap.to(scrollText, {
        opacity: 1,
        duration: 0.5,
        delay: 0.5
      });

      ScrollTrigger.create({
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.to(".hero-section", {
            height: 100 - self.progress * 40 + "vh",
            duration: 0,
            width: "100%",
            transformOrigin: "center top"
          });

          gsap.to(".expanding-image", {
            scale: 1 + self.progress * 0.1,
            y: -self.progress * 25 + "%",
            duration: 0,
            width: "100vw",
            height: 100 + self.progress * 30 + "vh"
          });

          const contentWrapper = document.querySelector(".content");
          gsap.to(contentWrapper, {
            y: -self.progress * 50 + "%",
            opacity: 1 - self.progress * 0.7,
            duration: 0
          });

          gsap.to(".content-paragraph", {
            y: -self.progress * 50 + "%",
            opacity: 1 - self.progress * 0.7,
            duration: 0
          });

          gsap.to([".slide-caption", ".slide-category"], {
            y: -self.progress * 50 + "%",
            opacity: 1 - self.progress * 0.7,
            duration: 0
          });

          gsap.to(".thumbnails", {
            y: -self.progress * 50 + "%",
            opacity: 1 - self.progress * 0.7,
            duration: 0
          });

          gsap.to(".scroll-text", {
            opacity: 1 - self.progress * 2,
            y: -self.progress * 20 + "%",
            duration: 0
          });
        }
      });
    }
  });

  // Step 1: Zoom grid
  tl.to(grid, { scale: 1, duration: 0.8, ease: "power2.inOut" }, 0);

  tl.to(
    columnsInner.up,
    { y: "-200vh", duration: 0.8, ease: "power2.inOut" },
    0
  );
  tl.to(
    columnsInner.down,
    { y: "200vh", duration: 0.8, ease: "power2.inOut" },
    0
  );

  // Step 2: Set up expanding image
  tl.add(() => {
    const leftImg = findLeftmostVisibleImage();
    if (leftImg) {
      const imgRect = leftImg.getBoundingClientRect();
      const imgStyle = window.getComputedStyle(leftImg);
      const bgImage = imgStyle.backgroundImage;

      expandingImage.style.backgroundImage = bgImage;
      expandingImage.style.top = `${imgRect.top}px`;
      expandingImage.style.left = `${imgRect.left}px`;
      expandingImage.style.width = `${imgRect.width}px`;
      expandingImage.style.height = `${imgRect.height}px`;
      expandingImage.style.opacity = 1;

      activeIndex = parseInt(leftImg.getAttribute("data-index"));

      document.querySelector(".thumbnail.active").classList.remove("active");
      document
        .querySelector(`.thumbnail[data-index="${activeIndex}"]`)
        .classList.add("active");
    }
  }, 0.8);

  // Step 3: Expand image
  tl.to(
    expandingImage,
    { width: "100vw", duration: 0.7, ease: "power2.inOut" },
    1.0
  );
  tl.to(grid, { opacity: 0, duration: 0.3 }, 1.2);

  // Step 4: Show content
  tl.add(() => updateSlideContent(activeIndex), 1.8);
  tl.set(thumbnails, { opacity: 1 }, 2.2);
  tl.to(
    thumbnailItems,
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
    2.3
  );
};

// Handle thumbnail clicks
thumbnailItems.forEach((thumb, index) => {
  thumb.addEventListener("click", () => {
    if (!isWebEntered || isAnimating) return;

    document.querySelector(".thumbnail.active").classList.remove("active");
    thumb.classList.add("active");

    activeIndex = index;

    gsap.to(expandingImage, {
      opacity: 0.5,
      duration: 0.3,
      onComplete: () => {
        expandingImage.style.backgroundImage = `url(${imageUrls[index]})`;
        gsap.to(expandingImage, { opacity: 1, duration: 0.3 });
      }
    });

    gsap.set([slideCaption, slideCategory], { opacity: 0, y: -20 });
    updateSlideContent(index);
  });
});

// Enter button hover effects
enterButton.addEventListener("mouseenter", () => {
  enterButton.querySelector(".indicator-dot").style.opacity = "1";
  switchContainer.style.paddingLeft = "30px";
});

enterButton.addEventListener("mouseleave", () => {
  enterButton.querySelector(".indicator-dot").style.opacity = "0";
  switchContainer.style.paddingLeft = "20px";
});

// Enter button click
enterButton.addEventListener("click", enterTheWeb);

// Scroll event handler
window.addEventListener("scroll", () => {
  if (isWebEntered) {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      gsap.to(scrollText, { opacity: 0, duration: 0.3 });
    } else {
      gsap.to(scrollText, { opacity: 1, duration: 0.3 });
    }
  }
});

// Start preloader when page is loaded
window.addEventListener("load", runPreloader);

 });

