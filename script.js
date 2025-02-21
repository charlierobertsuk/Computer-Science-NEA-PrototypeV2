class AlgorithmVisualiser {
  constructor() {
    this.array = [];
    this.bars = [];
    this.originalArray = [];
    this.numbers = [];
    this.isRunning = false;
    this.comparisons = 0;
    this.swaps = 0;
    this.animationSpeed = this.calculateAnimationSpeed(3); // Default speed for slider value 3
    this.defaultSize = 16; // default array size - will change with screen size (mobile 8, default 16, wideish 32)

    // DOM
    this.barsContainer = document.getElementById("bars-container");
    this.startButton = document.getElementById("start-sort");
    this.sizeButtons = document.querySelectorAll(".btn-array-size");
    this.speedInput = document.getElementById("algorithm-speed-bar");

    // event listeners
    this.startButton.addEventListener("click", () => this.startSorting());
    window.addEventListener("resize", () => this.renderBars());
    this.sizeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const size = parseInt(button.getAttribute("data-array-size")); // gets the selected array size
        this.generateArray(size); // regenerate the new array
      });
    });

    this.speedInput.addEventListener("input", (e) => {
      const sliderValue = parseInt(e.target.value);
      this.animationSpeed = this.calculateAnimationSpeed(sliderValue);
    });

    this.generateArray(this.defaultSize);
  }

  generateArray(size) {
    if (this.isRunning) return;
    const uniqueValues = new Set();
    while (uniqueValues.size < size) {
      uniqueValues.add(Math.floor(Math.random() * 99) + 1); // random int between 1 and 100
    }
    this.array = Array.from(uniqueValues);
    this.originalArray = [...this.array];
    this.renderBars();
    this.reset();
  }

  renderBars() {
    this.barsContainer.innerHTML = ""; // clear any current existing bars
    this.bars = [];
    this.numbers = [];
    const displayedArray = this.array;
    displayedArray.forEach((value) => {
      const barContainer = this.createBarContainer(value);
      this.barsContainer.appendChild(barContainer);
    });
  }

  calculateAnimationSpeed(sliderValue) {
    // slider values in multiples of 1 to 10
    return 1000 * Math.pow(50 / 1000, sliderValue / 10); // exponential decreace in time
  }

  finishSorting() {
    // resets buttons and stuff after sorting
    this.isRunning = false;
    this.toggleButtons(true);
    this.startButton.disabled = true;
    this.bars.forEach((bar) => bar.classList.add("is-sorted"));
  }

  createBarContainer(value) {
    const barContainer = document.createElement("div");
    barContainer.className = "bar-container";

    const bar = document.createElement("div");
    bar.className = "sorting-bar";

    bar.style.height = `${value * 2}px`; // bars are double the height for twice the depth

    const numberLabel = document.createElement("div"); // number label styling
    numberLabel.className = "number-label";
    numberLabel.textContent = `${value}`;
    numberLabel.style.color = "var(--text-primary)";
    numberLabel.style.textAlign = "center";
    numberLabel.style.marginTop = "5px";

    barContainer.appendChild(bar);
    barContainer.appendChild(numberLabel);

    this.bars.push(bar);
    this.numbers.push(numberLabel);
    return barContainer;
  }

  async startSorting() {
    // disables/toggles buttons as the sorting begins
    if (this.isRunning) return;
    this.isRunning = true;
    this.toggleButtons(false);

    await this.bubbleSort();

    this.finishSorting();
  }

  toggleButtons(enable) {
    this.sizeButtons.forEach((button) => (button.disabled = !enable));
    this.startButton.disabled = !enable;
  }

  async bubbleSort() {
    for (let i = 0; i < this.array.length; i++) {
      for (let j = 0; j < this.array.length - i - 1; j++) {
        await this.compareAndSwap(j, j + 1);
      }
      this.bars[this.array.length - i - 1].classList.add("is-sorted");
    }
  }

  async compareAndSwap(i, j) {
    this.bars[i].classList.add("is-comparing");
    this.bars[j].classList.add("is-comparing");
    await this.wait();

    this.comparisons++;
    document.getElementById("comparisons").textContent = this.comparisons;

    if (this.array[i] > this.array[j]) {
      await this.swap(i, j);
    }

    this.bars[i].classList.remove("is-comparing");
    this.bars[j].classList.remove("is-comparing");
  }

  async swap(i, j) {
    this.swaps++;
    document.getElementById("swaps").textContent = this.swaps;

    const temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;

    this.bars[i].style.height = `${this.array[i] * 2}px`;
    this.bars[j].style.height = `${this.array[j] * 2}px`;

    this.numbers[i].textContent = this.array[i];
    this.numbers[j].textContent = this.array[j];

    await this.wait();
  }

  wait() {
    // it waits the animation speed time
    return new Promise((resolve) => setTimeout(resolve, this.animationSpeed));
  }

  reset() {
    // visualiser reset
    this.isRunning = false;
    this.comparisons = 0;
    this.swaps = 0;
    document.getElementById("comparisons").textContent = "0";
    document.getElementById("swaps").textContent = "0";
    this.startButton.disabled = false;
    this.toggleButtons(true);
    this.bars.forEach((bar) =>
      bar.classList.remove("is-comparing", "is-sorted")
    );
  }
}

window.addEventListener("load", () => new AlgorithmVisualiser()); // loads visualiser
