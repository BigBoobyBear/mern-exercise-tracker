import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { ACTION_TYPE } from "../constants";

const CreateEditExercise = ({ actionType }) => {
  const { id } = useParams();

  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [date, setDate] = useState(new Date());

  const [users, setUsers] = useState([]);

  useEffect(() => {
    actionType === ACTION_TYPE.edit &&
      fetch(`http://localhost:3001/exercises/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setUsername(data.username);
          setDescription(data.description);
          setDuration(data.duration);
          setDate(new Date(data.date));
        })
        .catch((err) => console.log(err));

    fetch("http://localhost:3001/users/")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setUsers(data.map((u) => u.username));
          actionType === ACTION_TYPE.create && setUsername(data[0].username);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const exercise = {
      username,
      description,
      duration,
      date,
    };

    console.log(exercise);

    fetch(
      `http://localhost:3001/exercises/${
        actionType === ACTION_TYPE.create ? "add" : "update/" + id
      }`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      }
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    window.location = "/";
  };

  return (
    <div>
      <h3>
        {actionType === ACTION_TYPE.create ? "Create New" : "Edit"} Exercise Log
      </h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <select
            required
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          >
            {users.map((user, idx) => (
              <option key={idx} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description: </label>
          <input
            type="text"
            required
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Duration (in minutes): </label>
          <input
            type="text"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker selected={date} onChange={(date) => setDate(date)} />
          </div>
        </div>

        <div className="form-group">
          <input
            type="submit"
            value={`${
              actionType === ACTION_TYPE.create ? "Create" : "Edit"
            } Exercise Log`}
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateEditExercise;
