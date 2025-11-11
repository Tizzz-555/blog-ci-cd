const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const {
  listWithNoBlogs,
  listWithOneBlog,
  blogs,
} = require("../data/blogsData");

describe("most blogs", () => {
  const testResult = {
    author: "Edsger W. Dijkstra",
    blogs: 1,
  };

  test("when list has only one blog, return the author and count 1 blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    assert.deepStrictEqual(result, testResult);
  });

  test("when list has many blogs, return the author who wrote the most and how many he wrote", () => {
    const result = listHelper.mostBlogs(blogs);
    const testResult = {
      author: "Robert C. Martin",
      blogs: 3,
    };
    assert.deepStrictEqual(result, testResult);
  });

  test("when list has no blogs, return an error message", () => {
    const result = listHelper.mostBlogs(listWithNoBlogs);
    assert.strictEqual(result, "There are no blog posts");
  });
});
