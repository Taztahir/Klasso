import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    title: string;
    message: string;
    type: ToastType;
    onClose: () => void;
}

export const Toast = ({ title, message, type, onClose }: ToastProps) => {
    const icons = {
        success: <CheckCircle2 className="text-green-500" size={20} />,
        error: <AlertCircle className="text-rose-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
        warning: <Bell className="text-yellow-500" size={20} />
    };

    const colors = {
        success: 'border-green-500 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]',
        error: 'border-rose-500 shadow-[4px_4px_0px_0px_rgba(244,63,94,1)]',
        info: 'border-blue-500 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]',
        warning: 'border-yellow-500 shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`pointer-events-auto w-80 bg-white border-2 rounded-2xl p-4 flex gap-4 ${colors[type]} border-black`}
        >
            <div className="flex-shrink-0 pt-0.5">
                {icons[type]}
            </div>
            <div className="flex-grow">
                <h4 className="font-black text-sm uppercase tracking-tight">{title}</h4>
                <p className="text-xs font-bold text-dash-text-muted mt-1 leading-relaxed">
                    {message}
                </p>
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 self-start p-1 hover:bg-zinc-100 rounded-lg transition-colors"
            >
                <X size={14} className="text-zinc-400" />
            </button>
        </motion.div>
    );
};
