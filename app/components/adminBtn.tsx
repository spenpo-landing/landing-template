import React from "react";
import { IconButton } from "@mui/material";
import { useSession } from "next-auth/react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import PendingIcon from "@mui/icons-material/Pending";

const config = {
  unauthenticated: {
    icon: <AdminPanelSettingsIcon />,
    href: "/api/auth/signin",
  },
  authenticated: {
    icon: <LogoutIcon />,
    href: "/api/auth/signout",
  },
  loading: {
    icon: <PendingIcon />,
    href: "/",
  },
};

const AdminBtn: React.FC = () => {
  const session = useSession();
  return (
    !JSON.parse(process.env.NEXT_PUBLIC_HIDE_ADMIN || "") && (
      <IconButton
        href={config[session.status].href}
        sx={{ position: "absolute", right: 0, opacity: 0.5 }}
      >
        {config[session.status].icon}
      </IconButton>
    )
  );
};

export default AdminBtn;
