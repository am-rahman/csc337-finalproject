/**
 * This file that handles user login. When the user submits the login form,
 * the event listener sends an asynchronous POST request to the server with
 * the user's entered credentials. If the server returns a successful response,
 * the user is redirected to the home page. If the server returns an error
 * response, the error message is displayed on the page.
 * 
 */
const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

// Submit event listener for the form
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
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (err) {
        errorMessage.textContent = err.message;
    }
});