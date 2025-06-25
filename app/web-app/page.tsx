"use client";
import { useState, useEffect } from "react";

export default function WebApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });

  // Add blur to background when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden", "backdrop-blur-sm");
    } else {
      document.body.classList.remove("overflow-hidden", "backdrop-blur-sm");
    }

    return () => {
      document.body.classList.remove("overflow-hidden", "backdrop-blur-sm");
    };
  }, [isModalOpen]);

  const openModal = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const features = [
    {
      title: "User Management",
      description: "Manage users, roles, activity logs, and more.",
      className:
        "md:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer",
      link: "/web-app/users",
    },
    {
      title: "Organization Management",
      description: "Manage organizations, teams, roles, and permissions.",
      className:
        "md:col-span-2 bg-gradient-to-br from-purple-50 to-purple-100 cursor-pointer",
      link: "/web-app/organization",
    },
    {
      title: "Client Management",
      description: "Manage clients, contacts, and communication logs.",
      // className: ' bg-gradient-to-br from-yellow-50 to-yellow-100',
      className: " bg-black-900 cursor-not-allowed",
      link: "/web-app/clients",
    },
    {
      title: "Reporting",
      description: "View Reports of users and activities.",
      // className: 'bg-gradient-to-br from-red-50 to-red-100',
      className: " bg-black-900 cursor-not-allowed",

      link: "/web-app/reports",
    },
    {
      title: "Billing",
      description:
        "Manage billings of organization, including payment methods, subscription plans, and invoicing options.",
      // className: 'md:col-span-2 bg-gradient-to-br from-pink-50 to-pink-100',
      className: "md:col-span-2 bg-black-900 cursor-not-allowed",

      link: "/web-app/billing",
    },
    {
      title: "Screenshots",
      description: "Update or Delete Screenshots",
      className: "bg-gradient-to-br from-pink-50 to-pink-100 cursor-pointer",
      link: "/web-app/screenshots",
    },
    {
      title: "Attendance",
      description: "Manage Attendance of a User.",
      className: "bg-gradient-to-br from-pink-50 to-pink-100 cursor-pointer",
      link: "/web-app/attendance",
    },
    {
      title: "Timelogs",
      description: "Manage Timelogs of a User.",
      // className: 'md:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer',
      className: "md:col-span-2 bg-black-900  cursor-not-allowed",
      link: "/web-app/timelogs",
    },
        {
      title: "Cleanup",
      description: "Cleanup duplicate entries.",
      className: 'md:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer',
      link: "/web-app/cleanup",
    },
  ];

  return (
    <div className={`p-6 max-w-7xl mx-auto ${isModalOpen ? "blur-sm" : ""}`}>
      <h1 className="text-3xl font-bold text-center mb-8">
        Web App Admin Panel
      </h1>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[200px]">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${feature.className}`}
            role="button"
            tabIndex={0}
            onClick={() => (window.location.href = feature.link)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.location.href = feature.link;
              }
            }}
          >
            <h3 className="text-gray-700 text-xl font-semibold mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
