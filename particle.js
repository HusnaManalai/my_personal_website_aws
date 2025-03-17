function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");

  // Random position
  const x = Math.random() * 100;
  const y = Math.random() * 100;

  // Random size
  const size = Math.random() * 3 + 1;

  // Apply styles
  star.style.left = `${x}vw`;
  star.style.top = `${y}vh`;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;


  // Add animation
  star.style.animationDuration = `${Math.random() * 2 + 2}s`;
  star.style.animationDelay = `${Math.random() * 1}s`;

  // Add to the container instead of body
  document.getElementById("stars-container").appendChild(star);
}

// Generate stars
function generateStars(count) {
  for (let i = 0; i < count; i++) {
    createStar();
  }
}

// Call the function to generate stars
generateStars(10);

