import React, { useState } from "react";
import Box from "@mui/material/Box";
import LocalOffer from "@mui/icons-material/LocalOffer";
import { toast } from "react-toastify";

import CollapsibleBody from "../../../collapsible";
import utils from "../../../../utils";
import { Typography } from "@mui/material";
import ArtisInput from "../../../inputs/textfield";
import ArtisButton from "../../../buttons/button";
import ConfirmDialog from "../../../dialogs/confirm";

const getSaleStatus = (tx_hash) => {
  if (tx_hash) {
    if (tx_hash === "0") return "On Sale";
    else return "Sold";
  }
  return "Sell";
};

export default function Sell(props) {
  const [saleStatus, setSaleStatus] = useState(
    getSaleStatus(props.sold_tx_hash)
  );
  const [price, setPrice] = useState(props?.sold_price || "");
  const [buyer, setBuyer] = useState(props?.sold_buyer || "");
  const [email, setEmail] = useState(props?.sold_email || "");
  const [soldDate, setSoldDate] = useState(props?.sold_date || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [saleDescription, setSaleDescription] = useState(props?.sale_description || "")

  const _handlePutOnSale = async (e) => {
    e.preventDefault();
    const result = await props.handlePutOnSale(price, saleDescription);
    if (result) setSaleStatus("On Sale");
  };

  const _handleCancelSale = async (e) => {
    e.preventDefault();
    const result = await props.handleCancelSale();
    if (result) setSaleStatus("Sell");
  };

  const _handleSale = async () => {
    setModalOpen(false);
    const result = await props.handleSale(buyer, email);
    if (result) {
      setSaleStatus("Sold");
      setSoldDate(new Date().toISOString().slice(0, 10));
    }
    toast.success("Sale request has been submitted!", {
      onClose: () => {
        setTimeout(() => {
          props.updateWork();
        }, 20000);
      },
    });
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const soldContent = () => (
    <Box textAlign="center">
      <Box color="gray">Acquired by:</Box>
      <Box>{buyer}</Box>
      <Box color="gray">{email}</Box>
      {soldDate && (
        <Box mb={2}>
          for {price} on {utils.formatDate(soldDate)}
        </Box>
      )}
    </Box>
  );

  const sellContent = () => (

    <Box ml={3} mr={3} mb={3} component="form" onSubmit={_handlePutOnSale} mt={3}>
       {/* <br /> */}
       <div align="center">
                    <iframe title="explainer" src="https://player.vimeo.com/video/769159375?h=38198d3f37" width="300" height="300" style={{boxShadow: '1px 2px 5px #AAAAAA',}}  allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
      </div>
      <Box color="gray" mt={3}>     
        {/* <br /> */}
        Enter a price below to place the work on Sale. The price and its
        status of being on sale will appear on the publically visable Proof of Copyright Registration.
      </Box>

      <Box textAlign="center">
        <ArtisInput
          value={price}
          label="Price"
          id="sold_price"
          onChange={(e) => setPrice(e.target.value)}
        />
        <ArtisInput
          value={saleDescription}
          label="Describe sale"
          id="sale_description"
          onChange={(e) => setSaleDescription(e.target.value)}
        />
        <ArtisButton
          name="Start Sale"
          size="medium"
          id="start_sale"
          sx={{
            fontSize: "1.5rem",
          }}
        />
      </Box>
    </Box>
  );

  const onSaleContent = () => (
    <Box component="form" ml={3} mr={3} mb={3}>
      <Box color="gray" textAlign="center" mt={3} mb={3}>
        {/* <br /> */}
        Price displayed on Proof of Registration:
      </Box>
      {/* <br /> */}
      <Box textAlign="center">
        <Box
          component="div"
          style={{ borderRadius: 10, minHeight: 50, backgroundColor: '#e0e0e0', width: "100%", display: "flex", flexFlow: "column wrap", justifyContent: "center", alignItems: "center" }}
          sx={{
            fontSize: "1.3rem",
            mt: 1,
            fontFamily: "Bellefair, serif",
            fontWeight: 400,
            backgroundColor: 'grey'
          }}
        >
          <Typography
            color="teal"
            sx={{
              textDecoration: "underline",
              fontSize: "3rem",
            }}
          >
            {price}
          </Typography>
          <Typography sx={{
              fontSize: "1.5rem",
              marginTop: 1,
              marginBottom: 1,
            }}>
            {saleDescription}
          </Typography>
        </Box>
        <ArtisButton
          name="CANCEL SALE"
          id="cancel_sale"
          onClick={_handleCancelSale}
          size="medium"
          sx={{
            fontSize: "1.5rem",
          }}
          textColor="black"
        />
      </Box>
      {/* <br /> */}
      <Box color="gray" mt={3}>
        After this work is sold, enter the new owner's name and email below.
        Then press 'Record Sale'. The transaction will be recorded on the
        blockchain and copies will be emailed to you and the new owner. Additionally,
        the new owner's name will be display on the Proof of Copyright Registration.
      </Box>
      <ArtisInput
        label="New owner"
        id="sold_buyer"
        value={buyer}
        onChange={(e) => setBuyer(e.target.value)}
      />
      <ArtisInput
        label="New owner email"
        id="sold_email"
        value={email}
        name="Sold email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <ArtisButton
        name="RECORD SALE"
        size="medium"
        sx={{
          fontSize: "1.5rem",
        }}
        disabled={!utils.validateBasicForm(email, buyer)}
        onClick={handleOpen}
        type="button"
      />
      <ConfirmDialog
        price={price}
        buyer={buyer}
        title={props?.title}
        handleClose={handleClose}
        open={modalOpen}
        handleConfirm={_handleSale}
      />
    </Box>
  );

  return (
    <CollapsibleBody
      expanded={props.openId === "sell-body"}
      id="sell-body"
      title={saleStatus}
      icon={<LocalOffer />}
      handleClick={props.setOpenId}
      mainSx={{
        alignItems: "center",
        fontSize: "1.3rem",
        fontFamily: "'Bellefair', serif;",
        fontWeight: "normal",
      }}
      buttonProps={{
        textColor:
          saleStatus === "On Sale"
            ? "teal"
            : saleStatus === "Sold"
              ? "brown"
              : "black",
      }}
    >
      {saleStatus === "On Sale" && onSaleContent()}
      {saleStatus === "Sell" && sellContent()}
      {saleStatus === "Sold" && soldContent()}
    </CollapsibleBody>
  );
}
