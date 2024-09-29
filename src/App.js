import { Toaster } from "react-hot-toast";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
  <>
  <Toaster position="top-right" toastOptions={{
    success : {
      theme : {
        backgroundColor: "#4aed88",
      
      }
    }
  }} />
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/:roomId" element={<Dashboard />}/>
      
      </Routes>
      </BrowserRouter>
  </>
  );
}

export default App;
