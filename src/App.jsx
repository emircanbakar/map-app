import "./App.css";
import Card from "./components/Card";
import Map from "./components/Map";
import { MapProvider } from "./context/MapContext";

function App() {
  return (
    <MapProvider>
      <div className="App">
        <Card />
        <Map />
      </div>
    </MapProvider>
  );
}

export default App;
