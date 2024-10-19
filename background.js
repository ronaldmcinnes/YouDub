const gradientContainer = document.getElementById("gradient-container");

gradientContainer.addEventListener("mousemove", function (event) {
  const x = event.clientX / gradientContainer.clientWidth;
  const y = event.clientY / gradientContainer.clientHeight;

  gradientContainer.style.background = `linear-gradient(45deg, 
    rgb(${Math.floor(0 + 255 * x)}, ${Math.floor(0 + 50 * y)}, ${Math.floor(50)}), 
    rgb(${Math.floor(0 + 50 * x)}, ${Math.floor(0 + 50 * y)}, ${Math.floor(128 + 127 * x)})
  )`;
});
