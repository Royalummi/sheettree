import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  Info,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Trash2,
  Check,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  clearNotification,
  clearAllNotifications,
} from "../../store/slices/notificationsSlice";
import { toast } from "react-toastify";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, error } = useSelector(
    (state) => state.notifications
  );

  // State for filters and search
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Notification type configuration
  const notificationTypes = {
    form_submission: {
      icon: CheckCircle,
      color: "text-green-500",
      label: "Form Submission",
    },
    sheet_connection: {
      icon: Info,
      color: "text-blue-500",
      label: "Sheet Connection",
    },
    form_status: {
      icon: AlertCircle,
      color: "text-yellow-500",
      label: "Form Status",
    },
    api_limit: {
      icon: AlertCircle,
      color: "text-orange-500",
      label: "API Limit",
    },
    spam_detected: {
      icon: XCircle,
      color: "text-red-500",
      label: "Spam Detected",
    },
    system: { icon: Bell, color: "text-gray-500", label: "System" },
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && !notification.read) ||
      (statusFilter === "read" && notification.read);
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const todayNotifications = notifications.filter((n) => {
    const today = new Date();
    const notifDate = new Date(n.created_at);
    return notifDate.toDateString() === today.toDateString();
  }).length;

  const weekNotifications = notifications.filter((n) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(n.created_at) >= weekAgo;
  }).length;

  // Handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedNotifications(paginatedNotifications.map((n) => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (id, checked) => {
    if (checked) {
      setSelectedNotifications([...selectedNotifications, id]);
    } else {
      setSelectedNotifications(
        selectedNotifications.filter((nId) => nId !== id)
      );
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await dispatch(markAsRead(id)).unwrap();
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleMarkSelectedAsRead = async () => {
    try {
      await Promise.all(
        selectedNotifications.map((id) => dispatch(markAsRead(id)).unwrap())
      );
      setSelectedNotifications([]);
      toast.success(
        `${selectedNotifications.length} notifications marked as read`
      );
    } catch (err) {
      toast.error("Failed to mark selected notifications as read");
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await dispatch(clearNotification(id)).unwrap();
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedNotifications.map((id) =>
          dispatch(clearNotification(id)).unwrap()
        )
      );
      setSelectedNotifications([]);
      toast.success(`${selectedNotifications.length} notifications deleted`);
    } catch (err) {
      toast.error("Failed to delete selected notifications");
    }
  };

  const handleClearAll = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all notifications? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(clearAllNotifications()).unwrap();
        toast.success("All notifications cleared");
      } catch (err) {
        toast.error("Failed to clear all notifications");
      }
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }

    // Navigate based on notification type
    const metadata = notification.metadata;
    if (metadata) {
      if (metadata.form_id) {
        navigate(`/forms/${metadata.form_id}/edit`);
      } else if (metadata.sheet_id) {
        navigate("/sheets");
      }
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const config = notificationTypes[type] || notificationTypes.system;
    const Icon = config.icon;
    return <Icon className={`w-5 h-5 ${config.color}`} />;
  };

  const getNotificationBadge = (type) => {
    const config = notificationTypes[type] || notificationTypes.system;
    return (
      <Badge variant="outline" className="text-xs">
        {config.label}
      </Badge>
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and view all your notification activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.length}
              </p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-orange-500">
                {unreadCount}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-500">
                {todayNotifications}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-500">
                {weekNotifications}
              </p>
            </div>
            <Info className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="form_submission">Form Submission</SelectItem>
                <SelectItem value="sheet_connection">
                  Sheet Connection
                </SelectItem>
                <SelectItem value="form_status">Form Status</SelectItem>
                <SelectItem value="api_limit">API Limit</SelectItem>
                <SelectItem value="spam_detected">Spam Detected</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleClearAll}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-900">
              {selectedNotifications.length} selected
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkSelectedAsRead}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNotifications([])}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedNotifications.length ===
                        paginatedNotifications.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Notification</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNotifications.map((notification) => (
                  <TableRow
                    key={notification.id}
                    className={`cursor-pointer ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedNotifications.includes(
                          notification.id
                        )}
                        onCheckedChange={(checked) =>
                          handleSelectNotification(notification.id, checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium text-gray-900 ${
                              !notification.read ? "font-semibold" : ""
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 truncate max-w-xl">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getNotificationBadge(notification.type)}
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-sm text-gray-500"
                        title={new Date(
                          notification.created_at
                        ).toLocaleString()}
                      >
                        {formatRelativeTime(notification.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {notification.read ? (
                        <Badge variant="secondary" className="text-xs">
                          Read
                        </Badge>
                      ) : (
                        <Badge
                          variant="default"
                          className="text-xs bg-blue-500"
                        >
                          Unread
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.read && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                          >
                            <Info className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredNotifications.length
                  )}{" "}
                  of {filteredNotifications.length} notifications
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
