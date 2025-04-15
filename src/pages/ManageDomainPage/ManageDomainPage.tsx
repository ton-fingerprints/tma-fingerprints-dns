import { FC, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  Banner,
  Button,
  Cell,
  Checkbox,
  IconButton,
  Image,
  Input,
  List,
  Placeholder,
  Section,
} from "@telegram-apps/telegram-ui";
import { Address } from "ton-core";

import { useTonWallet } from "@tonconnect/ui-react";
import { Icon16Cancel } from "@vkontakte/icons";

import { Page } from "@/components/Page";
import { ShowSnackbar } from "@/components/ShowSnackbar";

import { useTonAPI } from "@/hooks/useTonAPI";
import { useDNSManager } from "@/hooks/useDNSManager";

import { shortenAddress } from "@/utils/address";
import { AdnlAddress, StorageBagId } from "@/utils/validators";

interface FormData {
  tonSite: string;
  isChecked: boolean;
  tonStorage: string;
  walletAddress: string;
  subdomains: string;
}

export const ManageDomainPage: FC = () => {
  const wallet = useTonWallet();
  const { manager } = useDNSManager();

  const isTestnet = wallet?.account?.chain === "-3";
  const { runGetMethod, getNftItem, getNftCollection } = useTonAPI(isTestnet);

  const [snackbar, setSnackbar] = useState<JSX.Element | null>(null);

  const [resolverAddress, setResolverAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [checkingResolver, setCheckingResolver] = useState(false);
  const [resolverData, setResolverData] = useState<{ title: string; image?: string; subtitle?: string }>({
    title: "",
    image: "",
    subtitle: "",
  });
  const [isAutoCheckTriggered, setIsAutoCheckTriggered] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    tonSite: "",
    isChecked: false,
    tonStorage: "",
    walletAddress: "",
    subdomains: "",
  });

  const showSnackbar = (message: string, type: "success" | "error" | "sent" = "success") => {
    setSnackbar(<ShowSnackbar message={message} type={type} onClose={() => setSnackbar(null)} />);
  };


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const address = params.get("address")
    if (address) {
      setResolverAddress(Address.parse(address).toString());
      setIsAutoCheckTriggered(true);
    }
  }, []);

  useEffect(() => {
    if (isAutoCheckTriggered && resolverAddress) {
      handleCheckResolverAddress();
      setIsAutoCheckTriggered(false);
    }
  }, [resolverAddress, isAutoCheckTriggered]);

  const handleInputChange = (key: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckResolverAddress = async () => {
    if (!resolverAddress) {
      showSnackbar("Please enter a DNS Address!", "error");
      return;
    }
    const resolverAddressNew = Address.parse(resolverAddress).toString();
    setCheckingResolver(true);
    const dnsResult = await runGetMethod(resolverAddressNew, "dnsresolve", []);
    if (!dnsResult.success) {
      showSnackbar("Incorrect DNS address!", "error");
      setIsVerified(false);
      setCheckingResolver(false);
      return;
    }
    let result = await getNftItem(resolverAddressNew);
    if (!result || result.title === "") {
      await new Promise((res) => setTimeout(res, 1500));
      result = await getNftCollection(resolverAddressNew);
    }
    if (!result || result.title === "") {
      result = {
        title: shortenAddress(resolverAddressNew),
        image: "",
        subtitle: " ",
        owner_address: resolverAddressNew || ""
      };
    }

    if (result) {
      setResolverData(result);
    }
    setIsVerified(true);
    setCheckingResolver(false);
  };

  const handleSaveTonSite = async () => {
    try {
      if (!resolverAddress) throw new Error("Error: DNS address is missing!");
      let payload;
      if (formData.tonSite) {
        const addr = new AdnlAddress(formData.tonSite);
        payload = manager.createSiteBody(addr, formData.isChecked);
      } else {
        payload = manager.createDeleteRecordBody("site");
      }
      await manager.sendTransaction(resolverAddress, payload);
      showSnackbar(
        "Transaction confirmed by the wallet. Waiting for network confirmation.",
        "sent"
      );
    } catch (error: any) {
      console.error(error);
      showSnackbar(error.message, "error");
    }
  };

  const handleSaveTonStorage = async () => {
    try {
      if (!resolverAddress) throw new Error("Error: DNS address is missing!");
      let payload;
      if (formData.tonStorage) {
        const bagId = new StorageBagId(formData.tonStorage);
        payload = manager.createStorageBody(bagId);
      } else {
        payload = manager.createDeleteRecordBody("storage");
      }
      await manager.sendTransaction(resolverAddress, payload);
      showSnackbar(
        "Transaction confirmed by the wallet. Waiting for network confirmation.",
        "sent"
      );
    } catch (error: any) {
      showSnackbar(error.message, "error");
    }
  };

  const handleSaveWalletAddress = async () => {
    try {
      if (!resolverAddress) {
        alert("Error: DNS address is missing!");
        return;
      }
      const payload = formData.walletAddress
        ? manager.createWalletBody(formData.walletAddress)
        : manager.createDeleteRecordBody("wallet");

      await manager.sendTransaction(resolverAddress, payload);
      showSnackbar(
        "Transaction confirmed by the wallet. Waiting for network confirmation.",
        "sent"
      );
    } catch (error: any) {
      showSnackbar(error.message, "error");
    }
  };

  const handleSaveSubdomains = async () => {
    try {
      if (!resolverAddress) {
        alert("Error: DNS address is missing!");
        return;
      }
      const payload = formData.subdomains
        ? manager.createResolverBody(formData.subdomains)
        : manager.createDeleteRecordBody("dns_next_resolver");
      await manager.sendTransaction(resolverAddress, payload);
      showSnackbar(
        "Transaction confirmed by the wallet. Waiting for network confirmation.",
        "sent"
      );
    } catch (error: any) {
      showSnackbar(error.message, "error");
    }
  };
  const location = useLocation();

  return (
    <Page back={true}>
      {snackbar}
      <Banner
        type="section"
        header="Manage Your DNS"
        subheader="Easily configure your domain settings"
        description="Enter the address of an NFT, Collection, or another DNS contract to manage its DNS records, link a TON Site, update storage, and assign wallet addresses."
        style={{ background: "transparent", boxShadow: "none" }}
      />

      <List>
        <Section
          header={<Section.Header>DNS Address</Section.Header>}
          footer={<Section.Footer>NFT, Collection or other DNS Contract address</Section.Footer>}
        >
          {isVerified ? (
            <Section>
              <Cell
                subtitle={resolverData.subtitle}
                before={resolverData.image ? <Image src={resolverData.image} /> : null}
                after={
                  <IconButton
                    mode="plain"
                    size="l"
                    onClick={() => {
                      setResolverAddress("");
                      setIsVerified(false);
                    }}
                  >
                    <Icon16Cancel />
                  </IconButton>
                }
              >
                {resolverData.title}
              </Cell>
            </Section>
          ) : (
            <Input
              placeholder="Address (e.g. EQ...)"
              value={resolverAddress}
              onChange={(e) => setResolverAddress(e.target.value)}
              after={
                <Button size="s" onClick={handleCheckResolverAddress} mode="plain" loading={checkingResolver}>
                  Check
                </Button>
              }
            />
          )}
        </Section>
      </List>

      {isVerified && (
        <List>
          <Section header={<Section.Header large={false}>TON Sites</Section.Header>}>
            <div style={{ overflow: "hidden", border: "none", paddingBottom: 0 }}>
              <Input
                placeholder="ADNL Address"
                value={formData.tonSite}
                onChange={(e) => handleInputChange("tonSite", e.target.value)}
                after={<Button size="s" mode="plain" onClick={handleSaveTonSite}>Save</Button>}
              />
              <Cell
                Component="label"
                description="Host on TON Storage"
                before={
                  <Checkbox
                    value="1"
                    checked={formData.isChecked}
                    onChange={() => handleInputChange("isChecked", !formData.isChecked)}
                  />
                }
              />
            </div>
          </Section>

          <Section header={<Section.Header large={false}>TON Storage</Section.Header>}>
            <Input
              placeholder="HEX"
              value={formData.tonStorage}
              onChange={(e) => handleInputChange("tonStorage", e.target.value)}
              after={<Button size="s" mode="plain" onClick={handleSaveTonStorage}>Save</Button>}
            />
          </Section>

          <Section header={<Section.Header large={false}>Wallet Address</Section.Header>}>
            <Input
              placeholder="Address (e.g. UQ...)"
              value={formData.walletAddress}
              onChange={(e) => handleInputChange("walletAddress", e.target.value)}
              after={<Button size="s" mode="plain" onClick={handleSaveWalletAddress}>Save</Button>}
            />
          </Section>

          <Section header={<Section.Header large={false}>Subdomains Address</Section.Header>}>
            <Input
              placeholder="Address (e.g. EQ...)"
              value={formData.subdomains}
              onChange={(e) => handleInputChange("subdomains", e.target.value)}
              after={<Button size="s" mode="plain" onClick={handleSaveSubdomains}>Save</Button>}
            />
          </Section>
        </List>
      )}
    <Placeholder />
    </Page>
  );
};
