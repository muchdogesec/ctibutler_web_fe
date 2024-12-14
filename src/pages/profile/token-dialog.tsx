import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function ApiKeyDialog({ open, onClose, apiKey }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>API Secret Key</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          Here is your API secret key. Please keep it secure.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          {apiKey}
        </Typography>
      </DialogContent>
      <DialogActions>
        <CopyToClipboard text={apiKey} onCopy={handleCopy}>
          <Button
            variant="contained"
            color={copied ? "success" : "primary"}
            startIcon={<ContentCopyIcon />}
          >
            {copied ? "Copied!" : "Copy Key"}
          </Button>
        </CopyToClipboard>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApiKeyDialog;
