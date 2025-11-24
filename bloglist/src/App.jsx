import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Login from "./components/Login";
import blogService from "./services/blogs";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [okMessage, setOkMessage] = useState(null);

	const blogFormRef = useRef();

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	useEffect(() => {
		const fetchBlogs = async () => {
			const initialBlogs = await blogService.getAll();
			const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes);
			setBlogs(sortedBlogs);
		};
		fetchBlogs();
	}, []);

	const addBlog = async (blogObject) => {
		blogFormRef.current.toggleVisibility();
		try {
			const returnedBlog = await blogService.createBlog(blogObject);
			setBlogs(blogs.concat(returnedBlog));
			setOkMessage(
				`A new blog ${blogObject.title} by ${blogObject.author} added`
			);
			setTimeout(() => {
				setOkMessage(null);
			}, 5000);
		} catch (error) {
			console.error("Error adding blog:", error);
			setErrorMessage(
				error?.response?.data?.error ||
					"An error occurred while adding the blog"
			);
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	const addLikeTo = async (blogObject) => {
		const id = blogObject.id;
		const updatedBlog = { ...blogObject, likes: blogObject.likes + 1 };
		const returnedBlog = await blogService.updateBlog(id, updatedBlog);
		setBlogs(
			blogs
				.map((blog) => (blog.id !== id ? blog : returnedBlog))
				.sort((a, b) => b.likes - a.likes)
		);
	};

	const deleteABlog = async (id) => {
		const blogToDelete = blogs.find((b) => b.id === id);

		if (
			window.confirm(
				`Remove '${blogToDelete.title}' by ${blogToDelete.author}?`
			)
		) {
			try {
				await blogService.deleteBlog(id);
				setBlogs(blogs.filter((b) => b.id !== id));
				setOkMessage(`Deleted ${blogToDelete.title}`);
				setTimeout(() => {
					setOkMessage(null);
				}, 2000);
			} catch (error) {
				console.error("Error deleting the blog:", error);
				setErrorMessage(
					error?.response?.data?.error ||
						"An error occurred while deleting the blog"
				);
				setTimeout(() => {
					setErrorMessage(null);
				}, 2000);
			}
		}
	};

	const logoutUser = () => {
		window.localStorage.removeItem("loggedBlogAppUser");
		setUser(null);
	};

	if (user === null) {
		return (
			<>
				<h2>Log in to application</h2>
				<Notification errorMessage={errorMessage} />

				<Login
					username={username}
					setUsername={setUsername}
					password={password}
					setPassword={setPassword}
					user={user}
					setUser={setUser}
					errorMessage={errorMessage}
					setOkMessage={setOkMessage}
					setErrorMessage={setErrorMessage}
				/>
			</>
		);
	}

	return (
		<div>
			<h2>Blogs</h2>
			<Notification okMessage={okMessage} errorMessage={errorMessage} />
			<p>
				{user.name} logged in
				<button onClick={logoutUser}>Logout</button>
			</p>
			<Togglable buttonLabel="Create new blog" ref={blogFormRef}>
				<BlogForm createABlog={addBlog} />
			</Togglable>
			{blogs.map((blog) => (
				<Blog
					key={blog.id}
					blog={blog}
					addLike={() => addLikeTo(blog)}
					removeBlog={() => deleteABlog(blog.id)}
					deletable={user.username === blog.user.username}
				/>
			))}
		</div>
	);
};

export default App;
