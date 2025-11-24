import loginService from "../services/login";
import blogService from "../services/blogs";

const Login = (props) => {
	const {
		setUser,
		username,
		setUsername,
		password,
		setPassword,
		setOkMessage,
		setErrorMessage,
	} = props;

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({
				username,
				password,
			});
			window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
			setOkMessage(`User ${username} successfully logged in`);
			setTimeout(() => {
				setOkMessage(null);
			}, 5000);
			setUsername("");
			setPassword("");
		} catch (e) {
			setErrorMessage("Wrong username or password");
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	return (
		<form onSubmit={handleLogin}>
			<div>
				username
				<input
					data-testid="username"
					type="text"
					value={username}
					name="Username"
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				password
				<input
					data-testid="password"
					type="password"
					value={password}
					name="Password"
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type="submit">login</button>
		</form>
	);
};

export default Login;
