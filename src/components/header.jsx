/* eslint-disable react/prop-types */

function Header({ onSaveChat, onNewChat }) {
  const handleButtonClick = () => {
    if (onSaveChat) {
      onSaveChat();
    }
    if (onNewChat) {
      onNewChat();
    }
  };

  return (
    <div className="header">
      <h1>ChatApp</h1>
      <button className="header-btn" onClick={handleButtonClick}>
        New Chat
      </button>
    </div>
  );
}

export default Header;
