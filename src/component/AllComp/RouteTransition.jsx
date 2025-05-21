import React, { Suspense, lazy } from 'react';
import LoadingPage from './LoadingPage';

// This is a higher order component that applies loading state to any component
const withLoading = (Component) => {
  const LoadingWrapper = (props) => {
    return (
      <LoadingPage timeout={1}>
        <Component {...props} />
      </LoadingPage>
    );
  };
  return LoadingWrapper;
};

// For code splitting / lazy loading with Suspense
const lazyWithLoading = (factory) => {
  const LazyComponent = lazy(factory);
  return (props) => (
    <Suspense fallback={<LoadingPage timeout={5000} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export { withLoading, lazyWithLoading };