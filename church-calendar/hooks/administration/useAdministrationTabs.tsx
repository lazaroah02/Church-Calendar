import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { UsersTab } from "@/components/administration/tabs/UsersTab";
import { GroupsTab } from "@/components/administration/tabs/GroupsTab";

type Route = {
  key: string;
  title: string;
};

export function useAdministrationTabs() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "users", title: "Usuarios" },
    { key: "groups", title: "Grupos" },
  ]);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case "users":
        return <UsersTab />;
      case "groups":
        return <GroupsTab />;
      default:
        return null;
    }
  };

  return { index, setIndex, routes, renderScene, layout };
}
