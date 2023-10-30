import TubeStopInput from "../components/TubeStopInput";

const HomePage: React.FC = () => {
  return (
    <>
      <TubeStopInput
        title="Home"
        defaultStop="Gubbängen"
      />
      {/* <TubeStopInput
        title="Work"
        defaultStop="Odenplan"
      /> */}
      {/* <TubeStopInput title="Add +" /> */}
    </>
  );
};

export default HomePage;
