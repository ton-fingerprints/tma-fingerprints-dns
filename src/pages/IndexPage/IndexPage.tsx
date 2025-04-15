import { FC } from "react";
import {
  Banner,
  ButtonCell,
  Cell,
  List,
  Section,
} from "@telegram-apps/telegram-ui";
import {
  Icon24Globe,
  Icon24FolderSimpleOutline,
  Icon24FolderSimplePlusOutline,
  Icon24PenOutline,
  Icon24AddCircleOutline,
} from "@vkontakte/icons";
import { Link } from "@/components/Link/Link.tsx";
import { Page } from "@/components/Page";

const IconWrapper = ({ children, bgColor }: { children: React.ReactNode; bgColor: string }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

export const IndexPage: FC = () => {
  return (
    <Page back={false}>
      <Banner
        type="section"
        header="TON DNS X"
        subheader="Simplified domain management"
        description="Effortlessly manage your TON domains, configure DNS records, create subdomains, and organize collections—all in one place."
       style={{ background: "transparent", boxShadow: "none" }}
      />

      <List>
        <Section>
          <Cell
            before={
              <IconWrapper bgColor="#FF9800">
                <Icon24FolderSimpleOutline color="#FFFFFF" />
              </IconWrapper>
            }
            subtitle="Create a collection of subdomains"
            multiline
          >
            Create Collection
          </Cell>
          <Link to="/create-collection">
            <ButtonCell before={<Icon24AddCircleOutline />}>Create</ButtonCell>
          </Link>
        </Section>
      </List>

      <List>
        <Section>
          <Cell
            before={
              <IconWrapper bgColor="#4CAF50">
                <Icon24FolderSimplePlusOutline color="#FFFFFF" />
              </IconWrapper>
            }
            subtitle="Add a subdomain to a collection"
            multiline
          >
            Add Subdomain
          </Cell>
          <Link to="/add-subdomain">
            <ButtonCell before={<Icon24AddCircleOutline />}>Add</ButtonCell>
          </Link>
        </Section>
      </List>

      <List>
        <Section>
          <Cell
            before={
              <IconWrapper bgColor="#2196F3">
                <Icon24Globe color="#FFFFFF" />
              </IconWrapper>
            }
            subtitle="Edit and manage DNS records"
            multiline
          >
            Manage DNS
          </Cell>
          <Link to="/manage">
            <ButtonCell before={<Icon24PenOutline />}>Manage</ButtonCell>
          </Link>
        </Section>
      </List>
      <Cell />
    </Page>
  );
};
