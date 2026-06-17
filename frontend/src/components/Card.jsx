function Card({ title, description, endpoints = [] }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {endpoints.map((endpoint) => (
          <li key={endpoint}>{endpoint}</li>
        ))}
      </ul>
    </div>
  );
}

export default Card;
