import "./App.css";
import Card from "./components/Card";
import Map from "./components/Map";
import { MapProvider } from "./context/MapContext";
import { useState } from "react";

function App() {
  const [location, setLocation] = useState(null);
  return (
    <MapProvider>
      <div className="App">
        <Card />
        <Map location={location} setLocation={setLocation} />
      </div>
    </MapProvider>
  );
}

export default App;
