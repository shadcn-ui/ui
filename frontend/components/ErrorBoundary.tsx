import { Component, ReactNode, ErrorInfo } from 'react';
import toast from 'react-hot-toast';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught', error, errorInfo);
    toast.error('Произошла ошибка при отображении страницы');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white px-4">
          <h1 className="text-2xl font-bold text-cyan-300">Произошла непредвиденная ошибка</h1>
        </div>
      );
    }

    return this.props.children;
  }
}
