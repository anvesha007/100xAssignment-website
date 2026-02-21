import { FaTrash } from "react-icons/fa";

function TopicCard({ topic, isAdmin, handleDelete }) {
  return (
    <div className="topicCard">
      <a href={topic.link} target="_blank" rel="noreferrer">
        {topic.text}
      </a>

      {isAdmin && (
        <FaTrash
          className="deleteIcon"
          onClick={() => handleDelete(topic._id)}
        />
      )}
    </div>
  );
}

export default TopicCard;