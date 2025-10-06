interface Notification {
  id: string;
  type: 'order_accepted' | 'order_declined' | 'order_shipped' | 'order_delivered';
  message: string;
  orderId: string;
  timestamp: string;
  read: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    // Load notifications from localStorage
    this.loadNotifications();
  }

  private loadNotifications() {
    try {
      const stored = localStorage.getItem('user_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem('user_notifications', JSON.stringify(this.notifications));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Simulate receiving notifications from backend
  simulateNotification(type: Notification['type'], message: string, orderId: string) {
    this.addNotification({ type, message, orderId });
  }
}

export const notificationService = new NotificationService();

// For demo purposes - simulate notifications when orders are accepted/declined
export const simulateOrderNotification = (type: 'accepted' | 'declined', orderNumber: string, reason?: string) => {
  const messages = {
    accepted: `🎉 Great news! Your order ${orderNumber} has been accepted and is being processed. You'll receive tracking information soon.`,
    declined: `❌ Unfortunately, your order ${orderNumber} has been declined. ${reason || 'Please contact support for more information.'}`
  };

  notificationService.simulateNotification(
    type === 'accepted' ? 'order_accepted' : 'order_declined',
    messages[type],
    orderNumber
  );
};
