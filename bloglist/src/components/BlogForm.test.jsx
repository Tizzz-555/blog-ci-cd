import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { expect } from "vitest";

// Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
	let container;
	const user = userEvent.setup();
	const createBlog = vi.fn();
	container = render(<BlogForm createABlog={createBlog} />).container;

	const titleInput = container.querySelector("#formTitle");
	const authorInput = screen.getByPlaceholderText("The post author");
	const urlInput = container.querySelector("#formUrl");
	const sendButton = screen.getByText("Create");

	await user.type(titleInput, "testing title...");
	await user.type(authorInput, "testing author...");
	await user.type(urlInput, "testing url...");
	await user.click(sendButton);

	expect(createBlog.mock.calls).toHaveLength(1);
	expect(createBlog.mock.calls[0][0].title).toBe("testing title...");
	expect(createBlog.mock.calls[0][0].author).toBe("testing author...");
	expect(createBlog.mock.calls[0][0].url).toBe("testing url...");
});
