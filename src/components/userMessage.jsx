// eslint-disable-next-line react/prop-types
export default function UserMessage({ text }) {
  return (
    <div className="message-container">
      <div className="user-message">{text}</div>
    </div>
  );
}
