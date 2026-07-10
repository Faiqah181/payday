import BottomDrawer, { BottomDrawerHandle } from "@/components/ui/BottomDrawer";
import Typography from "@/components/ui/Typography";
import { SD, SD_CATEGORY } from "@/constants/theme";
import type { DealCard } from "@/types/game";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import CardItemModal from "./CardItemModal";
import DrawerHeader from "./DrawerHeader";
import DrawerRow, { DrawerEmpty } from "./DrawerRow";

interface DealsDrawerProps {
  deals: DealCard[];
  /** "sell" is the Buyer-space flow: tapping a deal sells it. */
  mode?: "view" | "sell";
  onSell?: (deal: DealCard) => void;
  onClose: () => void;
}

export default function DealsDrawer({
  deals,
  mode = "view",
  onSell,
  onClose,
}: DealsDrawerProps) {
  const drawer = useRef<BottomDrawerHandle>(null);
  const [selected, setSelected] = useState<DealCard | null>(null);
  const selling = mode === "sell";

  const totalValue = deals.reduce((sum, deal) => sum + deal.sellPrice, 0);

  const handleRowPress = (deal: DealCard) => {
    if (selling) {
      onSell?.(deal);
    } else {
      setSelected(deal);
    }
  };

  return (
    <>
      <BottomDrawer ref={drawer} onClose={onClose}>
        <DrawerHeader
          color={selling ? SD_CATEGORY.buyer : SD.purple}
          eyebrow={selling ? "BUYER · PICK A DEAL TO SELL" : "MY DEALS"}
          headline={`$${totalValue}`}
          note={
            selling
              ? "Tap a deal to sell it at its full value."
              : "Hold your deals, then cash them in on a Buyer space."
          }
        />
        <ScrollView contentContainerStyle={styles.list}>
          {deals.length === 0 && (
            <DrawerEmpty text="No deals held. Buy one on a Deal space." />
          )}
          {deals.map((deal) => (
            <DrawerRow
              key={deal.id}
              tileColor={selling ? SD_CATEGORY.buyer : SD.purple}
              icon="pricetags"
              title={deal.title}
              sub={`Bought for $${deal.buyPrice}`}
              right={
                <View style={styles.sellCol}>
                  <Typography design="body" weight={800} style={styles.sellLabel}>
                    SELLS FOR
                  </Typography>
                  <Typography design="money" style={styles.sellValue}>
                    ${deal.sellPrice}
                  </Typography>
                </View>
              }
              onPress={() => handleRowPress(deal)}
            />
          ))}
        </ScrollView>
      </BottomDrawer>
      {selected && (
        <CardItemModal
          tone={SD.purple}
          eyebrow="DEAL CARD"
          title={selected.title}
          sub="Hold it, then cash in on a Buyer space."
          stats={[
            { label: "BOUGHT FOR", value: `$${selected.buyPrice}`, color: SD.debt },
            { label: "SELLS FOR", value: `$${selected.sellPrice}`, color: SD.primary },
          ]}
          note={`+$${selected.sellPrice - selected.buyPrice} profit when sold`}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 22,
    gap: 8,
  },
  sellCol: {
    alignItems: "flex-end",
  },
  sellLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: SD.soft,
  },
  sellValue: {
    fontSize: 13,
    color: SD.primary,
  },
});
