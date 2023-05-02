// Get the posts and display them on the page
function displayPosts() {
    fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById('posts');
            postsList.innerHTML = '';
            posts.forEach(post => {
                const li = document.createElement('li');
                li.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.body}</p>
        `;
                postsList.appendChild(li);
            });
        });
}

// Handle form submission to create a new post
function createPost(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const data = { title, body };
    fetch('/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(post => {
            const postsList = document.getElementById('posts');
            const li = document.createElement('li');
            li.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
      `;
            postsList.appendChild(li);
            document.getElementById('new-post-form').reset();
        });
}

// Display the initial list of posts
displayPosts();

// Add a submit event listener to the form
const form = document.getElementById('new-post-form');
form.addEventListener('submit', createPost);
