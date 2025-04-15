import React, { useState } from "react";
import { useTonWallet, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Button, Caption, Cell, Modal, Placeholder, Title } from "@telegram-apps/telegram-ui";

import { shortenAddress } from "@/utils/address";

import "./style.css";
import tonSvg from "./ton.svg";
import telegramGif from "./telegram.gif";

const Header: React.FC = () => {
  const address = useTonAddress();
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isTestnet = wallet?.account?.chain === "-3";

  const handleDisconnect = (): void => {
    tonConnectUi.disconnect();
    setIsModalOpen(false);
  };

  return (
    <>
      {isTestnet && (
        <div className="testnetBanner">
          <Caption>Attention! This is a testnet version.</Caption>
        </div>
      )}
      <div className="headerContainer">
        <Cell
          style={{ margin: "10px 0" }}
          before={
            <div className="logoContainer">
              <img src={tonSvg} alt="TON Logo" className="logoImage" />
              <Title weight="1" >DNS</Title>
            </div>
          }
          after={
            wallet ? (
              <Modal
                overlayComponent={
                  <div className="modalOverlay" style={{ opacity: isModalOpen ? 1 : 0 }} />
                }
                trigger={
                  <Button style={{ outline: "none" }} mode="bezeled">
                    {shortenAddress(address)}
                  </Button>
                }
                onOpenChange={setIsModalOpen}
              >
                <Placeholder description="Are you sure you want to disconnect?" header="Confirm Disconnect">
                  <img alt="Telegram sticker" src={telegramGif} className="modalImage" />
                </Placeholder>
                <Placeholder>
                  <Button mode="bezeled" onClick={handleDisconnect}>
                    Yes, Disconnect
                  </Button>
                </Placeholder>
              </Modal>
            ) : (
              <Button style={{ backgroundColor: "#2196F3" }} onClick={() => tonConnectUi.openModal()}>Connect Wallet</Button>
            )
          }
        />
      </div>
    </>
  );
};

export default Header;
