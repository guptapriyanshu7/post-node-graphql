import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Posts from './components/Posts';

function App() {
  return (
    <div className='App'>
      <h1>Hello World</h1>
      <Login />
      <Register />
      <Posts />
    </div>
  );
}

export default App;
