import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useSocket } from '../../context/SocketContext';
import { FaClock, FaCheckCircle, FaUtensils, FaTruck, FaHome } from 'react-icons/fa';
import toast from 'react-hot-toast';

const OrderTracking = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    if (socket) {
      socket.on('order-updated', (data) => {
        if (data.orderId === orderId) {
          setOrder(prev => ({ ...prev, status: data.status }));
          toast.success(`Order status updated: ${data.status}`);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('order-updated');
      }
    };
  }, [orderId, socket]);

  const fetchOrder = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (data) setOrder(data);
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'preparing', 'ready', 'delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const steps = ['pending', 'preparing', 'ready', 'delivered'];
  const currentStep = getStatusStep(order.status);

  return (
    <div className="space-y-6">
      {/* Status Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200">
          <div 
            className="w-full bg-primary transition-all duration-500"
            style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isComplete = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step} className="flex items-start gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${isComplete ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}
                `}>
                  {isComplete ? <FaCheckCircle /> : <FaClock />}
                </div>
                <div>
                  <p className={`font-medium ${isComplete ? 'text-secondary' : 'text-gray-400'}`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-primary">In Progress...</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Order Total</span>
          <span className="font-bold">${order.total_amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status</span>
          <span className={`font-medium ${
            order.status === 'delivered' ? 'text-success' : 'text-primary'
          }`}>
            {order.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;