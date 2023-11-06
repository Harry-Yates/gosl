import TubeStopInput from "../components/TubeStopInput";
import stations from "../data/stockholmTubeStops.json";

const HomePage: React.FC = () => {
  return (
    <>
      <TubeStopInput
        title="Home"
        stations={stations}
      />
      <TubeStopInput
        title="Work"
        stations={stations}
      />
      {/* <TubeStopInput title="Add +" stations={stations}/> */}
    </>
  );
};

export default HomePage;
