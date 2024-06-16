import './App.css';
import {Home} from './components/home';
import {Login} from './components/login';
import {BrowserRouter as Router , Routes, Route, Link} from "react-router-dom"; 
import { Bill } from './components/bill';

import {View} from './components/View';


function App() {
  return (
    <div className="App">
      <Router>
        
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/Bill" element={<Bill/>} />
          <Route path="/View/:phone" element={<View/>} />


        </Routes>
      </Router>
    </div>
  );
}

export default App;
