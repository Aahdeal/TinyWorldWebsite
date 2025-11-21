import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      className='bg-primary/65 rounded-t-2xl'
      sx={{
        color: 'white',
        py: 3,
        mt: 'auto',
      }}
    >
      <Container>
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} TinyWorld. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Handcrafted by Emily-Jane Felix
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Link href="https://www.instagram.com/tiny.w0rld/" color="inherit" target="_blank">
            Instagram
          </Link>
          <Link href="https://wa.me/+27848372182" color="inherit" target="_blank">
            WhatsApp
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

