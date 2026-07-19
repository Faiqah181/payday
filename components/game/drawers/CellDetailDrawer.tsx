import BottomDrawer, { BottomDrawerHandle } from "@/components/ui/BottomDrawer";
import ChunkyButton from "@/components/ui/ChunkyButton";
import Typography from "@/components/ui/Typography";
import { SpaceDetail } from "@/constants/board";
import { SD } from "@/constants/theme";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";

interface CellDetailDrawerProps {
  detail: SpaceDetail;
  onClose: () => void;
}

export default function CellDetailDrawer({ detail, onClose }: CellDetailDrawerProps) {
  const drawer = useRef<BottomDrawerHandle>(null);
  const amountText =
    detail.amount > 0
      ? `+$${detail.amount}`
      : detail.amount < 0
        ? `-$${Math.abs(detail.amount)}`
        : "";

  return (
    <BottomDrawer ref={drawer} onClose={onClose}>
      <View style={styles.content}>
        <View style={styles.handle} />
        <View style={[styles.kindChip, { backgroundColor: detail.accent }]}>
          <Typography design="body" weight={800} style={styles.kindText}>
            {detail.kind}
          </Typography>
        </View>
        <View style={styles.titleRow}>
          <Typography design="title" style={styles.title}>
            {detail.title}
          </Typography>
          {amountText !== "" && (
            <Typography
              design="money"
              style={[
                styles.amount,
                { color: detail.amount > 0 ? SD.primary : SD.debt },
              ]}
            >
              {amountText}
            </Typography>
          )}
        </View>
        <Typography design="body" weight={700} style={styles.sub}>
          {detail.sub}
        </Typography>
        <View style={styles.ruleBox}>
          <Typography design="body" style={styles.ruleText}>
            {detail.rule}
          </Typography>
        </View>
        <ChunkyButton
          color={SD.primary}
          depthColor={SD.primaryShadow}
          depth={5}
          borderRadius={16}
          style={styles.action}
          contentStyle={styles.actionFace}
          onPress={() => drawer.current?.close()}
        >
          <Typography design="title" style={styles.actionLabel}>
            Got it
          </Typography>
        </ChunkyButton>
      </View>
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: SD.line,
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 14,
  },
  kindChip: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  kindText: {
    fontSize: 11,
    letterSpacing: 1,
    color: SD.white,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 14,
  },
  title: {
    fontSize: 26,
    color: SD.ink,
  },
  amount: {
    fontSize: 24,
  },
  sub: {
    fontSize: 13,
    color: SD.soft,
    marginTop: 2,
  },
  ruleBox: {
    backgroundColor: SD.surface2,
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginTop: 14,
  },
  ruleText: {
    fontSize: 14,
    lineHeight: 21,
    color: SD.ink,
  },
  action: {
    marginTop: 16,
  },
  actionFace: {
    paddingVertical: 16,
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 16,
    color: SD.white,
  },
});
