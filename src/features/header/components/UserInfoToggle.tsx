import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";
import { Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { usePopupState } from "material-ui-popup-state/hooks";
import { useSession } from "next-auth/react";
import * as React from "react";

import usePostLogout from "@/features/sign-in/hooks/usePostLogout";

export default function UserInfoToggle() {
  const { data: session } = useSession();

  const userId = session?.user.id;

  const popupState = usePopupState({
    variant: "popover",
    popupId: "demo-popup-menu",
  });

  const { mutate: logout } = usePostLogout();

  const handleLogout = async () => {
    logout(session?.accessToken as string);
    popupState.close();
  };

  return (
    <React.Fragment>
      <div className="user-area">
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <PopupState variant="popover" popupId="popup-menu">
            {() => (
              <>
                <IconButton
                  {...bindTrigger(popupState)}
                  className="flex items-center gap-[8px] p-0"
                >
                  <PersonIcon sx={{ fontSize: "20px" }} />
                  <p className="text-[14px] text-white">{userId}</p>
                  <ArrowDropDownIcon
                    sx={{
                      transform: popupState.isOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </IconButton>
                <Menu {...bindMenu(popupState)} sx={{ top: "6px" }}>
                  <MenuItem onClick={handleLogout} sx={{ width: "165px" }}>
                    Log out
                  </MenuItem>
                </Menu>
              </>
            )}
          </PopupState>
        </Box>
      </div>
    </React.Fragment>
  );
}
