import Card from "./Card";

function About() {
  return (
    <section className="about">
      <h2>Backend Modules</h2>
      <p className="about-subtitle">
        Basic CRUD endpoints built in Express for users, products, and orders.
      </p>
      <div className="cards-container">
        <Card
          title="Users"
          description="Manage user records"
          endpoints={[
            "GET /users",
            "POST /users",
            "PUT /users/:id",
            "DELETE /users/:id",
          ]}
        />
        <Card
          title="Products"
          description="Manage product catalog"
          endpoints={[
            "GET /products",
            "POST /products",
            "PUT /products/:id",
            "DELETE /products/:id",
          ]}
        />
        <Card
          title="Orders"
          description="Create and update orders"
          endpoints={[
            "GET /orders",
            "POST /orders",
            "PUT /orders/:id",
            "DELETE /orders/:id",
          ]}
        />
      </div>
    </section>
  );
}

export default About;
