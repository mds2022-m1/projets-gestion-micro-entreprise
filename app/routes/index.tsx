import React, { useState } from 'react';
import { ModalOrganizationType } from '../components/ModalOrganizationType';

export default function Index() {
    const [showModal, setShowModal] = useState(false);

    function Index(bool: boolean) {
      setShowModal(false)
      setTimeout(() => {
        setShowModal(true)
      }, 500)
    }

    return (
        <div className="lg:ml-64 h-screen bg-slate-700 flex flex-col justify-center items-center">
             <button onClick={() => Index(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Open Modal</button>
             {showModal && <ModalOrganizationType/>}
        </div>
    );
}
