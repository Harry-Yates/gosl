import React, { useState, useEffect } from "react";
import TubeStopInput from "../components/TubeStopInput";
import stations from "../data/stockholmTubeStops.json";
import { FaPlus } from "react-icons/fa";

const HomePage: React.FC = () => {
  const [tubeStops, setTubeStops] = useState([
    { title: "Home", isEditing: false },
    { title: "Work", isEditing: false },
  ]);

  useEffect(() => {
    const savedTubeStops = JSON.parse(
      localStorage.getItem("tubeStops") || "[]"
    );
    if (savedTubeStops.length > 0) {
      setTubeStops(savedTubeStops);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tubeStops", JSON.stringify(tubeStops));
  }, [tubeStops]);

  const addTubeStop = () => {
    setTubeStops([...tubeStops, { title: "Custom", isEditing: true }]);
  };

  const deleteTubeStop = (index: number) => {
    const newTubeStops = [...tubeStops];
    newTubeStops.splice(index, 1);
    setTubeStops(newTubeStops);
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const newTubeStops = [...tubeStops];
    newTubeStops[index] = {
      ...newTubeStops[index],
      title: newTitle,
      isEditing: false,
    };
    setTubeStops(newTubeStops);
  };

  const toggleEdit = (index: number) => {
    const newTubeStops = [...tubeStops];
    newTubeStops[index].isEditing = !newTubeStops[index].isEditing;
    setTubeStops(newTubeStops);
  };

  return (
    <>
      {tubeStops.map((tubeStop, index) => (
        <div key={index}>
          {tubeStop.isEditing ? (
            <input
              type="text"
              defaultValue={tubeStop.title}
              onBlur={(e) => handleTitleChange(index, e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" &&
                handleTitleChange(index, e.currentTarget.value)
              }
              autoFocus
            />
          ) : (
            <div onDoubleClick={() => toggleEdit(index)}>
              <TubeStopInput
                title={tubeStop.title}
                stations={stations}
                onDelete={() => deleteTubeStop(index)}
              />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addTubeStop}
        className="homepage__add-button">
        <FaPlus />
      </button>
    </>
  );
};

export default HomePage;
