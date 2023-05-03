/**
 * This file handles the form submission of creating a new user account.
 * It listens to the submit event on the form, extracts the input values,
 * sends a POST request to the server with the input values in JSON format,
 * and then handles the server's response accordingly. If there is an
 * error, it displays the error message on the page.
 *
 */
const form = document.getElementById("create-user-form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = form.elements["username"].value;
    const password = form.elements["password"].value;
    const email = form.elements["email"].value;

    try {
        const response = await fetch("/users/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email }),
            credentials: "include",
        });

        if (response.ok) {
            errorMessage.style.color = "#16A190";
            errorMessage.textContent = "Account created! Taking you to login..."
            setTimeout(redirectToLogin, 2500);
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (err) {
        errorMessage.textContent = err.message;
    }
});

function redirectToLogin() {
    window.location.replace("/login");
}