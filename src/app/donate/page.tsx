import { store } from "@/lib/store";
import DonateClient from "./donate-client";

export const dynamic = "force-dynamic";

export default async function DonatePage() {
  const settings = await store.getSettings();
  return (
    <DonateClient
      zeffyOneTimeId={settings.zeffyOneTimeId}
      zeffyMonthlyId={settings.zeffyMonthlyId}
      oakGroveUrl={settings.oakGroveUrl}
    />
  );
}
