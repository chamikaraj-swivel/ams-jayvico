import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import VehicleRecords from "./pages/VehicleRecords";
import CustomerManagement from "./pages/CustomerManagement";

function App() {
  return (
    <div className="App h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<VehicleRecords />} />
              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
