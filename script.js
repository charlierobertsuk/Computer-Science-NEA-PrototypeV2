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
    this.algorithmSelect = document.getElementById("algorithm-select");

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

    switch (this.algorithmSelect.value) {
      case "bubble":
        await this.bubbleSort();
        break;
      case "merge":
        await this.mergeSort(0, this.array.length - 1);
        break;
      case "quick":
        /* await this.quickSort(0, this.array.length - 1); */
        console.log("quick sort coming soon!");
        break;
    }

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

  async mergeSort(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await this.mergeSort(left, mid);
      await this.mergeSort(mid + 1, right);
      await this.merge(left, mid, right);
    }
  }

  async merge(left, mid, right) {
    const leftArr = this.array.slice(left, mid + 1);
    const rightArr = this.array.slice(mid + 1, right + 1);
    const tempBars = this.bars.slice(left, right + 1);

    let i = 0,
      j = 0,
      k = left;

    // move bars up to show what is currently being focused/sorted
    tempBars.forEach((bar) => (bar.style.transform = "translateY(-10px)"));
    await this.wait();

    while (i < leftArr.length && j < rightArr.length) {
      this.bars[k].classList.add("is-comparing");
      await this.wait();

      this.comparisons++;
      document.getElementById("comparisons").textContent = this.comparisons;

      if (leftArr[i] <= rightArr[j]) {
        this.array[k] = leftArr[i];
        this.updateBar(k, left + i);
        i++;
      } else {
        this.array[k] = rightArr[j];
        this.updateBar(k, mid + 1 + j);
        j++;
      }
      this.bars[k].classList.remove("is-comparing");
      k++;
    }

    while (i < leftArr.length) {
      this.array[k] = leftArr[i];
      this.updateBar(k, left + i);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      this.array[k] = rightArr[j];
      this.updateBar(k, mid + 1 + j);
      j++;
      k++;
    }

    // bars back to ariginal position
    tempBars.forEach((bar) => (bar.style.transform = "translateY(0)"));
    tempBars.forEach((bar) => bar.classList.add("is-sorted"));
    await this.wait();
  }

  updateBar(index) {
    this.bars[index].style.height = `${this.array[index] * 2}px`;
    this.numbers[index].textContent = this.array[index];
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

    this.updateBar(i);
    this.updateBar(j);

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
