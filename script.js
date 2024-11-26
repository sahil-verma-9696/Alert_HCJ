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
timeBar.offsetHeight;
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
