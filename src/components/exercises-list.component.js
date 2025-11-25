import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ExercisesList = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/exercises/")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setExercises(data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const deleteExercise = (id) => {
    fetch(`http://localhost:3001/exercises/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    setExercises((prev) => prev.filter((e) => e._id !== id));
  };

  const exerciseList = () =>
    exercises.map((e) => (
      <Exercise key={e._id} exercise={e} deleteExercise={deleteExercise} />
    ));

  return (
    <div>
      <h3>Logged Exercises</h3>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Username</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{exerciseList()}</tbody>
      </table>
    </div>
  );
};

const Exercise = ({ exercise, deleteExercise }) => (
  <tr>
    <td>{exercise.username}</td>
    <td>{exercise.description}</td>
    <td>{exercise.duration}</td>
    <td>{exercise.date.substr(0, 10)}</td>
    <td>
      <Link to={`/edit/${exercise._id}`}>Edit</Link> |{" "}
      <input
        type="button"
        value="Delete"
        className="btn btn-primary btn-sm"
        style={{ marginTop: -4 }}
        onClick={() => deleteExercise(exercise._id)}
      />
    </td>
  </tr>
);

export default ExercisesList;
