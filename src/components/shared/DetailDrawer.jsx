import React from "react";
import { motion } from "framer-motion";

const DetailDrawer = ({ isOpen, onClose, header, children, footer, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <motion.aside
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={`absolute bottom-0 right-0 top-0 w-full max-w-md bg-white p-6 shadow-2xl sm:rounded-l-3xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {header}
        <div className="mt-6 space-y-4">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </motion.aside>
    </div>
  );
};

export default DetailDrawer;
