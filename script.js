class AlgorithmVisualiser {
  constructor() {
    this.array = [];
    this.barsContainer = document.getElementById("bars-container");
    this.generateArray();
  }

  generateArray() {
    const uniqueValues = new Set();
    while (uniqueValues.size < 8) {
      uniqueValues.add(Math.floor(Math.random() * 99) + 1); // random number between 1 and 100
    }
    this.array = Array.from(uniqueValues);
    this.renderBars();
  }

  renderBars() {
    this.array.forEach((value) => {
      const bar = document.createElement("div");
      bar.className = "sorting-bar";
      bar.style.height = `${value * 2}px`; // 2 to 200px (height) in 100 increments of 2px
      this.barsContainer.appendChild(bar);
    });
  }
}

window.addEventListener("load", () => new AlgorithmVisualiser()); // loads visualiser
