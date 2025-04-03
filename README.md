# Computer Science NEA - Prototype V2: Very Awesome Algorithm Visualiser (VAAV)

Welcome to the repository for **Prototype V2** of my Computer Science NEA (Non-Exam Assessment) project! This is an enhanced version of the **Very Awesome Algorithm Visualiser (VAAV)**, a web-based educational tool designed to visualise sorting algorithms. Building on Prototype V1, this iteration introduces the ability to compare two algorithms side-by-side, along with additional features and refinements.

## About This Project

Prototype V2 of VAAV is an interactive application aimed at helping users understand sorting algorithms through dynamic visualisations. The key advancement in this version is the dual-visualiser feature, allowing simultaneous comparison of two algorithms on the same dataset, with detailed performance metrics.

### Objectives
- Enable side-by-side comparison of two sorting algorithms.
- Visualise algorithm execution with animated bars and real-time statistics.
- Provide an intuitive interface for experimenting with array sizes and algorithms.
- Lay the groundwork for further enhancements in future prototypes.

### Technologies Used
- **HTML**: Defines the structure of the application.
- **CSS**: Custom dark-themed styling with responsive design elements.
- **JavaScript**: Implements sorting algorithms, animations, and UI interactivity.
- **Tools**: Developed using Visual Studio Code and Git for version control.

## Features
This prototype includes the following features:
- **Dual Visualisation**: Compare two algorithms (e.g., Bubble Sort vs. Quick Sort) simultaneously on identical arrays.
- **Algorithm Selection**: Choose from Bubble Sort, Merge Sort, and Quick Sort for each visualiser.
- **Array Size Options**: Select small (8), medium (16), or large (32) arrays, applied to both visualisers.
- **Performance Metrics**: Displays comparisons, swaps, and time taken for each algorithm in real-time.
- **Comparison Toggle**: Use the "Compare" button to show/hide the second visualiser.
- **Loading Animation**: A bubble sort animation plays on startup before the app loads.
- **Responsive Layout**: Three tabs (visualiser, control panel, code display) with improved styling.

## Files Included
- `index.html`: Main structure of the application with dual visualiser layout.
- `style.css`: Custom styling with a dark theme and animations.
- `script.js`: Logic for sorting algorithms, dual visualiser management, and UI interactions.

## How to Run the Prototype
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/charlierobertsuk/Computer-Science-NEA-PrototypeV2.git
   ```
2. **Open the Project**:
   - Navigate to the project folder.
   - Open `index.html` in a modern web browser (e.g., Chrome, Firefox).
3. **Interact with the Visualiser**:
   - Select array size and algorithms for both visualisers.
   - Click "Compare" to enable the second visualiser (optional).
   - Click "Start Sorting" to run the visualisation(s).

*(No additional setup or dependencies required—just a browser!)*

## Current Limitations
As Prototype V2, this is still a work in progress. Known limitations include:
- No adjustable animation speed (fixed at 100ms delay, with "Step by Step" and "Skip" buttons non-functional).
- Code display tab is present but unimplemented (no algorithm code shown yet).
- Limited error handling and no pause/reset functionality during sorting.
- Responsiveness could be further optimised for smaller screens.

These will be addressed in future iterations based on testing and feedback.

## Next Steps
- Implement adjustable animation speed and functional "Step by Step" and "Skip" controls.
- Add code display with step-by-step algorithm execution highlights.
- Introduce pause, step-through, and reset functionality during sorting.
- Enhance mobile responsiveness and accessibility.
- Add more sorting algorithms (e.g., Insertion Sort, Selection Sort).

## Differences from Prototype V1
- **Dual Visualiser**: Added a second visualiser for algorithm comparison, with a toggle button.
- **Performance Metrics**: Now includes time taken alongside comparisons and swaps.
- **UI Improvements**: Simplified control panel and updated layout for better usability.
- **Code Structure**: Refactored JavaScript into a `DualAlgorithmVisualiser` class for managing two instances.
