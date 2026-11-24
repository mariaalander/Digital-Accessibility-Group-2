const easyToggle = document.getElementById("easy-toggle");
const easySuffix = "_lättläst";

// Kontrollera om en adress leder till en lättläst sida.
function isEasyPage(url) {
    return decodeURIComponent(url.pathname)
        .endsWith(easySuffix + ".html");
}

// Byt mellan vanlig och lättläst fil.
function getPageVersion(url, easy) {
    const newUrl = new URL(url.href);

    let path = decodeURIComponent(newUrl.pathname);

    // Hantera startsidan även när index.html inte syns i adressen.
    if (path.endsWith("/")) {
        path += "index.html";
    }

    // Ta bort eventuell lättläst-ändelse.
    path = path.replace(/_lättläst\.html$/, ".html");

    // Lägg till ändelsen om lättläst är aktiverat.
    if (easy) {
        path = path.replace(/\.html$/, "_lättläst.html");
    }

    newUrl.pathname = path;

    return newUrl;
}

const currentUrl = new URL(window.location.href);
const easyMode = isEasyPage(currentUrl);

// Spara aktuellt läge.
try {
    localStorage.setItem("easyRead", String(easyMode));
} catch (error) {
    // Funktionen fungerar även utan localStorage.
}

// Uppdatera reglagets utseende och tillgänglighet.
if (easyToggle) {
    easyToggle.setAttribute("aria-checked", String(easyMode));

    easyToggle.querySelector(".toggle-status").textContent =
        easyMode ? "På" : "Av";

    // Byt sida när användaren trycker på reglaget.
    easyToggle.addEventListener("click", function () {
        const newMode = !easyMode;

        try {
            localStorage.setItem("easyRead", String(newMode));
        } catch (error) {
            // Sidbytet fungerar ändå.
        }

        window.location.href =
            getPageVersion(currentUrl, newMode).href;
    });
}

// Anpassa alla interna länkar till aktuellt läge.
document.querySelectorAll("a[href]").forEach(function (link) {
    const href = link.getAttribute("href");

    // Hoppa över ankarlänkar och nedladdningar.
    if (!href || href.startsWith("#") || link.hasAttribute("download")) {
        return;
    }

    const url = new URL(href, window.location.href);

    // Ändra inte länkar till externa webbplatser.
    if (url.origin !== window.location.origin) {
        return;
    }

    // Ändra endast HTML-sidor.
    if (!url.pathname.endsWith(".html")) {
        return;
    }

    link.href = getPageVersion(url, easyMode).href;
});