const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = form.elements["username"].value;
    const password = form.elements["password"].value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        });

        if (response.ok) {
            window.location.replace("/");
        } else {
            const error = await response.text();
            throw new Error(error);
        }
    } catch (err) {
        errorMessage.textContent = err.message;
    }
});