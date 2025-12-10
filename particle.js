function generateStars() {
  const starsContainer = document.getElementById("stars-container");
  if (!starsContainer) return; 

  const numStars = 40; 

  for (let i = 0; i < numStars; i++) {
      let star = document.createElement("div");
      star.classList.add("star");
      
      // Random positions
      star.style.top = Math.random() * 100 + "vh";
      star.style.left = Math.random() * 100 + "vw";

      // Random size 
      let size = Math.random() * 1 + 0.1;
      star.style.width = size + "px";
      star.style.height = size + "px";

      // Random animation delay 
      star.style.animationDelay = Math.random() * 4 + "s";

      starsContainer.appendChild(star);
  }
}

// Call function immediately after DOM loads
document.addEventListener("DOMContentLoaded", generateStars);


