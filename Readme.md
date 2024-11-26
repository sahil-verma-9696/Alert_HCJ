# Live url
[Click me 👆 to go live](https://sahil-verma-9696.github.io/Alert_HCJ/)

# Alert Features

1. **Show alert with a specific time.** ⌚
2. **Hold the alert when the user hovers over it.** 🤚
3. **Drag and move the alert anywhere on the screen.** 🚀

---

## JavaScript Description

### 1. **Initialization**
The alert functionality is initialized by attaching event listeners to various elements.

| **Element**         | **Event Listener** | **Handler Function**   |
|----------------------|--------------------|------------------------|
| `closeButton`        | `click`           | `closeAlert`           |
| `alertContainer`     | `mousedown`       | `handleDragStart`      |
| `alertContainer`     | `mouseenter`      | `holdAlert`            |
| `alertContainer`     | `mouseleave`      | `resumeAutoClose`      |
| `triggerButton`      | `click`           | `showAlert`            |

---

### 2. **Function Descriptions**

#### `showAlert()`
- **Purpose**: Displays the alert box on the screen.
- **Actions**:
  - Sets the `alertContainer`'s `display`, `opacity`, and `transform` properties to make it visible.
  - Resets and starts the time bar and auto-close countdown.

#### `closeAlert()`
- **Purpose**: Closes the alert box with an animation.
- **Actions**:
  - Smoothly transitions the `opacity` and `transform` properties to hide the alert.
  - Removes the alert from the DOM after the animation completes.

#### `startAutoClose()`
- **Purpose**: Starts a countdown to automatically close the alert.
- **Actions**:
  - Animates the time bar to shrink over the countdown duration.
  - Closes the alert after the specified time elapses.

#### `holdAlert()`
- **Purpose**: Pauses the auto-close countdown and time-bar animation.
- **Actions**:
  - Clears the `autoCloseTimeout`.
  - Calculates the remaining time and halts the time-bar transition.

#### `resumeAutoClose()`
- **Purpose**: Resumes the auto-close countdown and time-bar animation.
- **Actions**:
  - Restarts the countdown with the remaining time.
  - Animates the time bar from its current position.

#### `resetTimeBar()`
- **Purpose**: Resets the time bar to its initial full width.
- **Actions**:
  - Clears any existing timeout.
  - Sets the `timeBar`'s `width` to 100% with no transition.

#### `handleDragStart(event)`
- **Purpose**: Enables the user to drag and reposition the alert box.
- **Actions**:
  - Calculates the offset between the cursor and the alert box.
  - Updates the `left` and `top` positions of the alert box as the cursor moves.
  - Ends dragging when the mouse button is released.

---

### 3. **How It Works**

1. The alert is triggered by clicking the `triggerButton`.
2. The alert appears with an animated time bar that counts down from 5 seconds.
3. If the user hovers over the alert:
   - The countdown and time-bar animation pause.
4. If the user moves the mouse out of the alert:
   - The countdown and time-bar animation resume.
5. The user can drag and move the alert anywhere on the screen.
6. Clicking the `closeButton` smoothly hides the alert.

---

### **Code Reference**

#### Example HTML:
```html
<button id="show-alert">Show Alert</button>
<section class="alert" style="display: none; opacity: 0; transform: translateY(-20px);">
    <div class="side-border"></div>
    <div class="icon">
        <i class="fa-solid fa-check fa-2xl"></i>
    </div>
    <section class="content">
        <h3 class="content-heading">Success</h3>
        <p class="content-text">Order placed successfully. Thank you for shopping with us.</p>
    </section>
    <div class="time-bar"></div>
    <span class="close">×</span>
</section>
```

#### Example CSS: 

```CSS
html {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    width: 100%;
    height: 100%;
}

*,
*::before,
*::after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
}

body {
    width: 100%;
    height: 100%;
}

.alert {
    position: fixed;
    top: 1rem;
    right: 1rem;
    width: 22.5rem;
    height: 6.25rem;
    display: flex;
    align-items: center;
    background: #E6FAF5;
    overflow: hidden;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: grab;
}

.close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.close:hover {
    transform: scale(1.6);
}

.side-border {
    width: 0.5rem;
    height: 100%;
    margin-right: 1.25rem;
    background-color: #00CC99;
}

.time-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0.25rem;
    background-color: #00CC99;
    /* animation: shrink 5s linear forwards; */
}

@keyframes shrink {
    from {
        width: 100%;
    }

    to {
        width: 0%;
    }
}

.icon {
    color: white;
    min-width: 3.75rem;
    height: 3.75rem;
    margin-right: 1.25rem;
    border-radius: 50%;
    background-color: #00CC99;
    display: flex;
    justify-content: center;
    align-items: center;
}

.content-text {
    font-size: 0.75rem;
    /* Adjusted from "x-small" */
}
```

#### Example JavaScript: 
```JavaScript
(() => {
    let autoCloseTimeout = null; // To store the timeout for auto-close
    let remainingTime = 5000; // Remaining time in milliseconds
    const AUTO_CLOSE_TIME = 5000; // 5 seconds
    const alertContainer = document.querySelector('.alert');
    const closeButton = document.querySelector('.close');
    const timeBar = document.querySelector('.time-bar');
    const triggerButton = document.querySelector('#show-alert'); // Button to trigger the alert
    let timeBarStartTime = null; // Timestamp when the time bar animation started

    /**
     * Initializes the alert functionality.
     */
    const initializeAlert = () => {
        // Attach event listeners
        closeButton.addEventListener('click', closeAlert);
        alertContainer.addEventListener('mousedown', handleDragStart);
        alertContainer.addEventListener('mouseenter', holdAlert);
        alertContainer.addEventListener('mouseleave', resumeAutoClose);
        triggerButton.addEventListener('click', showAlert);
    };

    /**
     * Shows the alert box.
     */
    const showAlert = () => {
        alertContainer.style.display = 'flex'; // Show the alert
        alertContainer.style.opacity = '1'; // Make it visible
        alertContainer.style.transform = 'translateY(0)';
        resetTimeBar();
        startAutoClose();
    };

    /**
     * Closes the alert box with an animation.
     */
    const closeAlert = () => {
        alertContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        alertContainer.style.opacity = '0';
        alertContainer.style.transform = 'translateY(-20px)';

        // Remove the alert box from the DOM after the animation
        setTimeout(() => {
            alertContainer.style.display = 'none';
        }, 300);
    };

    /**
     * Starts the auto-close countdown.
     */
    const startAutoClose = () => {
        resetTimeBar();
        timeBar.style.transition = `width ${remainingTime}ms linear`;
        timeBar.style.width = '0%';

        timeBarStartTime = Date.now();
        autoCloseTimeout = setTimeout(() => {
            closeAlert();
        }, remainingTime);
    };

    /**
     * Holds the alert (pauses auto-close and animation) when the user hovers over it.
     */
    const holdAlert = () => {
        if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout); // Pause auto-close
            autoCloseTimeout = null;

            // Calculate remaining time
            const elapsedTime = Date.now() - timeBarStartTime;
            remainingTime -= elapsedTime;

            // Pause the time bar animation
            timeBar.style.transition = 'none';
            const currentWidth = (remainingTime / AUTO_CLOSE_TIME) * 100;
            timeBar.style.width = `${currentWidth}%`;
        }
    };

    /**
     * Resumes auto-close and animation when the user moves the mouse out of the alert box.
     */
    const resumeAutoClose = () => {
        if (!autoCloseTimeout) {
            timeBarStartTime = Date.now(); // Reset start time for time-bar animation
            timeBar.style.transition = `width ${remainingTime}ms linear`;
            timeBar.style.width = '0%';

            // Resume the auto-close countdown
            autoCloseTimeout = setTimeout(() => {
                closeAlert();
            }, remainingTime);
        }
    };

    /**
     * Resets the time bar to its full width.
     */
    const resetTimeBar = () => {
        clearTimeout(autoCloseTimeout); // Clear any ongoing timeout
        remainingTime = AUTO_CLOSE_TIME; // Reset remaining time
        timeBar.style.transition = 'none';
        timeBar.style.width = '100%';
    };

    /**
     * Handles the start of dragging the alert box.
     * @param {MouseEvent} event - The mousedown event
     */
    const handleDragStart = (event) => {
        const startX = event.clientX;
        const startY = event.clientY;
        const rect = alertContainer.getBoundingClientRect();

        const offsetX = startX - rect.left;
        const offsetY = startY - rect.top;

        const handleMouseMove = (moveEvent) => {
            alertContainer.style.transition = 'none'; // Disable smooth transitions during drag
            alertContainer.style.left = `${moveEvent.clientX - offsetX}px`;
            alertContainer.style.top = `${moveEvent.clientY - offsetY}px`;
        };

        const handleMouseUp = () => {
            // Remove mousemove and mouseup listeners when drag ends
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            alertContainer.style.cursor = 'grab';
        };

        // Attach listeners for dragging
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        alertContainer.style.cursor = 'grabbing';
    };

    // Initialize the alert
    initializeAlert();
})();
```

## Contribution

### Developed By  
This HTML, CSS, and JavaScript file was modularized, documented, and optimized by **Sahil Verma** in collaboration with **ChatGPT**, gaining valuable experience and insights into industry standards to ensure clarity and maintainability for developers.
