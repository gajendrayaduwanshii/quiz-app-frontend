import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { Dashboard, People, Code, School } from "@mui/icons-material";
import Link from 'next/link';

const iconMap = {
  dashboard: <Dashboard />,
  people: <People />,
  code: <Code />,
  school: <School />,
};

const Sidebar = ({ open }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 80,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: open ? 240 : 80,
          transition: "width 0.3s ease",
          backgroundColor: "#f4f4f4",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "64px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1976d2",
        }}
      >
        <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", fontSize: open ? 24 : 16 }}>
          AI Quiz
        </Typography>
      </Box>

      <Divider />

      <List sx={{ width: "100%" }}>
        <ListItem        
          component={Link}
          href={`/dashboard`}
          sx={{
            color: "#1976d2",
            borderRadius: "8px",
            margin: "5px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#1976d2",
              color: "white",
              "& .MuiListItemIcon-root": { color: "white" },
            },
            transition: "0.3s",
          }}
        >
          <Tooltip title="Dashboard" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ color: "inherit", minWidth: "auto", marginRight: open ? "16px" : "0" }}>
              {iconMap.dashboard} 
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="Dashboard " />}
        </ListItem> 
      </List>
    </Drawer>
  );
};

export default Sidebar;
