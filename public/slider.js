// slider------------------------------------------------

const images = [
  "assets/s1.webp",
  "assets/s2.webp",
  "assets/s3.jpg",
  "assets/s4.jpg",
  "assets/s5.png",
  "assets/s6.png",
  "assets/s7.jpg",
  "assets/s8.webp",
  "assets/s9.jpg",
  "assets/s10.jpg",
];

let index = 0;
const slideImage = document.getElementById("slideImage");

setInterval(() => {
  index = (index + 1) % images.length;
  slideImage.style.opacity = 0;

  setTimeout(() => {
    slideImage.src = images[index];
    slideImage.style.opacity = 1;
  }, 500);
}, 3000);
