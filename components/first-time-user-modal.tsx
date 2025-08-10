'use client';

import { useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Button } from '@heroui/button';

interface FirstTimeUserModalProps {
  userId: string;
}

export function FirstTimeUserModal({ userId }: FirstTimeUserModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem(`first-time-modal-${userId}`);

    if (!hasSeenModal) {
      // Small delay to ensure the page is loaded
      const timer = setTimeout(() => {
        onOpen();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [userId, onOpen]);

  const handleClose = () => {
    // Mark as seen in localStorage
    localStorage.setItem(`first-time-modal-${userId}`, 'true');
  };

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      size='lg'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose: () => void) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <h2 className='text-xl font-semibold'>
                Welcome to PictureMe AI! 📸
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className='space-y-4'>
                <p className='text-default-600'>
                  For the best AI generation results, we recommend using:
                </p>

                <div className='bg-primary-50 border border-primary-200 rounded-lg p-4'>
                  <h3 className='font-medium text-primary-700 mb-2'>
                    📋 Image Guidelines:
                  </h3>
                  <ul className='space-y-2 text-sm text-default-700'>
                    <li className='flex items-start gap-2'>
                      <span className='text-success'>✓</span>
                      <span>
                        <strong>Recent selfie</strong> - Use a current photo of
                        yourself
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-success'>✓</span>
                      <span>
                        <strong>Front-facing shot</strong> - Face the camera
                        directly
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-success'>✓</span>
                      <span>
                        <strong>High resolution</strong> - At least 512x512
                        pixels
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-success'>✓</span>
                      <span>
                        <strong>Good lighting</strong> - Clear, well-lit photos
                        work best
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-success'>✓</span>
                      <span>
                        <strong>Clear face</strong> - Avoid sunglasses, hats, or
                        obstructions
                      </span>
                    </li>
                  </ul>
                </div>

                <div className='bg-warning-50 border border-warning-200 rounded-lg p-4'>
                  <h3 className='font-medium text-warning-700 mb-2'>
                    🎁 Free Credit
                  </h3>
                  <p className='text-sm text-warning-700'>
                    You get <strong>1 free generation</strong> to try out
                    PictureMe AI! Upload your photo and explore the different
                    styles and categories.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className='w-full'
                color='primary'
                onPress={() => {
                  handleClose();
                  onClose();
                }}
              >
                Got it! Let&apos;s start creating
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
