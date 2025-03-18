import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import MapView from './components/MapView';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchForm />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;