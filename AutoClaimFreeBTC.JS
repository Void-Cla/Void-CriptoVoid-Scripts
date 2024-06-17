// ==UserScript==
// @version      1.2
// @match        https://*/recaptcha/*
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @match        https://*.hcaptcha.com/*captcha*
// @grant        none
// @license MIT
// @name         Void Coin FreeBitco
// @namespace    https://greasyfork.org/en/users/1295753-sr-fox
// @donate       https://freebitco.in/?r=1393623
// @description  https://void-cla.github.io/criptovoid/
// @author       Sr.Fox
// @match        https://freebitco.in/*
// ==/UserScript==
 
function qSelector(selector) {
    return document.querySelector(selector);
}
 
function isHidden(el) {
    return (el.offsetParent === null);
}
 
// Script original para resolver CAPTCHA
(function() {
    'use strict';
 
    var domain = (window.location != window.parent.location) ? document.referrer.toString() : document.location.toString();
    // excluding domains
    if (
        domain.indexOf('example.com') == -1 &&
        domain.indexOf('PartOfUrlName') == -1 &&
        domain.indexOf('paypal.com') == -1
    ) {
        // HCAPTCHA SECTION
        const HC_PAUSE = "3000"; // ms to open (3000ms = 5sec)
        const HC_CHECK_BOX = "#checkbox";
        const HC_ARIA_CHECKED = "aria-checked";
 
        if (window.location.href.includes("checkbox")) {
            var hc_checkboxInterval = setInterval(function() {
                if (!qSelector(HC_CHECK_BOX)) {
                } else if (qSelector(HC_CHECK_BOX).getAttribute(HC_ARIA_CHECKED) == "true") {
                    clearInterval(hc_checkboxInterval);
                    console.log("HC SOLVED");
                } else if (!isHidden(qSelector(HC_CHECK_BOX)) && qSelector(HC_CHECK_BOX).getAttribute(HC_ARIA_CHECKED) == "false") {
                    qSelector(HC_CHECK_BOX).click();
                    clearInterval(hc_checkboxInterval);
                    console.log("HC OPEN BOX");
                } else {
                    return;
                }
            }, HC_PAUSE);
        }
 
        // RECAPTCHA SECTION
        const RC_PAUSE = "3000"; // ms to open (3000ms = 5sec)
        const CHECK_BOX = ".recaptcha-checkbox-border";
        const RECAPTCHA_STATUS = "#recaptcha-accessible-status";
        const DOSCAPTCHA = ".rc-doscaptcha-body";
 
        var rc_checkboxInterval = setTimeout(function() {
            var solved = false;
            var checkBoxClicked = false;
            var requestCount = 0;
 
            var recaptchaInitialStatus = qSelector(RECAPTCHA_STATUS) ? qSelector(RECAPTCHA_STATUS).innerText : "";
            function isHidden(el) {
                return (el.offsetParent === null);
            }
            try {
                if (!checkBoxClicked && qSelector(CHECK_BOX) && !isHidden(qSelector(CHECK_BOX))) {
                    qSelector(CHECK_BOX).click();
                    checkBoxClicked = true;
                    console.log("RC OPEN BOX");
                }
                // Check if the captcha is solved
                if (qSelector(RECAPTCHA_STATUS) && (qSelector(RECAPTCHA_STATUS).innerText != recaptchaInitialStatus)) {
                    solved = true;
                    console.log("RC SOLVED");
                }
                if (requestCount > 1) {
                    console.log("Attempted Max Retries. Stopping the solver");
                    solved = true;
                }
                // Stop solving when Automated queries message is shown
                if (qSelector(DOSCAPTCHA) && qSelector(DOSCAPTCHA).innerText.length > 0) {
                    console.log("Automated Queries Detected");
                }
            } catch (err) {
                console.log(err.message);
                console.log("An error occurred while solving. Stopping the solver.");
            }
        }, RC_PAUSE);
    } else {
        console.log(domain + " EXCLUDED!");
    }
})();
 
// Novo script para clicar em PLAY WITHOUT CAPTCHA e ROLL conforme o tempo
(function() {
    'use strict';
 
    $(document).ready(function() {
        console.log("Status: Pagina carregada.");
 
        // Após 5 segundos, o script tentará resolver o CAPTCHA (sem nenhuma alteração)
        setTimeout(function() {
            // Aqui iria a tentativa de resolver o CAPTCHA, mas foi dito para não alterar esse script
        }, 5000);
 
        // Após 7 segundos, haverá um "ROLL"
        setTimeout(function() {
            var rollButton = qSelector('#free_play_form_button');
            if (rollButton) {
                rollButton.click();
                console.log("Status: ROLL após 7 segundos.");
            } else {
                console.log("Botão ROLL não encontrado após 7 segundos.");
            }
        }, 7000);
 
        // Após 10 segundos, clicará em "PLAY WITHOUT CAPTCHA"
        setTimeout(function() {
            var playWithoutCaptchaButton = qSelector('#play_without_captchas_button');
            if (playWithoutCaptchaButton) {
                playWithoutCaptchaButton.click();
                console.log("Status: Clicado em PLAY WITHOUT CAPTCHA após 10 segundos.");
            } else {
                console.log("Botão PLAY WITHOUT CAPTCHA não encontrado após 10 segundos.");
            }
        }, 12000);
 
        // Após 13 segundos, haverá outro "ROLL"
        setTimeout(function() {
            var rollButton = qSelector('#free_play_form_button');
            if (rollButton) {
                rollButton.click();
                console.log("Status: ROLL após 13 segundos.");
            } else {
                console.log("Botão ROLL não encontrado após 13 segundos.");
            }
        }, 14000);
    });
 
    function random(min, max) {
        return min + (max - min) * Math.random();
    }
 
 
})();