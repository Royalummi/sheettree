import React, { useEffect, useState } from "react";
import { CheckCircle, X, AlertTriangle, Info, Loader } from "lucide-react";

/**
 * Success Animations and Feedback Components
 * Provide delightful user feedback for actions
 */

export const SuccessAnimation = ({
  show,
  onComplete,
  message = "Success!",
}) => {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 transform animate-scale-in pointer-events-auto">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-white animate-check" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
            {message}
          </h3>
          <p className="text-gray-600 text-center">
            Your action was completed successfully
          </p>
        </div>
      </div>
    </div>
  );
};

export const ConfettiSuccess = ({ show, onComplete }) => {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Confetti particles */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 animate-confetti"
          style={{
            left: `${50 + (Math.random() - 0.5) * 20}%`,
            top: `${50 + (Math.random() - 0.5) * 20}%`,
            backgroundColor: [
              "#8B5CF6",
              "#EC4899",
              "#10B981",
              "#F59E0B",
              "#3B82F6",
            ][i % 5],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random()}s`,
          }}
        />
      ))}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 transform animate-bounce-in pointer-events-auto">
        <div className="flex flex-col items-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Awesome!</h3>
          <p className="text-gray-600 text-center">
            Everything is set up and ready to go!
          </p>
        </div>
      </div>
    </div>
  );
};

export const AnimatedToast = ({
  show,
  type = "success",
  title,
  message,
  onClose,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          if (onClose) setTimeout(onClose, 300);
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onClose]);

  if (!show && !isVisible) return null;

  const icons = {
    success: { Icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    error: { Icon: X, color: "text-red-500", bg: "bg-red-50" },
    warning: {
      Icon: AlertTriangle,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    info: { Icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
    loading: { Icon: Loader, color: "text-purple-500", bg: "bg-purple-50" },
  };

  const { Icon, color, bg } = icons[type] || icons.info;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm flex items-start space-x-3">
        <div className={`${bg} rounded-lg p-2 flex-shrink-0`}>
          <Icon
            className={`w-5 h-5 ${color} ${
              type === "loading" ? "animate-spin" : ""
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          )}
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const ProgressBar = ({ progress = 0, label, animated = true }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-bold text-purple-600">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ${
            animated ? "animate-pulse-slow" : ""
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export const PulseLoader = ({ size = "md", color = "purple" }) => {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colors = {
    purple: "bg-purple-600",
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
  };

  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizes[size]} ${colors[color]} rounded-full animate-pulse`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

export const SpinnerLoader = ({ size = "md", color = "purple" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colors = {
    purple: "border-purple-600",
    blue: "border-blue-600",
    green: "border-green-600",
    red: "border-red-600",
    white: "border-white",
  };

  return (
    <div
      className={`${sizes[size]} ${colors[color]} border-4 border-t-transparent rounded-full animate-spin`}
    />
  );
};

export const SuccessCheckmark = ({ show, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  if (!show) return null;

  return (
    <div className={`${sizes[size]} relative`}>
      <svg className="w-full h-full" viewBox="0 0 52 52">
        <circle
          className="animate-circle-draw"
          cx="26"
          cy="26"
          r="25"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
        />
        <path
          className="animate-checkmark-draw"
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          d="M14 27l7 7 16-16"
        />
      </svg>
    </div>
  );
};

export const SavingIndicator = ({ isSaving, lastSaved }) => {
  if (!isSaving && !lastSaved) return null;

  return (
    <div className="flex items-center space-x-2 text-sm">
      {isSaving ? (
        <>
          <PulseLoader size="sm" color="purple" />
          <span className="text-gray-600">Saving...</span>
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-gray-600">
            Saved{" "}
            {lastSaved ? new Date(lastSaved).toLocaleTimeString() : "just now"}
          </span>
        </>
      )}
    </div>
  );
};

// Add these animations to your global CSS
export const animationStyles = `
@keyframes scale-in {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3) translateY(-100px);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes confetti {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(300px) rotate(720deg);
    opacity: 0;
  }
}

@keyframes check {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes circle-draw {
  0% {
    stroke-dasharray: 0 157;
  }
  100% {
    stroke-dasharray: 157 157;
  }
}

@keyframes checkmark-draw {
  0% {
    stroke-dasharray: 0 30;
  }
  100% {
    stroke-dasharray: 30 30;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out;
}

.animate-confetti {
  animation: confetti 2s ease-out forwards;
}

.animate-check {
  animation: check 0.4s ease-out;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-circle-draw {
  animation: circle-draw 0.6s ease-out forwards;
}

.animate-checkmark-draw {
  animation: checkmark-draw 0.4s 0.4s ease-out forwards;
  stroke-dasharray: 0 30;
}
`;

export default {
  SuccessAnimation,
  ConfettiSuccess,
  AnimatedToast,
  ProgressBar,
  PulseLoader,
  SpinnerLoader,
  SuccessCheckmark,
  SavingIndicator,
};
