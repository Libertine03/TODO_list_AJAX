# TODO_list_AJAX
a site with posts using AJAX technology and data from jsonplaceholder. (HTML, CSS, JavaScript)

To start working with the site, you need to download the repository, install node.js and enter the following two commands:
![Commands to start](https://github.com/Libertine03/TODO_list_AJAX/blob/Feature/Images/Commands_to_start.png)

## Site Features
**Main page**
![Main page](https://github.com/Libertine03/TODO_list_AJAX/blob/Feature/Images/Main_page.png)
This page displays posts from ***[jsonplaceholder/posts](https://jsonplaceholder.typicode.com/posts)***. You can delete them, edit them, or add them to important. In the header of the page, you can go to the tab for creating a new post. (the page does not reload at the same time, thanks to AJAX technology)

According to the standard, 15 posts are displayed. If you want to display more posts, change the ***posts_on_page*** parameter to the one you want (but no more than 100). This parameter is located in the file _script.js_ on line 27.

**Page for creating and editing posts**
![Create post](https://github.com/Libertine03/TODO_list_AJAX/blob/Feature/Images/Create_post_page.png)

On this page, you can fill out a form and send a request to the server to add a new post. The post will not be added to the server, of course, but a response will come from it, which means that the post has been successfully added. (just an imitation)

The form for _editing posts_ is similar to the form for creating. The response will also come from the server to the console.

**Change theme**
There is an opportunity to change the theme on the site. The button for changing the theme is located in the upper right corner. The current theme is stored in _localStorage_.