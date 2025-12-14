import { Snackbar, Alert } from "@mui/material";
import { useNotification } from "../contexts/NotificationContext";

function Notification() {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <Snackbar
      open={true}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={notification.severity} variant="filled">
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
