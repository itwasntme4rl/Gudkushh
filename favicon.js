// favicon.js

function updateFavicon(iconPath) {
    const link = document.querySelector("link[rel*='icon']");
    if (link) {
        link.href = iconPath;
    }
}

function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
        updateFavicon('green.ico');
    } else {
        updateFavicon('red.ico');
    }
}

handleVisibilityChange();
document.addEventListener('visibilitychange', handleVisibilityChange);