import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Artist from "./pages/Artist";
import Album from "./pages/Album";
import Error from "./pages/Error";



function App() {
  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/album" element={<Album />} />
        <Route path="/track" element={<Error />} />
        <Route path="/callerTune" element={<Error />} />
        <Route path="/repertoire" element={<Error />} />
        <Route path="/newSongs" element={<Error />} />
        <Route path="/resource" element={<Error />} />
        <Route path="/contact" element={<Error />} />
      </Routes>
    </>

  );
}

export default App;
