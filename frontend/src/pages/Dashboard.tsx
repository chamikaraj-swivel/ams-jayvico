import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Dashboard: React.FC = () => {
  const { vehicles } = useSelector((state: RootState) => state.vehicles);
  const { customers } = useSelector((state: RootState) => state.customers);

  const stats = [
    {
      title: "Total Vehicles",
      value: vehicles.length,
      icon: "🚗",
      color: "primary",
      bgColor: "bg-primary-500",
    },
    {
      title: "Total Customers",
      value: customers.length,
      icon: "👥",
      color: "success",
      bgColor: "bg-success-500",
    },
    {
      title: "Pending Orders",
      value: vehicles.filter((v) => v.status === "pending").length,
      icon: "⏳",
      color: "warning",
      bgColor: "bg-warning-500",
    },
    {
      title: "In Transit",
      value: vehicles.filter((v) => v.status === "in-transit").length,
      icon: "🚛",
      color: "accent",
      bgColor: "bg-accent-500",
    },
  ];

  const pipelineSteps = [
    { step: 1, name: "Order Placed", status: "completed" },
    { step: 2, name: "Payment Received", status: "completed" },
    { step: 3, name: "Vehicle Sourced", status: "current" },
    { step: 4, name: "Auction Won", status: "pending" },
    { step: 5, name: "Export Documents", status: "pending" },
    { step: 6, name: "Shipping Arranged", status: "pending" },
    { step: 7, name: "In Transit", status: "pending" },
    { step: 8, name: "Port Arrival", status: "pending" },
    { step: 9, name: "Customs Clearance", status: "pending" },
    { step: 10, name: "Delivery", status: "pending" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="heading-1">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="btn-primary">Add Vehicle</button>
          <button className="btn-outline">Export Report</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-primary-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center text-white text-xl`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Overview */}
      <div className="card-elevated">
        <h2 className="heading-3 mb-6">Import Pipeline Overview</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 min-w-max pb-4">
            {pipelineSteps.map((step) => (
              <div
                key={step.step}
                className="flex-shrink-0 text-center min-w-[100px]"
              >
                <div
                  className={`pipeline-step mx-auto ${
                    step.status === "completed"
                      ? "pipeline-step-completed"
                      : step.status === "current"
                        ? "pipeline-step-current"
                        : "pipeline-step-pending"
                  }`}
                >
                  {step.step}
                </div>
                <p className="text-xs mt-2 text-neutral-600 leading-tight px-1">
                  {step.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-success-500 via-accent-500 to-neutral-300 rounded-full"
                style={{ width: "30%" }}
              ></div>
            </div>
            <span className="text-sm text-neutral-600 font-medium">
              30% Complete
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="heading-4 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Vehicle #VH001 delivered</p>
                <p className="text-xs text-muted">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">
                  Payment pending for Vehicle #VH002
                </p>
                <p className="text-xs text-muted">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-xs text-muted">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="heading-4 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              Add New Vehicle
            </button>
            <button className="w-full btn-secondary text-left">
              Register Customer
            </button>
            <button className="w-full btn-outline text-left">
              Generate Report
            </button>
            <button className="w-full btn-ghost text-left">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
