import { AssetDetailView } from "@/components/asset/AssetDetailView";

type AssetPageProps = {
  params: Promise<{ symbol: string }>;
};

export default async function AssetPage({ params }: AssetPageProps) {
  const { symbol } = await params;

  return <AssetDetailView symbol={symbol} />;
}
