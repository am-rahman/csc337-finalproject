const newPostForm = document.getElementById("new-post-form");
const postList = document.getElementById("post-list");
const sidebar = document.getElementById("sidebar");

// Will update this later
// function getUser() {
//     const value = document.cookie;
//     const parts = value.split("user=");
//     const user = parts[1];
//
//     if(!user) {
//         document.getElementById("display-user").innerHTML = "<a href=\"/login\">Login</a>";
//         return;
//     }
//
//     document.getElementById("display-user").innerHTML = `Hey there, ${user}`;
//     const logout = document.getElementById("logout");
//     logout.innerHTML = "<a href=\"/login\">Logout</a>";
// }

// Submit new post form
newPostForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(newPostForm);
    const user = formData.get("user");
    const body = formData.get("body");
    fetch("/posts/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
    })
        .then((response) => response.json())
        .then((post) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${post.user}</strong> - ${post.body}`;
            postList.appendChild(li);
        })
        .catch((error) => {
            console.error(error);
        });
});

// Get all posts and display them
fetch("/posts/get")
    .then((response) => response.json())
    .then((posts) => {
        posts.forEach((post) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${post.user}</strong> - ${post.body}`;
            postList.appendChild(li);
        });
    })
    .catch((error) => {
        console.error(error);
    });
