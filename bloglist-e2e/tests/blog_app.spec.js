const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog, unpackBlog, likeBlog } = require("./helper");

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/users", {
			data: {
				username: "Tiuz",
				name: "Matteo",
				password: "Zanetti",
			},
		});
		await request.post("/api/users", {
			data: {
				username: "Tizz",
				name: "Mattia",
				password: "Maldini",
			},
		});
		await page.goto("/");
	});

	test("Login form is shown", async ({ page }) => {
		const locator = await page.getByText("Log in to application");
		await expect(locator).toBeVisible();
		await expect(page.getByTestId("username")).toBeVisible();
		await expect(page.getByTestId("password")).toBeVisible();
		await expect(page.getByRole("button", { name: "login" })).toBeVisible();
	});

	describe("Login", () => {
		test("succeeds with correct credentials", async ({ page }) => {
			await loginWith(page, "Tiuz", "Zanetti");

			const okDiv = await page.locator(".ok");
			await expect(okDiv).toContainText("User Tiuz successfully logged in");
			await expect(okDiv).toHaveCSS("border-style", "solid");
			await expect(okDiv).toHaveCSS("color", "rgb(0, 128, 0)");
			await expect(page.getByText("Matteo logged in")).toBeVisible();
		});

		test("fails with wrong credentials", async ({ page }) => {
			await loginWith(page, "Tiuz", "Maldini");

			const errorDiv = await page.locator(".error");
			await expect(errorDiv).toContainText("Wrong username or password");
			await expect(errorDiv).toHaveCSS("border-style", "solid");
			await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
			await expect(page.getByText("Matteo logged in")).not.toBeVisible();
		});
	});

	describe("when logged in", () => {
		beforeEach(async ({ page }) => {
			await loginWith(page, "Tiuz", "Zanetti");
		});

		test("a new blog can be created", async ({ page }) => {
			await createBlog(page, "Tituli", "Moufrinho", "www.amala.it");
			await expect(
				page.getByText("A new blog Tituli by Moufrinho added")
			).toBeVisible();
		});

		describe("and a blog exists", () => {
			beforeEach(async ({ page }) => {
				await createBlog(page, "Zamorano", "Moratti", "www.maiinb.org");
				await createBlog(page, "Djorkaeff", "Moratti", "www.zioliga.it");
				await createBlog(page, "El Principe", " Moufrinho", "www.amala.it");
				await page.goto("/");
			});

			test("a blog can be liked", async ({ page }) => {
				const secondBlogChild = await unpackBlog(
					page,
					"Djorkaeff",
					"www.zioliga.it"
				);
				await expect(secondBlogChild.getByText("0")).toBeVisible();
				await secondBlogChild.getByRole("button", { name: "Like" }).click();
				await expect(secondBlogChild.getByText("1")).toBeVisible();
			});

			test("a blog can be deleted by its author", async ({ page }) => {
				const firstBlogChild = await unpackBlog(
					page,
					"Zamorano",
					"www.maiinb.org"
				);
				page.on("dialog", (dialog) => dialog.accept());
				await firstBlogChild
					.getByRole("button", {
						name: "Remove blog",
					})
					.click();
				await expect(page.getByText("Zamorano")).not.toBeVisible();
			});

			test("only the author's blog sees the delete button", async ({
				page,
			}) => {
				await page.getByRole("button", { name: "Logout" }).click();
				await loginWith(page, "Tizz", "Maldini");
				await expect(page.getByText("Mattia logged in")).toBeVisible();
				const firstBlogChild = await unpackBlog(
					page,
					"Zamorano",
					"www.maiinb.org"
				);

				await expect(
					firstBlogChild.getByRole("button", { name: "Remove blog" })
				).not.toBeVisible();
			});

			test("the blogs are ordered by likes", async ({ page }) => {
				await expect(page.getByTestId("header")).toContainText([
					"Zamorano",
					"El Principe",
				]);
				const firstBlogChild = await unpackBlog(
					page,
					"Zamorano",
					"www.maiinb.org"
				);
				const secondBlogChild = await unpackBlog(
					page,
					"Djorkaeff",
					"www.zioliga.it"
				);
				const thirdBlogChild = await unpackBlog(
					page,
					"El principe",
					"www.amala.it"
				);

				await likeBlog(firstBlogChild, 1);
				await likeBlog(secondBlogChild, 3);
				await likeBlog(thirdBlogChild, 2);

				await expect(page.getByTestId("header")).toContainText([
					"Djorkaeff",
					"Zamorano",
				]);
			});
		});
	});
});
