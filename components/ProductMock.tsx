import SocialMock from "./SocialMock";
import WireFeed from "./WireFeed";

// Products added later from the admin have no illustration yet.
export default function ProductMock({ id }: { id: string }) {
  if (id === "vartmaan") return <WireFeed />;
  if (id === "social") return <SocialMock />;
  return null;
}
