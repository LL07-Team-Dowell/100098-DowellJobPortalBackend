import { useState } from 'react'
export const useModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => {
        setModalOpen(false);
    }
    const openModal = () => {
        setModalOpen(true);
    }
    return { modalOpen, closeModal, openModal }
}