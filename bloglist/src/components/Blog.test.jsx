import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
	let container;
	const blog = {
		title: "Test",
		author: "Testone",
		url: "www.test.te",
		likes: "4",
		user: {
			username: "Tizzz",
			name: "Mattia",
			id: "667d908773d4e0852d6017b5",
		},
	};

	const mockHandler = vi.fn();
	beforeEach(() => {
		container = render(<Blog blog={blog} addLike={mockHandler} />).container;
	});

	test("renders header, at start details are not displayed", () => {
		const details = container.querySelector("#details");
		const header = container.querySelector("#header");
		expect(header).toBeDefined();
		expect(details).toHaveStyle("display: none");
	});

	test("after clicking the button, details are displayed", async () => {
		const user = userEvent.setup();
		const button = container.querySelector(".showButton");
		const details = container.querySelector("#details");
		await user.click(button);
		expect(details).not.toHaveStyle("display: none");
	});

	test("if like button is clicked twice, addLike is called twice", async () => {
		const user = userEvent.setup();
		const button = container.querySelector("#likeButton");
		await user.dblClick(button);
		expect(mockHandler.mock.calls).toHaveLength(2);
	});
});
