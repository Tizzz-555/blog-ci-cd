const loginWith = async (page, username, password) => {
	await page.getByTestId("username").fill(username);
	await page.getByTestId("password").fill(password);
	await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
	await page.getByRole("button", { name: "Create new blog" }).click();
	await page.getByTestId("title").fill(title);
	await page.getByTestId("author").fill(author);
	await page.getByTestId("url").fill(url);
	await page.getByRole("button", { name: "Create" }).click();
	await page.getByText(title, { exact: true }).waitFor();
};

const unpackBlog = async (page, title, url) => {
	const blogTitle = await page.getByText(title);
	const titleFather = await blogTitle.locator("..");
	await titleFather.getByRole("button", { name: "View" }).click();

	const blogUrl = await page.getByText(url);
	const urlFather = await blogUrl.locator("..");
	return urlFather;
};

const likeBlog = async (blog, likes) => {
	const likeButton = await blog.getByRole("button", { name: "Like" });
	for (let i = 0; i < likes; i++) {
		await blog.getByText(i).waitFor();
		likeButton.click();
		await blog.getByText(i + 1).waitFor();
	}
	await blog.getByText(likes).waitFor();
};

export { loginWith, createBlog, unpackBlog, likeBlog };
