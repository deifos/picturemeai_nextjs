'use client';

import { useState } from 'react';
import { Button } from '@heroui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { TrashIcon } from '@heroicons/react/24/outline';

interface ImageDeleteButtonProps {
  itemId: string;
  generationId: string;
  onDelete: (itemId: string) => void;
}

export function ImageDeleteButton({
  itemId,
  generationId,
  onDelete,
}: ImageDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch('/api/generation/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId }),
      });

      if (response.ok) {
        onDelete(itemId);
        onOpenChange(); // Close modal
      } else {
        console.error('Failed to delete image');
        alert('Failed to delete image. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className='absolute bottom-2 right-2'
        onClick={e => e.stopPropagation()}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
          }
        }}
      >
        <Button
          isIconOnly
          className='bg-danger/90 backdrop-blur-sm hover:bg-danger shadow-lg'
          color='danger'
          size='sm'
          variant='solid'
          onPress={onOpen}
        >
          <TrashIcon className='w-4 h-4' />
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Delete Image
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this image?</p>
                <p className='text-sm text-default-500'>
                  This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color='default' variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color='danger'
                  isLoading={isDeleting}
                  onPress={handleDelete}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
