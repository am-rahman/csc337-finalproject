const newPostForm = document.getElementById("search-form");
const postList = document.getElementById("user-list");


newPostForm.addEventListener("submit", (event) => {
    postList.innerHTML = "";
    event.preventDefault();
    const formData = new FormData(newPostForm);
    const searchTerm = formData.get("body");
    fetch(`/users/${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
            const users = data.users;
            
            users.forEach((user) => {
                const li = document.createElement("li");
                li.className = "single-user";
                li.innerHTML = `<div class="user">
                            <strong>${user.username}</strong></div>`
                postList.appendChild(li);
            });
        })
        .catch((error) => {
            console.error(error);
        });
});
