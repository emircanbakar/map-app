import "./App.css";
import Card from "./components/Card";
import DataPanel from "./components/DataPanel";
import Map from "./components/Map";
import { MapProvider } from "./context/MapContext";

function App() {
  return (
    <MapProvider>
      <div className="App">
        <DataPanel />
        <Card />
        <Map/>
      </div>
    </MapProvider>
  );
}

export default App;
