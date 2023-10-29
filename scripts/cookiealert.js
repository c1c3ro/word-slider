/*
 * Bootstrap Cookie Alert by Wruczek
 * https://github.com/Wruczek/Bootstrap-Cookie-Alert
 * Released under MIT license
 */
(function () {

    var cookieAlert = document.querySelector(".cookiealert");
    var acceptCookies = document.querySelector(".acceptcookies");
    var container = document.querySelector(".container");

    if (!cookieAlert) {
       return;
    }

    cookieAlert.offsetHeight; // Force browser to trigger reflow (https://stackoverflow.com/a/39451131)

    // Show the alert if we cant find the "acceptCookies" cookie
    if (!getCookie("acceptCookies")) {
        cookieAlert.classList.add("show");
        container.classList.add("blur");
    }

    // When clicking on the agree button, create a 1 year
    // cookie to remember user's choice and close the banner
    acceptCookies.addEventListener("click", function () {
        setCookie("acceptCookies", true, 365);
        cookieAlert.classList.remove("show");
        container.classList.remove("blur");

        // dispatch the accept event
        window.dispatchEvent(new Event("cookieAlertAccept"))
    });

})();
