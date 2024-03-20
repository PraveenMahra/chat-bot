/* eslint-disable react/prop-types */

function Sidebar({ savedChats, onChatSelect, onDeleteChat }) {
  return (
    <div>
      <h2 className="sidebar-heading"> Chat list</h2>
      <ul className="sidebar-ul">
        {savedChats.map((chat) => (
          <li className="sidebar-li" key={chat.id}>
            <span onClick={() => onChatSelect(chat)}>Chat {chat.id}</span>
            <i
              onClick={() => onDeleteChat(chat)}
              className="delete-btn fa-solid fa-trash"
            ></i>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
