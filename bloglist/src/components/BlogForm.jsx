import { useState } from "react";

const BlogForm = ({ createABlog }) => {
	const [newTitle, setNewTitle] = useState("");
	const [newAuthor, setNewAuthor] = useState("");
	const [newUrl, setNewUrl] = useState("");

	const addBlog = (e) => {
		e.preventDefault();
		createABlog({ title: newTitle, author: newAuthor, url: newUrl });

		setNewTitle("");
		setNewAuthor("");
		setNewUrl("");
	};

	return (
		<div>
			<h2>Create new</h2>
			<form onSubmit={addBlog}>
				<div>
					Title:{" "}
					<input
						data-testid="title"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						id="formTitle"
						placeholder="The post title"
					/>
				</div>
				<div>
					Author:{" "}
					<input
						data-testid="author"
						value={newAuthor}
						onChange={(e) => setNewAuthor(e.target.value)}
						id="formAuthor"
						placeholder="The post author"
					/>
				</div>
				<div>
					Url:{" "}
					<input
						data-testid="url"
						value={newUrl}
						onChange={(e) => setNewUrl(e.target.value)}
						id="formUrl"
						placeholder="The post link"
					/>
				</div>
				<button type="submit">Create</button>
			</form>
		</div>
	);
};

export default BlogForm;
