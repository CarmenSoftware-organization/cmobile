interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'system' | 'inventory' | 'user';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    poNumber?: string;
    userName?: string;
    itemName?: string;
    quantity?: number;
  };
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private isClient: boolean;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  constructor() {
    this.isClient = typeof window !== 'undefined';
    if (this.isClient) {
      this.loadNotifications();
    } else {
      // Initialize with mock data for SSR
      this.initializeMockData();
    }
  }

  private loadNotifications() {
    if (!this.isClient) return;
    
    // Load from localStorage or initialize with mock data
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        this.notifications = JSON.parse(stored);
      } catch {
        this.initializeMockData();
      }
    } else {
      this.initializeMockData();
    }
  }

  private initializeMockData() {
    this.notifications = [
      {
        id: '1',
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'Mineral Water 500ml is running low (5 units remaining)',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high',
        actionUrl: '/inventory/items/mineral-water',
        metadata: { itemName: 'Mineral Water 500ml', quantity: 5 }
      },
      {
        id: '2',
        type: 'success',
        title: 'GRN Completed',
        message: 'Purchase Order #PO-2024-001 has been successfully received',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'medium',
        actionUrl: '/receiving/grn-detail?po=PO-2024-001',
        metadata: { poNumber: 'PO-2024-001' }
      },
      {
        id: '3',
        type: 'user',
        title: 'New User Access Request',
        message: 'Sarah Chen has requested access to the inventory system',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'medium',
        metadata: { userName: 'Sarah Chen' }
      },
      {
        id: '4',
        type: 'warning',
        title: 'Delivery Delay',
        message: 'Expected delivery for PO-2024-002 has been delayed by 2 days',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'medium',
        actionUrl: '/purchasing/orders/PO-2024-002',
        metadata: { poNumber: 'PO-2024-002' }
      },
      {
        id: '5',
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 11 PM to 1 AM',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'low'
      },
      {
        id: '6',
        type: 'info',
        title: 'Monthly Report Available',
        message: 'Your December inventory report is ready for review',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'low',
        actionUrl: '/reports/monthly/december'
      },
      {
        id: '7',
        type: 'error',
        title: 'Sync Failed',
        message: 'Failed to sync data with central system. Please retry.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high'
      }
    ];
    if (this.isClient) {
      this.saveNotifications();
    }
  }

  private saveNotifications() {
    if (!this.isClient) return;
    
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    // Immediately call with current notifications
    listener(this.notifications);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  markAsRead(notificationId: string) {
    this.notifications = this.notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    this.saveNotifications();
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.saveNotifications();
  }

  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.notifications.unshift(newNotification);
    this.saveNotifications();
  }

  // Helper methods for common notification types
  addLowStockAlert(itemName: string, quantity: number, actionUrl?: string) {
    this.addNotification({
      type: 'inventory',
      title: 'Low Stock Alert',
      message: `${itemName} is running low (${quantity} units remaining)`,
      isRead: false,
      priority: 'high',
      actionUrl,
      metadata: { itemName, quantity }
    });
  }

  addGRNCompleted(poNumber: string, actionUrl?: string) {
    this.addNotification({
      type: 'success',
      title: 'GRN Completed',
      message: `Purchase Order #${poNumber} has been successfully received`,
      isRead: false,
      priority: 'medium',
      actionUrl,
      metadata: { poNumber }
    });
  }

  addUserAccessRequest(userName: string) {
    this.addNotification({
      type: 'user',
      title: 'New User Access Request',
      message: `${userName} has requested access to the inventory system`,
      isRead: false,
      priority: 'medium',
      metadata: { userName }
    });
  }

  addDeliveryDelay(poNumber: string, days: number, actionUrl?: string) {
    this.addNotification({
      type: 'warning',
      title: 'Delivery Delay',
      message: `Expected delivery for ${poNumber} has been delayed by ${days} days`,
      isRead: false,
      priority: 'medium',
      actionUrl,
      metadata: { poNumber }
    });
  }
}

export const notificationService = NotificationService.getInstance();
export type { Notification }; 