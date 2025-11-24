import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, addLike, removeBlog, deletable }) => {
	const [detailsVisible, setDetailsVisible] = useState(false);
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};
	const showWhenVisible = { display: detailsVisible ? "" : "none" };
	return (
		<div style={blogStyle}>
			<div data-testid="header" id="header">
				<div>{blog.title}</div>
				<div>{blog.author}</div>
				<button
					className="showButton"
					onClick={() => setDetailsVisible(!detailsVisible)}
				>
					{detailsVisible ? "Hide" : "View"}
				</button>
			</div>
			<div data-testid="details" id="details" style={showWhenVisible}>
				<div>{blog.url}</div>
				<div>
					likes: {blog.likes}
					<button id="likeButton" onClick={addLike}>
						Like
					</button>
				</div>
				<div>{blog.user.username}</div>
				{deletable && (
					<button className="deleteButton" onClick={removeBlog}>
						Remove blog
					</button>
				)}
			</div>
		</div>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	addLike: PropTypes.func.isRequired,
	removeBlog: PropTypes.func.isRequired,
	deletable: PropTypes.bool.isRequired,
};
export default Blog;
