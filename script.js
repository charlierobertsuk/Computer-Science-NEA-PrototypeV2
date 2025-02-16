class AlgorithmVisualiser {
  // equivilant to python __init__
  constructor() {
    this.array = [];
    this.barsContainer = document.getElementById("bars-container");
    this.generateArray();
  }

  generateArray() {
    this.array = Array.from(
      { length: 8 }, // number of bars (there will be 8, 16, 32 variables)
      () => Math.floor(Math.random() * 99) + 1 // random number between 1 and 100
    );
    this.renderBars();
  }

  renderBars() {
    this.array.forEach((value) => {
      const bar = document.createElement("div");
      bar.className = "sorting-bar";
      bar.style.height = `${value * 2}px`; // 2 to 200px (height) in 100 incraments of 2px
      this.barsContainer.appendChild(bar);
    });
  }
}

window.addEventListener("load", () => new AlgorithmVisualiser()); // loads visualiser
