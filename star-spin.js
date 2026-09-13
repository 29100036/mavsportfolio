// makes any element matching the given selector spin on hover, resuming from
// whatever angle it's currently at (rather than snapping back to 0deg)
function initStarSpin(selector) {
    document.querySelectorAll(selector).forEach(star => {

        let rotation = 0;
        // holds the continuous animation loop ID so we can stop it later
        let animId = null;

        // inspect the calculated css styles applied to this star from the stylesheet
        const style = window.getComputedStyle(star);

        // grab the current transform property value (which browsers represent as a matrix)
        const matrix = style.transform;

        // check if the star has an initial CSS rotation applied (like the 29deg on .about-star)
        if (matrix !== 'none') {
            // extract the numbers inside the css matrix() string
            const values = matrix.split('(')[1].split(')')[0].split(',');

            // pull out the first two matrix values used for calculated trigonometric math
            const a = parseFloat(values[0]);
            const b = parseFloat(values[1]);

            // convert the matrix values back into regular degrees and set as starting angle
            rotation = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }

        // listen for when the mouse cursor moves onto the star
        star.addEventListener('mouseenter', () => {
            // define the internal loop function that handles the spinning movement
            function spin() {
                // increase the rotation angle slightly every frame (lower = slower spin)
                rotation += 0.8;

                // apply the updated rotation angle directly to the element's inline css style
                star.style.transform = `rotate(${rotation}deg)`;

                // tell the browser to run this spin function again on the next screen repaint
                animId = requestAnimationFrame(spin);
            }

            // start the spin loop immediately on hover
            spin();
        });

        // listen for when the mouse cursor leaves the star
        star.addEventListener('mouseleave', () => {
            // cancel the scheduled animation frame instantly to freeze the star at its current angle
            cancelAnimationFrame(animId);
        });
    });
}