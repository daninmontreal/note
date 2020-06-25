
var me;

function startMe() {
    me = document.getElementById("me");
    navigator.getUserMedia(
        { video: {} },
        stream => me.srcObject = stream,
        err => console.error(err)
    );
}

if (document.readyState != 'loading') {
    startMe();
} else {
    window.addEventListener('DOMContentLoaded', () => {
        startMe();
    });
}