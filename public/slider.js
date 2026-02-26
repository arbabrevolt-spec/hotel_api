// slider------------------------------------------------

const images = [
  "Gallery/s1.webp",
  "Gallery/s2.webp",
  "Gallery/s3.jpg",
  "Gallery/s4.jpg",
  "Gallery/s5.png",
  "Gallery/s6.png",
  "Gallery/s7.jpg",
  "Gallery/s8.webp",
  "Gallery/s9.jpg",
  "Gallery/s10.jpg"
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

