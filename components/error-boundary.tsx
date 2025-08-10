'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className='w-full'>
          <CardBody className='text-center'>
            <h3 className='text-lg font-semibold text-danger'>
              Something went wrong
            </h3>
            <p className='text-sm text-default-500 mt-2'>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              className='mt-4'
              color='primary'
              size='sm'
              variant='flat'
              onPress={() =>
                this.setState({ hasError: false, error: undefined })
              }
            >
              Try again
            </Button>
          </CardBody>
        </Card>
      );
    }

    return this.props.children;
  }
}
