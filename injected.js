/*

    Inject into:

    /var/packages/SurveillanceStation/target/ui/desktop.html

    <script src="http://harlock.piss:8080/synology/injected.js" defer></script>

*/

(function () {
    /* Kill the obnoxious scroll wheel zooming behavior */
    let swallow_it = (e) => {
        e.stopImmediatePropagation();
        return true;
    };

    document.addEventListener("wheel", swallow_it, { capture: true, passive: false });

    /* Prevent the alert panel disclosure triangle from being hidden by the alert
    bell by making sure that its `display` property always matches whatever the
    layout panel's disclosure triangle has set at any given point in time.
    */
    document.addEventListener("DOMContentLoaded", (event) => {

        // We have no control over how quickly Synology's Vue
        // code actually renders anything so poll.
        let poll_count = 0;
        let stop_polling = false;

        const poller = setInterval(() => {

            const right_triangle = document.querySelectorAll('.v-icon-tgl-alert');
            const left_triangle = document.querySelectorAll('.v-icon-tgl-layout');

            if (right_triangle.length && left_triangle.length) {
                stop_polling = true;

                const triangle_observer_config = { attributes: true, childList: false, subtree: false };
                const triangle_observer_callback = (mutations, observer) => {
                    for (const mutation of mutations) {
                        if (mutation.attributeName == "style") {
                            right_triangle[0].style.display = left_triangle[0].style.display;
                        }
                    }
                };

              const triangle_observer = new MutationObserver(triangle_observer_callback);
              triangle_observer.observe(left_triangle[0], triangle_observer_config);
            }

            poll_count++;

            if ( poll_count > 5000 ) {
                stop_polling = true;
            }

            if (stop_polling) {
                clearInterval(poller);
            }

        }, 500);
    });
})();
