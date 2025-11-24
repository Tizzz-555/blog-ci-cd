const Notification = ({ okMessage, errorMessage }) => {
	if (!okMessage && !errorMessage) {
		return null;
	}
	if (errorMessage) {
		return <div className="error">{errorMessage}</div>;
	} else {
		return <div className="ok">{okMessage}</div>;
	}
};

export default Notification;
