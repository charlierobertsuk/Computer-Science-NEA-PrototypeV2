class AlgorithmVisualiser {
  constructor(containerId, statsId, titleId, algorithmSelectId, speedInput) {
    this.array = [];
    this.bars = [];
    this.originalArray = [];
    this.numbers = [];
    this.isRunning = false;
    this.comparisons = 0;
    this.swaps = 0;
    this.timeTaken = 0;
    this.startTime = null;
    this.animationSpeed = this.calculateAnimationSpeed(3);
    this.defaultSize = 16; // default array size - will change with screen size (mobile 8, default 16, wideish 32)

    // DOM
    this.barsContainer = document.getElementById(
      `bars-container-${containerId}`
    );
    this.statsComparisons = document.getElementById(
      `comparisons-${containerId}`
    );
    this.statsSwaps = document.getElementById(`swaps-${containerId}`);
    this.statsTimeTaken = document.getElementById(`time-taken-${containerId}`);
    this.titleElement = document.getElementById(
      `visualiser-${containerId}-title`
    );
    this.startButton = document.getElementById("start-sort");
    this.sizeButtons = document.querySelectorAll(".btn-array-size");
    this.speedInput = speedInput;
    this.algorithmSelect = document.getElementById(
      `algorithm-select-${containerId}`
    );

    this.algorithmSelect.addEventListener("change", () => {
      this.updateTitle();
    });

    this.generateArray(this.defaultSize);
    this.updateTitle();
  }

  updateTitle() {
    const algorithmName =
      this.algorithmSelect.options[this.algorithmSelect.selectedIndex].text;
    this.titleElement.textContent = algorithmName;
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
    this.array.forEach((value) => {
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
    this.timeTaken = (performance.now() - this.startTime) / 1000;
    this.statsTimeTaken.textContent = `${this.timeTaken.toFixed(1)}s`; // toFixed is rounding to decimal figures
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
    this.startTime = performance.now();
    this.toggleButtons(false);

    switch (this.algorithmSelect.value) {
      case "bubble":
        await this.bubbleSort();
        break;
      case "merge":
        await this.mergeSort(0, this.array.length - 1);
        break;
      case "quick":
        await this.quickSort(0, this.array.length - 1);
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

    // move bars up to show what is currently being focused/sorted
    tempBars.forEach((bar) => (bar.style.transform = "translateY(-10px)"));
    await this.wait();

    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      this.bars[k].classList.add("is-comparing");
      await this.wait();

      this.comparisons++;
      this.statsComparisons.textContent = this.comparisons;

      if (leftArr[i] <= rightArr[j]) {
        this.array[k] = leftArr[i];
        this.updateBar(k);
        i++;
      } else {
        this.array[k] = rightArr[j];
        this.updateBar(k);
        j++;
      }
      this.bars[k].classList.remove("is-comparing");
      k++;
    }

    while (i < leftArr.length) {
      this.array[k] = leftArr[i];
      this.updateBar(k);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      this.array[k] = rightArr[j];
      this.updateBar(k);
      j++;
      k++;
    }

    // bars back to ariginal position
    tempBars.forEach((bar) => (bar.style.transform = "translateY(0)"));
    tempBars.forEach((bar) => bar.classList.add("is-sorted"));
    await this.wait();
  }

  async quickSort(low, high) {
    if (low < high) {
      const pivotIndex = await this.partition(low, high);
      await this.quickSort(low, pivotIndex - 1);
      await this.quickSort(pivotIndex + 1, high);
    } else if (low === high) {
      this.bars[low].classList.add("is-sorted");
    }
  }

  async partition(low, high) {
    const pivot = this.array[high];
    this.bars[high].classList.add("is-pivot");
    let i = low - 1;
    for (let j = low; j < high; j++) {
      this.bars[j].classList.add("is-comparing");
      await this.wait();

      this.comparisons++;
      this.statsComparisons.textContent = this.comparisons;

      if (this.array[j] < pivot) {
        i++;
        await this.swap(i, j);
      }

      this.bars[j].classList.remove("is-comparing");
    }

    await this.swap(i + 1, high);
    this.bars[high].classList.remove("is-pivot");
    this.bars[i + 1].classList.add("is-sorted");

    return i + 1;
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
    this.statsComparisons.textContent = this.comparisons;

    if (this.array[i] > this.array[j]) {
      await this.swap(i, j);
    }

    this.bars[i].classList.remove("is-comparing");
    this.bars[j].classList.remove("is-comparing");
  }

  async swap(i, j) {
    this.swaps++;
    this.statsSwaps.textContent = this.swaps;

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
    this.timeTaken = 0;
    this.statsComparisons.textContent = "0";
    this.statsSwaps.textContent = "0";
    this.statsTimeTaken.textContent = "0s";
    this.startButton.disabled = false;
    this.toggleButtons(true);
    this.bars.forEach((bar) =>
      bar.classList.remove("is-comparing", "is-sorted", "is-pivot")
    );
  }

  setAnimationSpeed(speed) {
    this.animationSpeed = speed;
  }
}

class DualAlgorithmVisualiser {
  constructor() {
    const speedInput = document.getElementById("algorithm-speed-bar");
    this.visualiser1 = new AlgorithmVisualiser(
      1,
      "stats-container-1",
      "visualiser-1-title",
      "algorithm-select-1",
      speedInput
    );
    this.visualiser2 = new AlgorithmVisualiser(
      2,
      "stats-container-2",
      "visualiser-2-title",
      "algorithm-select-2",
      speedInput
    );

    // syncronise arrays when first compared
    this.visualiser2.array = [...this.visualiser1.array];
    this.visualiser2.originalArray = [...this.visualiser1.originalArray];
    this.visualiser2.renderBars();

    this.sizeButtons = document.querySelectorAll(".btn-array-size");
    this.sizeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const size = parseInt(button.getAttribute("data-array-size")); // gets the selected array size
        this.visualiser1.generateArray(size); // regenerate the new array
        this.visualiser2.array = [...this.visualiser1.array];
        this.visualiser2.originalArray = [...this.visualiser1.originalArray];
        this.visualiser2.renderBars();
      });
    });

    speedInput.addEventListener("input", (e) => {
      const sliderValue = parseInt(e.target.value);
      const newSpeed = this.visualiser1.calculateAnimationSpeed(sliderValue);
      this.visualiser1.setAnimationSpeed(newSpeed);
      this.visualiser2.setAnimationSpeed(newSpeed);
    });

    this.startButton = document.getElementById("start-sort");
    this.startButton.addEventListener("click", () => {
      if (
        this.visualiser1.algorithmSelect.value ===
        this.visualiser2.algorithmSelect.value
      ) {
        alert("Please select different algorithms for comparison.");
        return;
      }
      this.visualiser1.startSorting();
      this.visualiser2.startSorting();
    });

    this.compareButton = document.getElementById("compare-btn");
    this.compareButton.addEventListener("click", () => {
      const secondVisualizer = document.getElementById("visualiser-2");
      const secondSelector = document.getElementById(
        "algorithm-select-2-container"
      );
      secondVisualizer.classList.toggle("visible");
      secondSelector.style.display = secondVisualizer.classList.contains(
        "visible"
      )
        ? "block"
        : "none";
      this.compareButton.textContent = secondVisualizer.classList.contains(
        "visible"
      )
        ? "Hide Comparison"
        : "Compare";
    });
  }
}

window.addEventListener("load", () => new DualAlgorithmVisualiser()); // loads visualiser
