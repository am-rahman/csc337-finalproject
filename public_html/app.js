const newPostForm = document.getElementById("new-post-form");
const postList = document.getElementById("post-list");
const sidebar = document.getElementById("sidebar");


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
            li.className = "single-post";
            li.id = id=`${post._id}`;
            li.innerHTML = `${post.body}<br><br>
                            <div class="user">
                            <strong>-${post.user}</strong></div>
                            <button class="like-button" onclick="logID(this.parentNode.id)"
                            ><img src="/images/like.png"
                            width="25"
                            height="25"
                            ></button>`
            postList.appendChild(li);
        });
    })
    .catch((error) => {
        console.error(error);
    });


function logID(id) {
    console.log(id);
}
