import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Html,
  Preview,
  render,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface Props {
  link: string;
  companyName: string;
}

export default function CompanyInvite({ link, companyName }: Props) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>SweepInspectr Invite</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>SweepInspectr</Text>
            <Text style={text}>Hi,</Text>
            <Text style={text}>
              Someone at {companyName} has invited you to join their
              SweepInspectr account. You can accept this invitation by following
              the link here:
            </Text>
            <Button style={button} href={link}>
              Join {companyName}
            </Button>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
            <Text style={text}>Have a nice day!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const renderCompanyInviteEmail = ({ link, companyName }: Props) =>
  render(<CompanyInvite link={link} companyName={companyName} />);

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const title = {
  ...text,
  fontSize: '22px',
  fontWeight: '700',
  lineHeight: '32px',
};

const button = {
  backgroundColor: '#f2b28a',
  borderRadius: '4px',
  color: '#fafafa',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

// const anchor = {
//   textDecoration: "underline",
// };
