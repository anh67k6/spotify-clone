import './App.css';
import './output.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginComponent from './routes/Login';

function App() {
  return (
    <div className="w-screen h-screen">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HelloComponent />} />
          <Route path='/login' element={<LoginComponent />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const HelloComponent = () => {
  return <div>This is Hello from component</div>;
};

export default App;
