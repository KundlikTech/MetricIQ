import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, X, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThresholdAlert {
  id: string;
  metric: string;
  condition: 'above' | 'below';
  value: number;
  enabled: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Revenue Target Achieved',
    message: 'Monthly revenue has exceeded the $50,000 target by 15%',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Conversion Rate Declining',
    message: 'Conversion rate has dropped below 3% threshold',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: '3',
    type: 'error',
    title: 'High Bounce Rate Alert',
    message: 'Bounce rate has exceeded 50% on the pricing page',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
  },
  {
    id: '4',
    type: 'info',
    title: 'New User Milestone',
    message: 'You have reached 10,000 registered users',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
];

const Notifications: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showSettings, setShowSettings] = useState(false);
  const [alerts, setAlerts] = useState<ThresholdAlert[]>([
    { id: '1', metric: 'Revenue', condition: 'above', value: 50000, enabled: true },
    { id: '2', metric: 'Conversion Rate', condition: 'below', value: 3, enabled: true },
    { id: '3', metric: 'Bounce Rate', condition: 'above', value: 50, enabled: false },
  ]);

  const [newAlert, setNewAlert] = useState({
    metric: '',
    condition: 'above' as 'above' | 'below',
    value: 0,
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <TrendingUp className="h-5 w-5 text-primary" />;
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: 'Notification dismissed',
      description: 'The notification has been removed.',
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: 'All caught up!',
      description: 'All notifications marked as read.',
    });
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const addAlert = () => {
    if (!newAlert.metric || newAlert.value === 0) {
      toast({
        title: 'Invalid alert',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const alert: ThresholdAlert = {
      id: Date.now().toString(),
      ...newAlert,
      enabled: true,
    };
    setAlerts([...alerts, alert]);
    setNewAlert({ metric: '', condition: 'above', value: 0 });
    toast({
      title: 'Alert created',
      description: `You will be notified when ${newAlert.metric} goes ${newAlert.condition} ${newAlert.value}.`,
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="gradient-primary text-primary-foreground">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Manage alerts and stay updated on important metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
          <Button
            variant={showSettings ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
            {showSettings ? 'View Notifications' : 'Alert Settings'}
          </Button>
        </div>
      </div>

      {showSettings ? (
        /* Alert Settings */
        <div className="space-y-6 animate-slide-up">
          {/* Current Alerts */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Threshold Alerts</h3>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-2 ${alert.enabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{alert.metric}</p>
                      <p className="text-sm text-muted-foreground">
                        Alert when {alert.condition} {alert.value}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={alert.enabled}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Add New Alert */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Alert</h3>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="metric">Metric Name</Label>
                <Input
                  id="metric"
                  placeholder="e.g., Revenue"
                  value={newAlert.metric}
                  onChange={(e) => setNewAlert({ ...newAlert, metric: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as 'above' | 'below' })}
                >
                  <option value="above">Goes above</option>
                  <option value="below">Goes below</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Threshold Value</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="0"
                  value={newAlert.value || ''}
                  onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addAlert} className="w-full">
                  Add Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Notifications List */
        <div className="space-y-4 animate-slide-up">
          {notifications.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/50 p-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                  notification.read ? 'bg-card' : 'bg-primary/5 border-primary/20'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.timestamp)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
