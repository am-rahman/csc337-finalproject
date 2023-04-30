const newPostForm = document.getElementById('new-post-form');
const postList = document.getElementById('post-list');

// Submit new post form
newPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(newPostForm);
    const user = formData.get('user');
    const body = formData.get('body');
    fetch('/posts/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, body })
    })
        .then(response => response.json())
        .then((post) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${post.user}</strong> - ${post.body}`;
            postList.appendChild(li);
        })
        .catch((error) => {
            console.error(error);
        });
});

// Get all posts and display them
fetch('/posts/get')
    .then(response => response.json())
    .then((posts) => {
        posts.forEach((post) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${post.user}</strong> - ${post.body}`;
            postList.appendChild(li);
        });
    })
    .catch((error) => {
        console.error(error);
    });
