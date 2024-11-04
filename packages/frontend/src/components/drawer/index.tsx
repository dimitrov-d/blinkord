"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";

import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Book, HomeIcon, Mail, Store, SquareChartGantt, WalletCards } from "lucide-react";
import { Logo } from "../logo";

type Anchor = "top" | "left" | "bottom" | "right";

function getLink(text: string) {
  switch (text) {
    case "Home":
      return "/";
    case "Marketplace":
      return "/marketplace";
    case "Docs":
      return "https://docs.blinkord.com";
    case "Discord":
      return "https://discord.gg/HugHTEPu4H";
    case "Twitter":
      return "https://x.com/blinkord_sol";
    case "Contact":
      return "mailto:hi@blinkord.com";
    case "My Blinks":
      return "/servers";
    default:
      return "/";
  }
}

function getIcon(text: string) {
  switch (text) {
    case "Home":
      return <HomeIcon />;
    case "Marketplace":
      return <Store />;
    case "Docs":
      return <Book />;
    case "Discord":
      return <Image src="/images/discord-outline.svg" alt="Discord" width={25} height={25} />;
    case "Twitter":
      return <Image src="/images/x-outline.svg" alt="Twitter" width={20} height={20} />;
    case "Contact":
      return <Mail />;
    case "My Blinks":
      return <SquareChartGantt />;
    case "My Wallet":
      return <WalletCards />;
    default:
      return null;
  }
}

export default function Drawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };


  return (
    <div>
      {(["left"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          {" "}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(anchor, true)}
            className="inline lg:hidden"
          >
            <MenuIcon />
          </IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {((anchor: Anchor) => (
              <Box
                sx={{
                  width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
                }}
                role="presentation"
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}
              >
                <div className="py-1 ml-1">
                  <Logo isDark={false} className="py-4" />
                </div>
                <Divider />
                <List>
                  {["Home", "Marketplace", "Docs", "My Blinks", "My Wallet"].map((text, index) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton href={getLink(text)} target={text === "Docs" ? "_blank" : "_self"}>
                        <ListItemIcon>
                          {getIcon(text)}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <List>
                  {["Discord", "Twitter", "Contact"].map((text, index) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton href={getLink(text)} target="_blank">
                        <ListItemIcon>
                          {getIcon(text)}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
