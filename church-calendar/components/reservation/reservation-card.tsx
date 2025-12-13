import { useThemeStyles } from "@/hooks/useThemedStyles";
import { AppTheme } from "@/theme";
import { Reservation } from "@/types/reservation";
import { View } from "react-native";
import { UserAvatar } from "../user/user-avatar";
import { formatTimeStamp } from "@/lib/calendar/calendar-utils";

export function ReservationCard({ reservation }: { reservation: Reservation }) {
  const styles = useThemeStyles(ReservationCardStyles);
  return (
    <View style={styles.container}>
      <UserAvatar
        user={reservation?.user_full_info}
        title={formatTimeStamp(reservation.created_at)}
      />
    </View>
  );
}

const ReservationCardStyles = (theme: AppTheme) => ({
  container: {
    width: "100%",
    padding: 10,
  },
});
