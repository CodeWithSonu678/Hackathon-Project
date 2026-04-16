function loadHTML(id, file) {
        fetch(file)
                .then(response => response.text())
                .then(data => {
                        console.log(data)
                        document.getElementById(id).innerHTML = data;

                        initNavbar();
                });
}

document.addEventListener("DOMContentLoaded", () => {
        loadHTML("header", "nav.html");
        loadHTML("footer", "foot.html");
});