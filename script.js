class AlgorithmVisualiser {
  constructor(containerId, statsId, titleId, algorithmSelectId) {
    this.array = [];
    this.bars = [];
    this.originalArray = [];
    this.numbers = [];
    this.isRunning = false;
    this.comparisons = 0;
    this.swaps = 0;
    this.timeTaken = 0;
    this.startTime = null;
    this.animationSpeed = 100;
    this.defaultSize = 16;
    this.timer = null;
    this.finished = false;

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
    this.speedButtons = document.querySelectorAll(".btn-speed");
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
      uniqueValues.add(Math.floor(Math.random() * 99) + 1);
    }
    this.array = Array.from(uniqueValues);
    this.originalArray = [...this.array];
    this.renderBars();
    this.reset();
  }

  renderBars() {
    this.barsContainer.innerHTML = "";
    this.bars = [];
    this.numbers = [];
    this.array.forEach((value) => {
      const barContainer = this.createBarContainer(value);
      this.barsContainer.appendChild(barContainer);
    });
  }

  startTimer() {
    this.timeTaken = 0;
    this.statsTimeTaken.textContent = `${this.timeTaken.toFixed(1)}s`;
    this.timer = setInterval(() => {
      this.timeTaken += 0.1;
      this.statsTimeTaken.textContent = `${this.timeTaken.toFixed(1)}s`;
    }, 100);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timeTaken = (performance.now() - this.startTime) / 1000;
    this.statsTimeTaken.textContent = `${this.timeTaken.toFixed(1)}s`;
  }

  finishSorting() {
    this.isRunning = false;
    this.finished = true;
    this.startButton.disabled = true;
    this.bars.forEach((bar) => bar.classList.add("is-sorted"));
    this.stopTimer();
  }

  createBarContainer(value) {
    const barContainer = document.createElement("div");
    barContainer.className = "bar-container";

    const bar = document.createElement("div");
    bar.className = "sorting-bar";

    bar.style.height = `${value * 2}px`;

    const numberLabel = document.createElement("div");
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
    if (this.isRunning || !this.isArrayReset()) return;
    this.isRunning = true;
    this.finished = false;
    this.toggleButtons(false);
    this.startTime = performance.now();
    this.startTimer();

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
    this.speedButtons.forEach((button) => (button.disabled = !enable));
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

    tempBars.forEach((bar) => bar.classList.add("is-temp"));
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

    tempBars.forEach((bar) => bar.classList.remove("is-temp"));
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
    return new Promise((resolve) => setTimeout(resolve, this.animationSpeed));
  }

  reset() {
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
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.array = [...this.originalArray];
    this.renderBars();
  }

  setAnimationSpeed(speed) {
    this.animationSpeed = speed;
  }

  isArrayReset() {
    return this.array.every((val, idx) => val === this.originalArray[idx]);
  }
}

class DualAlgorithmVisualiser {
  constructor() {
    this.visualiser1 = new AlgorithmVisualiser(
      1,
      "stats-container-1",
      "visualiser-1-title",
      "algorithm-select-1"
    );
    this.visualiser2 = new AlgorithmVisualiser(
      2,
      "stats-container-2",
      "visualiser-2-title",
      "algorithm-select-2"
    );

    this.visualiser2.array = [...this.visualiser1.array];
    this.visualiser2.originalArray = [...this.visualiser1.originalArray];
    this.visualiser2.renderBars();

    this.sizeButtons = document.querySelectorAll(".btn-array-size");
    this.sizeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const size = parseInt(button.getAttribute("data-array-size"));
        this.visualiser1.generateArray(size);
        this.visualiser2.array = [...this.visualiser1.array];
        this.visualiser2.originalArray = [...this.visualiser1.originalArray];
        this.visualiser2.renderBars();
      });
    });

    const speedSlow = document.getElementById("step-by-step");
    const speedNormal = document.getElementById("skip");
    const speedFast = document.getElementById("speed-fast");

    speedNormal.classList.add("selected");

    speedSlow.addEventListener("click", () => {
      speedSlow.classList.add("selected");
      speedNormal.classList.remove("selected");
    });
    speedNormal.addEventListener("click", () => {
      speedSlow.classList.remove("selected");
      speedNormal.classList.add("selected");
    });

    this.startButton = document.getElementById("start-sort");
    this.startButton.addEventListener("click", () => {
      this.visualiser1.startSorting();
      if (this.secondVisualizer.classList.contains("visible")) {
        this.visualiser2.startSorting();
        Promise.all([
          this.waitForFinish(this.visualiser1),
          this.waitForFinish(this.visualiser2),
        ]).then(() => {
          this.visualiser1.toggleButtons(true);
          this.visualiser2.toggleButtons(true);
        });
      } else {
        this.waitForFinish(this.visualiser1).then(() => {
          this.visualiser1.toggleButtons(true);
        });
      }
    });

    this.compareButton = document.getElementById("compare-btn");
    this.secondVisualizer = document.getElementById("visualiser-2");
    this.secondSelector = document.getElementById(
      "algorithm-select-2-container"
    );

    this.allAlgorithms = [
      { value: "bubble", text: "Bubble Sort" },
      { value: "merge", text: "Merge Sort" },
      { value: "quick", text: "Quick Sort" },
    ];
    this.updateSecondPicker();

    this.compareButton.addEventListener("click", () => {
      this.secondVisualizer.classList.toggle("visible");
      this.secondSelector.style.display =
        this.secondVisualizer.classList.contains("visible") ? "block" : "none";
      this.compareButton.textContent = this.secondVisualizer.classList.contains(
        "visible"
      )
        ? "Hide Comparison"
        : "Compare";
    });

    this.visualiser1.algorithmSelect.addEventListener("change", () => {
      this.updateSecondPicker();
    });
    this.visualiser2.algorithmSelect.addEventListener("change", () => {
      this.visualiser2.updateTitle();
    });
  }

  updateSecondPicker() {
    const selectedAlgo1 = this.visualiser1.algorithmSelect.value;
    const currentAlgo2 = this.visualiser2.algorithmSelect.value;
    this.visualiser2.algorithmSelect.innerHTML = "";

    const availableAlgorithms = this.allAlgorithms.filter(
      (algo) => algo.value !== selectedAlgo1
    );
    availableAlgorithms.forEach((algo) => {
      const option = document.createElement("option");
      option.value = algo.value;
      option.text = algo.text;
      this.visualiser2.algorithmSelect.appendChild(option);
    });

    if (availableAlgorithms.some((algo) => algo.value === currentAlgo2)) {
      this.visualiser2.algorithmSelect.value = currentAlgo2;
    } else {
      this.visualiser2.algorithmSelect.value = availableAlgorithms[0].value;
    }
    this.visualiser2.updateTitle();
  }

  waitForFinish(visualiser) {
    return new Promise((resolve) => {
      const check = () => {
        if (visualiser.finished) resolve();
        else setTimeout(check, 100);
      };
      check();
    });
  }
}

class LoadingScreen {
  constructor(onComplete) {
    this.container = document.getElementById("loading-bars");
    this.onComplete = onComplete;
    this.createBars();
  }

  createBars() {
    this.bars = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 99) + 1
    );
    this.bars.forEach((height) => {
      const bar = document.createElement("div");
      bar.className = "loading-bar";
      bar.style.height = `${height * 2}px`;
      this.container.appendChild(bar);
    });
    this.barElements = Array.from(this.container.children);
  }

  async animateBubbleSort() {
    for (let i = 0; i < this.bars.length; i++) {
      for (let j = 0; j < this.bars.length - i - 1; j++) {
        this.barElements[j].classList.add("is-comparing");
        this.barElements[j + 1].classList.add("is-comparing");
        await this.wait(50);

        if (this.bars[j] > this.bars[j + 1]) {
          this.swapBars(j, j + 1);
        }

        this.barElements[j].classList.remove("is-comparing");
        this.barElements[j + 1].classList.remove("is-comparing");
      }
      this.barElements[this.bars.length - i - 1].classList.add("is-sorted");
    }
    this.hideLoadingScreen();
  }

  swapBars(i, j) {
    const temp = this.bars[i];
    this.bars[i] = this.bars[j];
    this.bars[j] = temp;

    this.barElements[i].style.height = `${this.bars[i] * 2}px`;
    this.barElements[j].style.height = `${this.bars[j] * 2}px`;
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async hideLoadingScreen() {
    await this.wait(500);
    document.getElementById("loading-screen").style.display = "none";
    document.querySelector(".app-container").style.display = "block";
    if (this.onComplete) this.onComplete();
  }
}

// initialise the app instaed
class AppInitialiser {
  constructor() {
    this.loadingScreen = null;
    this.visualiser = null;
    this.init();
  }

  init() {
    this.loadingScreen = new LoadingScreen(() => {
      this.visualiser = new DualAlgorithmVisualiser();
    });
    this.loadingScreen.animateBubbleSort();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppInitialiser();
});
