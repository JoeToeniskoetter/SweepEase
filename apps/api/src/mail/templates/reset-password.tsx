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
}

export default function ResetPasswordEmail({ link }: Props) {
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
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>SweepInspectr</Text>
            <Text style={text}>Hi,</Text>
            <Text style={text}>
              Someone recently requested a password change for your
              SweepInspectr account. If this was you, you can set a new password
              here:
            </Text>
            <Button style={button} href={link}>
              Reset password
            </Button>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
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

export const renderResetPasswordEmail = ({ link }: Props) =>
  render(<ResetPasswordEmail link={link} />);

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
  //   fontFamily: 'Roboto',
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
