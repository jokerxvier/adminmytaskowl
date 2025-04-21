'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@heroui/modal';
import EditMember from '@/components/edit_member';
import EditOrganization from '@/components/organization';




export default function WebApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
    component: JSX.Element | null;
  }>({ title: '', description: '', component: null });

  // Add blur to background when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden', 'backdrop-blur-sm');
    } else {
      document.body.classList.remove('overflow-hidden', 'backdrop-blur-sm');
    }
    return () => {
      document.body.classList.remove('overflow-hidden', 'backdrop-blur-sm');
    };
  }, [isModalOpen]);

  const openModal = (title: string, description: string, component: JSX.Element | null = null) => {
    setModalContent({ title, description, component });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const features = [
    {
      title: 'User Management',
      description: 'Manage users, roles, activity logs, and more.',
      className: 'md:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100',
      component: <EditMember />,
    },
    {
      title: 'Organization Management',
      description: 'Manage organizations, teams, roles, and permissions.',
      className: 'md:col-span-2 bg-gradient-to-br from-purple-50 to-purple-100',
      component: <EditOrganization/>
    },
    {
      title: 'Client Management',
      description: 'Manage clients, contacts, and communication logs.',
      className: 'md:col-span-2 bg-gradient-to-br from-yellow-50 to-yellow-100',
    },
    {
      title: 'Reporting',
      description: 'View Reports of users and activities.',
      className: 'bg-gradient-to-br from-red-50 to-red-100',
    },
    {
      title: 'Notifications',
      description: 'Set and manage notifications for system events.',
      className: 'bg-gradient-to-br from-pink-50 to-pink-100',
    },
  ];

  return (
    <div className={`p-6 max-w-7xl mx-auto ${isModalOpen ? 'blur-sm' : ''}`}>
      <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[200px]">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${feature.className}`}
            onClick={() => openModal(feature.title, feature.description, feature.component || null)}
          >
            <h3 className="text-gray-700 text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Modal with fixed positioning and z-index */}
      <Modal isOpen={isModalOpen} onClose={closeModal} >
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={closeModal}
          />
          <div className="relative bg-default p-8 rounded-xl shadow-xl max-w-md w-full mx-4 z-10">
            <h2 className="text-2xl font-bold mb-4">{modalContent.title}</h2>
            <p className=" mb-6">{modalContent.description}</p>
            <div>
            {modalContent.component}
            </div>
              <div className="text-center">
            <div className="flex justify-end">
              {/* <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={closeModal}
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
        </div>
      </Modal>
    </div>
  );
}