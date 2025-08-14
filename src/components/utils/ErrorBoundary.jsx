import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Here you could send to a monitoring service like Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
              Something went wrong
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              We're sorry, but there was an error loading this page. Try refreshing the browser or return home.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={() => window.location.reload()}
              >
                Refresh page
              </button>
              <a
                href="/"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-500 rounded"
              >
                Go to Home
              </a>
            </div>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="whitespace-pre-wrap break-words text-red-600 dark:text-red-400">
                  {this.state.error && this.state.error.toString()}
                </pre>
                <pre className="mt-2 whitespace-pre-wrap break-words text-gray-700 dark:text-gray-300">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
