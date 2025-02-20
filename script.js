class AlgorithmVisualiser {
  constructor() {
    this.array = [];
    this.barsContainer = document.getElementById("bars-container");
    this.generateArray(16); // default array size - will change with screen size (mobile 8, default 16, wideish 32)

    const sizeButtons = document.querySelectorAll(".btn-array-size");
    sizeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const size = parseInt(button.getAttribute("data-array-size")); // gets the selected array size
        this.generateArray(size); // regenerate the new array
      });
    });
  }

  generateArray(size) {
    const uniqueValues = new Set();
    while (uniqueValues.size < size) {
      uniqueValues.add(Math.floor(Math.random() * 99) + 1); // random int between 1 and 100
    }
    this.array = Array.from(uniqueValues);
    this.renderBars();
  }

  renderBars() {
    this.barsContainer.innerHTML = ""; // clear any current existing bars
    this.array.forEach((value) => {
      const bar = document.createElement("div");
      bar.className = "sorting-bar";
      bar.style.height = `${value * 2}px`; // 2 to 200px (height) in 100 increments of 2px
      this.barsContainer.appendChild(bar);
    });
  }
}

window.addEventListener("load", () => new AlgorithmVisualiser()); // loads visualiser
