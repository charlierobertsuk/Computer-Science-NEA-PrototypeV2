class AlgorithmVisualiser {
  constructor() {
    this.array = [];
    this.barsContainer = document.getElementById("bars-container");
    this.generateArray();
  }

  generateArray() {
    this.array = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 99) + 1
    );
    this.renderBars();
  }

  renderBars() {
    this.array.forEach((value) => {
      const bar = document.createElement("div");
      bar.className = "sorting-bar";
      bar.style.height = `${value * 2}px`;
      this.barsContainer.appendChild(bar);
    });
  }
}

window.addEventListener("load", () => new AlgorithmVisualiser());
