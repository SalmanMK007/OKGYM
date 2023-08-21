import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import UserService from "../../api/auth";
import ArtisButton from "../buttons/button";
import Loader from "../buttons/loader";

const possibleOrder = ["0", "1", "2", "3"];

const label = {
  inputProps: {
    "aria-label": "Move this account to the top of your public pages.",
  },
};

const acceptInvite = async (fame, getAllFameConnections) => {
  const payload = [];
  try {
    payload.push({ id: fame.id, status: 3 });
    await UserService.updateOrder(payload);
    if (getAllFameConnections) {
      await getAllFameConnections();
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteInvite = async (fame, getAllFameConnections) => {
  try {
    await UserService.deleteFameConnection(fame.id);
    if (getAllFameConnections) {
      await getAllFameConnections();
    }
  } catch (error) {}
};

const updateOrder = async ({
  fame,
  order,
  allConnections,
  getAllFameConnections,
  setIsLoading,
  setIsExpanded,
}) => {
  const payload = [];
  try {
    if (order === 0) {
      payload.push({ id: fame.id, order });
      await UserService.updateOrder(payload);
    } else {
      let currentOrder = 1;
      payload.push({ id: fame.id, order: currentOrder });
      const filtered = allConnections
        .filter((con) => con.id !== fame.id)
        .filter((t) => t.order !== 0)
        .sort((a, b) => a.order - b.order);
      filtered.forEach((f) => {
        if (f.order !== 0) {
          currentOrder += 1;
          payload.push({ id: f.id, order: currentOrder });
        }
      });
      await UserService.updateOrder(payload);
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (getAllFameConnections) {
      //getAllFameConnections()
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // setIsExpanded(false)
  }
};

const FameUserItem = ({
  children,
  showOrder,
  allConnections,
  user,
  name,
  is_kyced,
  order,
  maxOrder,
  setMaxOrder,
  onDelete,
  selectedOrderItems,
  setSelectedOrderItems,
  onClick,
  shouldExpand,
  isPending,
  fame,
  getAllFameConnections,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState(order !== 0);
  const [isLoading, setIsLoading] = useState(false);
  const customerUser = user;
  return (
    <Box
      sx={{
        cursor: "pointer",
        marginBottom: 1,
        marginTop: 1,
        padding: "5px 5px 5px 5px",
        borderRadius: 1,
        borderLeft: 1,
        borderRight: 1,
        borderTop: 1,
        borderBottom: 1,
        borderColor: "#D3D3D3",
      }}
    >
      <Box
        sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}
        onClick={() => {
          if (onClick && !isExpanded) {
            onClick();
          }
          if (shouldExpand) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {shouldExpand && (
          <>
            {customerUser.photo ? (
              <img
                style={{ marginRight: 15, objectFit: "cover", width: 24 }}
                src={`${customerUser.photo}`}
                alt="profileimg"
              />
            ) : (
              <PersonIcon />
            )}
          </>
        )}
        <Typography 
          sx={{ 
            paddingLeft: shouldExpand ? 0 : "25px",
          }}
        >
          {name}
        </Typography>
        {is_kyced && (
          <img
            style={{ height: 10, marginLeft: 2, marginRight: 10 }}
            alt="identity validated"
            src="/images/GoldWreath.jpg"
          />
        )}
      </Box>
      {isExpanded && (
        <>
          <Box
            sx={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              mt: 2,
              ml: 2,
            }}
          >
            <Box>
              <div>
                {customerUser?.photo && (
                  <>
                    <img
                      style={{
                        margin: "0 15px 15px 0",
                        objectFit: "cover",
                        width: 150,
                      }}
                      src={`${customerUser.photo}`}
                      alt="profileimg"
                    />
                  </>
                )}
              </div>
            </Box>

            <Box sx={{ display: "flex", flexFlow: "column wrap" }}>
              {customerUser?.artist_bio && (
                <>
                  <Typography
                    sx={{
                      fontSize: "14.5px",
                      color: "gray",
                      fontStyle: "italic"
                    }}
                  >
                    {customerUser?.artist_bio}
                  </Typography>
                  <br />
                </>
              )}
              {customerUser?.artist_website && (
                <>
                  <Typography>
                    <a href={customerUser?.artist_website}>
                      {customerUser?.artist_website}
                    </a>
                  </Typography>
                  <br />
                </>
              )}
            </Box>

            <Box>
              {setSelectedOrderItems && (
                <select
                  style={{ width: 50 }}
                  onChange={setSelectedOrderItems}
                  value={order.toString()}
                  disabled={
                    selectedOrderItems.length === 3 &&
                    !selectedOrderItems.includes(order.toString())
                  }
                >
                  {possibleOrder.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              )}
            </Box>
          </Box>
        </>
      )}
      {isExpanded && (
        <>
          {children}
          {isPending && (
            <Box sx={{ display: "flex", flexFlow: "row" }}>
              <ArtisButton
                name="Decline invitation"
                textColor="red"
                onClick={() => deleteInvite(fame, getAllFameConnections)}
                sx={{
                  fontSize: "1.5rem",
                }}
              />
              <ArtisButton
                name="Accept Invitation"
                textColor="green"
                onClick={() => acceptInvite(fame, getAllFameConnections)}
                sx={{
                  fontSize: "1.5rem",
                }}
              />
            </Box>
          )}
        </>
      )}
      {isExpanded && (
        <>
          <Box sx={{ paddingBottom: 2, paddingTop: 2 }}>
            {onDelete && (
              <center>
                <div
                  style={{
                    borderTop: "2px solid #D3D3D3 ",
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                ></div>
                <br />
                <br />
                <DeleteIcon sx={{ color: "red" }} onClick={onDelete} />
              </center>
            )}
          </Box>
        </>
      )}

      {isExpanded && is_kyced && showOrder && (
        <>
          <div>
            <center>
              <FormControlLabel
                control={
                  <Switch
                    checked={isChecked}
                    onChange={(e) => {
                      setIsChecked(!isChecked);
                    }}
                    {...label}
                  />
                }
                label="Show account at top of community lists on public pages."
              />
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column wrap",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                {!isLoading && (
                  <ArtisButton
                    id="submit"
                    onClick={async () => {
                      setIsLoading(true);
                      if (isChecked) {
                        const ord = maxOrder + 1;
                        updateOrder({
                          fame,
                          order: ord,
                          allConnections,
                          getAllFameConnections,
                          setIsLoading,
                          setIsExpanded,
                        });
                        setMaxOrder(ord);
                      } else {
                        updateOrder({
                          fame,
                          order: 0,
                          getAllFameConnections,
                          setIsLoading,
                          setIsExpanded,
                        });
                      }
                    }}
                    name="Update"
                    sx={{
                      color: "blue",
                      fontSize: "1.2rem",
                      mb: 3,
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexFlow: "row wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Loader isLoading={isLoading} />
                </Box>
              </Box>
            </center>
          </div>
        </>
      )}
    </Box>
  );
};

export const FameUserItemWrapper = ({
  user,
  showOrder = true,
  allConnections,
  name,
  maxOrder,
  setMaxOrder,
  is_kyced,
  order,
  onDelete,
  selectedOrderItems,
  setSelectedOrderItems,
  shouldExpand,
  userProfile,
  isPending = false,
  fame,
  getAllFameConnections,
}) => {
  const [subConnections, setSubConnections] = useState(null);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if (order > maxOrder) {
      setMaxOrder(order);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!user.is_active) return null;
  const handleClick = async () => {
    if (userId === user.user_id) return;
    setUserId(user.user_id);
    try {
      const response = await UserService.getFameConnections(
        `?id=${user.user_id}`
      );
      if (response.result) {
        const verified_connections = [];
        const unverified_connections = [];
        response.result.all_fame.forEach((fame) => {
          const customerUser =
            user.user_id === fame?.sender[0].user_id
              ? fame?.invitee[0]
              : fame?.sender[0];
          if (customerUser.is_kyced) {
            verified_connections.push({ ...fame, user: customerUser });
          } else {
            unverified_connections.push({ ...fame, user: customerUser });
          }
        });
        setSubConnections({ verified_connections, unverified_connections });
      }
    } catch (error) {}
  };
  return (
    <FameUserItem
      user={user}
      name={name}
      order={order}
      maxOrder={maxOrder}
      setMaxOrder={setMaxOrder}
      is_kyced={is_kyced}
      selectedOrderItems={selectedOrderItems}
      onDelete={onDelete}
      setSelectedOrderItems={setSelectedOrderItems}
      onClick={handleClick}
      shouldExpand={shouldExpand}
      isPending={isPending}
      fame={fame}
      getAllFameConnections={getAllFameConnections}
      allConnections={allConnections}
      showOrder={showOrder}
    >
      <Box
        sx={{
          marginLeft: { xs: 0, md: 0, lg: 2.5 },
          martinRight: { xs: 0, md: 0, lg: 2.5 },
        }}
      >
        {subConnections?.verified_connections?.length > 0 &&
          subConnections?.verified_connections?.map((con) => {
            const customerUser = con.user;
            const name =
              customerUser?.first_name && customerUser?.last_name
                ? `${customerUser?.first_name} ${customerUser?.last_name}`
                : con.invitee_name;
            if (!customerUser.is_active) return null;
            return (
              <FameUserItem
                user={customerUser}
                name={name}
                order={con.order}
                is_kyced={customerUser.is_kyced}
                shouldExpand={customerUser.id !== userProfile.id}
                showOrder={false}
              />
            );
          })}
      </Box>
      <Box sx={{ marginLeft: { xs: 0, md: 0, lg: 2.5 } }}>
        {subConnections?.unverified_connections?.length > 0 &&
          subConnections?.unverified_connections?.map((con) => {
            const customerUser = con.user;
            const name =
              customerUser?.first_name && customerUser?.last_name
                ? `${customerUser?.first_name} ${customerUser?.last_name}`
                : con.invitee_name;
            if (!customerUser.is_active) return null;

            return (
              <FameUserItem
                user={customerUser}
                name={name}
                order={con.order}
                is_kyced={customerUser.is_kyced}
                shouldExpand={customerUser.id !== userProfile.id}
                showOrder={false}
              />
            );
          })}
      </Box>
    </FameUserItem>
  );
};

export default FameUserItem;
