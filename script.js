const postForm = document.getElementById('post-form');
const postList = document.getElementById('post-list');

document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.querySelector('.content');
    const navLinks = document.querySelectorAll('.nav-link');
    const loadingOverlay = document.querySelector('.loading-overlay');
    var important_posts = [];
    var not_important_posts = [];

    const showLoadingOverlay = () => {
        loadingOverlay.style.opacity = '1';
    };
    const hideLoadingOverlay = () => {
        loadingOverlay.style.opacity = '0';
    };

    const loadScripts = (url) => {
        if(url.includes('create'))
        {
            sendDataToServer('btn-submit');
        }
        else if(url.includes('index'))
        {
            important_posts = [];
            not_important_posts = [];
                for(index = 0; index < 5; index++)
                {
                    const curr_index = index + 1;

                    const post = document.createElement('div');
                    post.classList.add('post');

                    const Author = document.createElement('h3');

                    const postTitle = document.createElement('h3');
                    
                    const postContent = document.createElement('p');
                    
                    getPosts(post, Author, postTitle, postContent, index);

                    const deleteButton = document.createElement('button');  
                    deleteButton.classList.add('btn-delete');
                    deleteButton.textContent = 'Удалить';
                    deleteButton.addEventListener('click', () => {
                        document.getElementById(post.id).remove();  
                    });

                    const editButton = document.createElement('button');
                    editButton.classList.add('btn-edit');
                    editButton.textContent = 'Редактировать';
                    editButton.addEventListener('click', () => {
                        document.location.href = 'editPost.html';
                        sessionStorage.setItem('current_page', post.id);
                    });

                    const importantButton = document.createElement('button');
                    importantButton.id = curr_index;
                    importantButton.classList.add('btn-important');
                    importantButton.textContent = 'Важное';
                    importantButton.addEventListener('click', () => {
                        localStorage.setItem('important_'+post.id, post.id);
                        document.getElementById(post.id).style.background = 'teal';
                        importantButton.style.display = 'none';

                        deleteFromImportantButton.style.display = 'inline';
                        post.appendChild(deleteFromImportantButton);
                    });

                    const deleteFromImportantButton = document.createElement('button');
                    deleteFromImportantButton.id = curr_index;
                    deleteFromImportantButton.classList.add('btn-important');
                    deleteFromImportantButton.textContent = 'Удалить из важного';
                    deleteFromImportantButton.addEventListener('click', () => {

                        var confirming = confirm("Вы действительно хотите удалить из важного пост?")
                        if(confirming)
                        {   
                            localStorage.removeItem('important_'+post.id, post.id);
                            document.getElementById(post.id).style.background = '#fdc613';
                            deleteFromImportantButton.style.display = 'none';

                            importantButton.style.display = 'inline';
                            post.appendChild(importantButton);
                        }
                        else
                        {
                            console.log('Отмена подтверждения');
                        }
                    });

                    post.appendChild(Author);
                    post.appendChild(postTitle);
                    post.appendChild(postContent);
                    post.appendChild(deleteButton);
                    post.appendChild(editButton);

                    if(curr_index == localStorage.getItem('important_'+curr_index))
                    {
                        post.appendChild(deleteFromImportantButton);
                        post.style.background = 'teal';
                        important_posts.push(post);
                    }
                    else{
                        post.appendChild(importantButton);
                        not_important_posts.push(post);
                    }
                }

                for(imp_post = 0; imp_post < important_posts.length; imp_post++)
                {
                    document.getElementById('post-list').appendChild(important_posts[imp_post]);
                }
                
                for(not_imp_posts = 0; not_imp_posts < not_important_posts.length; not_imp_posts++)
                {
                    document.getElementById('post-list').appendChild(not_important_posts[not_imp_posts]);
                }
        }
        else if(url.includes('edit'))
        {
            const current_page = sessionStorage.getItem('current_page');

            getAnyPost(current_page);
            sendDataToServer('btn-edit');
        }
    };

    const loadPage = (url) => {
        showLoadingOverlay();

        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.querySelector('.content').innerHTML;

                contentDiv.classList.add('fade-out');

                contentDiv.innerHTML = newContent;
                document.title = doc.title;

                setTimeout(() => {
                    contentDiv.classList.remove('fade-out');
                    history.pushState({}, '', url);
                    hideLoadingOverlay();
                }, 500);
            })
            .then(() => {
                loadScripts(url);
            });
    };

    navLinks.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.currentTarget.getAttribute('href');
            showLoadingOverlay();
            loadPage(url);
        })
    });

    loadPage(window.location.pathname);

    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });
}); 


function getPosts(post_, author_, title_, content_, postIndex)
{
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const posts = JSON.parse(xhr.responseText);

            post_.id = posts[postIndex].id;
            getAuthor(posts[postIndex].userId, author_);
            title_.textContent = 'Название: '+ posts[postIndex].title;
            content_.textContent = 'Содержание: '+ posts[postIndex].body;
        }
    };

    xhr.open('GET', apiUrl, true);
    xhr.send();
}

function getAuthor(user_id, author_name)
{
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const users = JSON.parse(xhr.responseText);

            author_name.textContent = 'Автор: '+ users[user_id-1].name;
        }
    };

    xhr.open('GET', apiUrl, true);
    xhr.send();
}

function getAnyPost(page_index)
{
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts/'+page_index;
    const xhr = new XMLHttpRequest();
                
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const post = JSON.parse(xhr.responseText);

            //getAuthor(page_index);
            document.getElementById('author').value = post.userId; 
            document.getElementById('title').value = post.title;
            document.getElementById('content').value = post.body;
        }
    }; 
    xhr.open('GET', apiUrl, true);
    xhr.send();
}

function sendDataToServer(button_id)
{
    document.getElementById(button_id).addEventListener('click', (event) => {
        event.preventDefault();

        const _author = document.getElementById('author').value;
        const _title = document.getElementById('title').value;
        const _content = document.getElementById('content').value;

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify ({
                title: _title,
                body: _content,
                userId: _author
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log('response:' +JSON.stringify(json));
        })
        .then(setTimeout(() => window.location.href='index.html', 3000));
    });
}