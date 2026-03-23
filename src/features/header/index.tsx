import UserInfoToggle from "@/features/header/components/UserInfoToggle";
import UserPermission from "@/features/header/components/UserPermission";
import UserTimezone from "@/features/header/components/UserTimezone";

export default function Header() {
  return (
    <>
      <UserPermission />
      <UserTimezone />
      <UserInfoToggle />
    </>
  );
}
