const newPostForm = document.getElementById('new-post-form');
const postList = document.getElementById('post-list');

// Submit new post form
newPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(newPostForm);
    const title = formData.get('title');
    const body = formData.get('body');
    fetch('/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body })
    })
        .then(response => response.json())
        .then((post) => {
            const li = document.createElement('li');
            li.innerText = `${post.title} - ${post.body}`;
            postList.appendChild(li);
        })
        .catch((error) => {
            console.error(error);
        });
});

// Get all posts and display them
fetch('/posts')
    .then(response => response.json())
    .then((posts) => {
        posts.forEach((post) => {
            const li = document.createElement('li');
            li.innerText = `${post.title} - ${post.body}`;
            postList.appendChild(li);
        });
    })
    .catch((error) => {
        console.error(error);
    });
