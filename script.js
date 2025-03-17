

// Add Task Functionality
document.getElementById("add-task-btn").addEventListener("click", function() {
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
  
    if (taskInput.value.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = taskInput.value;
  
      // Add remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "x";
      removeBtn.style.marginLeft = "10px";
      removeBtn.onclick = () => taskList.removeChild(li);
  
      li.appendChild(removeBtn);
      taskList.appendChild(li);
      taskInput.value = ""; // Clear input
    }
  });
  
  // Timer Functionality
  let timer;
  let timeLeft = 1500; // 25 minutes in seconds
  let isRunning = false;
  
  document.getElementById("start-timer").addEventListener("click", function() {
    if (!isRunning) {
      isRunning = true;
      timer = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateTimerDisplay();
        } else {
          clearInterval(timer);
          alert("Time's up! Take a break.");
          isRunning = false;
        }
      }, 1000);
    }
  });


  // Stop Timer (Pause)
document.getElementById("stop-timer").addEventListener("click", function () {
    clearInterval(timer);
    isRunning = false; // Allow restart
  });
  
  document.getElementById("reset-timer").addEventListener("click", function() {
    clearInterval(timer);
    timeLeft = 1500;
    updateTimerDisplay();
    isRunning = false;
  });
  


  document.getElementById("task-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") { // Check if Enter key is pressed
      event.preventDefault(); // Prevent form submission (if inside a form)
      document.getElementById("add-task-btn").click(); // Trigger Add Task button
    }
  });

  

  function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer-display").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  


