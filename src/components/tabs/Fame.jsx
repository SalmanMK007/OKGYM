import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import ArtisInput from '../inputs/textfield'
import ArtisButton from '../buttons/button'
import Loader from '../buttons/loader';
import UserService from "../../api/auth";
import { useUser } from "../../hooks/user";

import { FameUserItemWrapper } from './FameUserItem'
import FameModal from './FameModal'

const validationSchema = Yup.object().shape({
    inviteName: Yup.string().required(),
    inviteEmail: Yup.string().email().required(),
    inviteMessage: Yup.string(),
});

const Fame = ({ theme, setIsPendingFame }) => {
    const auth = useUser()
    const [connections, setConnections] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedOrderItems, setSelectedOrderItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [maxOrder, setMaxOrder] = useState(0)

    const getAllFameConnections = async () => {
        try {
            const { profile } = auth.user
            const response = await UserService.getFameConnections()
            if (response.result) {
                if (response.result.pending_fame.length > 0) {
                    setIsPendingFame(true)
                } else {
                    setIsPendingFame(false)
                }
                const verified_connections = []
                const unverified_connections = []
                response.result.all_fame.forEach(fame => {
                    const customerUser = profile.user.id === fame?.sender[0].user_id ? fame?.invitee[0] : fame?.sender[0]
                    if (customerUser.is_kyced) {
                        verified_connections.push({ ...fame, user: customerUser })
                    } else {
                        unverified_connections.push({ ...fame, user: customerUser })
                    }
                })
                setConnections({ verified_connections, unverified_connections, connection_emails: response.result.connection_emails, pending_fame: response.result.pending_fame })
            }
            const orderItems = []
            response.result.verified_connections.forEach(user => {
                if (user.order !== 0) {
                    orderItems.push(user.order.toString())
                }
            })
            setSelectedOrderItems(orderItems)
        } catch (error) {

        }
    }

    useEffect(() => {
        getAllFameConnections()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const deleteConnection = async () => {
        try {
            const { unverified_connections, verified_connections } = connections
            await UserService.deleteFameConnection(selectedUser.id)
            if (!selectedUser.is_kyced) {
                const filtered = unverified_connections.filter(con => con.id !== selectedUser.id)
                setConnections({ ...connections, unverified_connections: filtered })
            } else {
                const filtered = verified_connections.filter(con => con.id !== selectedUser.id)
                const itemToDelete = verified_connections.find(item => item.id === selectedUser.id)
                if (itemToDelete.order !== 0) {
                    const copyOrder = [...selectedOrderItems].filter(item => item !== itemToDelete.order.toString())
                    setSelectedOrderItems(copyOrder)
                }
                setConnections({ ...connections, verified_connections: filtered })
            }
        } catch (error) {

        } finally {
            setIsModalVisible(false)
            setSelectedUser(null)
        }
    }
    return (
        <Box
            sx={{
                flexGrow: 1,
                backgroundColor: theme.palette.primary,
                mt: "2%",
                overflow: "hidden",
                display: "grid",
                boxShadow: 2,
                backgroundSize: "cover",
                backgroundPosition: "0 400px",
                padding: 5,
            }}
        >
            <Box sx={{ display: "flex", flexFlow: "column wrap", marginTop: 3 }}>
                <h3>Invite creatives to your community</h3>
                <Typography>Build your creative community and let them know what you’re up to creatively. Your community members appear under your Bio in all Artis.app public pages. You can automatically notify them of your new works and add them as collaborators.
<br /><br />Value, prestige and protection of your work is built on the strength of your creative community. So invite your comunity now!</Typography>
                <Box sx={{ width: "100%" }} mb={3}>
                    <Formik onSubmit={async (values, { resetForm }) => {
                        const addEmailConnection = () => {
                            const doesExist = connections.connection_emails.find(e => e === values.inviteEmail)
                            if (!doesExist) {
                                const copy_emails = [...connections.connection_emails, values.inviteEmail]
                                setConnections({ ...connections, connection_emails: copy_emails })
                            }
                        }
                        try {
                            setIsLoading(true)
                            const response = await UserService.sendFameInvitation({ invitee_name: values.inviteName, invitee_email: values.inviteEmail.toLowerCase(), invitee_message: values.inviteMessage })
                            const { unverified_connections, verified_connections } = connections
                            if (response.result) {
                                if (response.result.is_kyced) {
                                    const copy_verified = [...verified_connections, response.result]
                                    setConnections({ ...connections, verified_connections: copy_verified })
                                    addEmailConnection()
                                } else {
                                    const copy_unverified = [...unverified_connections, response.result]
                                    setConnections({ ...connections, unverified_connections: copy_unverified })
                                    addEmailConnection()
                                }
                                resetForm()
                            } else {
                                addEmailConnection()
                                resetForm()
                            }

                        } catch (error) {
                            console.error(error)
                        } finally {
                            setIsLoading(false)
                        }
                    }} validationSchema={validationSchema} initialValues={{ inviteName: "", inviteEmail: "", inviteMessage: "" }}>
                        {({ setFieldValue, values, handleSubmit, isValid, dirty }) => {
                            return (
                                <Form>
                                    <ArtisInput
                                        label="Their name"
                                        id="name"
                                        value={values.inviteName}
                                        onChange={(e) => setFieldValue("inviteName", e.target.value)}
                                    />
                                    <ArtisInput
                                        label="Their email"
                                        id="email"
                                        value={values.inviteEmail}
                                        onChange={(e) => setFieldValue("inviteEmail", e.target.value)}
                                    />
                                    <ArtisInput
                                        label="Personal message from you."
                                        id="message"
                                        value={values.inviteMessage}
                                        multiline
                                        onChange={(e) => setFieldValue("inviteMessage", e.target.value)}
                                    />

                                    {isLoading ? <Loader /> :
                                        <ArtisButton
                                            id="submit"
                                            onClick={handleSubmit}
                                            name="Send Invitation"
                                            disabled={!(isValid && dirty)}
                                            sx={{
                                                fontSize: "1.5rem",
                                                mb: 3,
                                            }}
                                        />
                                    }
                                </Form>
                            )
                        }}
                    </Formik>
                    {connections?.connection_emails.length > 0 &&
                        <Typography>Sent invitations. If someone has not responded, or lost your invite, just send a new one.</Typography>
                    }
                    <Box sx={{ marginBottom: 5 }}>{connections?.connection_emails.map((email, index) => {
                        const addComma = connections?.connection_emails.length !== index + 1 ? ',' : ''
                        return (
                            <span style={{ color: 'grey' }}>{email}{addComma} </span>
                        )
                    })}</Box>
                    {connections?.pending_fame?.length > 0 &&
                        <>
                            {/* <br/>
                            <br/> */}
                            <h3 color="blue" >Connection Requests</h3>
                            
                            {connections?.pending_fame?.map(pending => {
                                const customerUser = pending.sender[0]
                                const { profile } = auth.user
                                const name = customerUser?.first_name && customerUser?.last_name ?
                                    `${customerUser?.first_name} ${customerUser?.last_name}` : pending.invitee_name
                                return (
                                    <FameUserItemWrapper
                                        user={{ ...customerUser }}
                                        name={name}
                                        shouldExpand={true}
                                        userProfile={profile}
                                        order={pending.order}
                                        is_kyced={customerUser.is_kyced}
                                        isPending={true}
                                        fame={pending}
                                        getAllFameConnections={getAllFameConnections}
                                     />
                                )
                            })}
                            {/* <br />
                            <br /> */}
                        </>
                    }
                    <Box sx={{ display: "flex", flexFlow: "column wrap" }}>
                        <h3>Manage your creative community</h3>
                        {connections?.verified_connections?.length === 0 && connections?.unverified_connections?.length === 0 &&
                            <Typography fontSize="1.2rem"
                                component="h3"
                                color="black"
                                display="inline">No connections yet</Typography>
                        }
                        {connections?.verified_connections?.length > 0 &&
                            <>

                                {connections?.verified_connections?.map(fame => {
                                    const { profile } = auth.user
                                    const customerUser = fame.user
                                    const name = customerUser?.first_name && customerUser?.last_name ?
                                        `${customerUser?.first_name} ${customerUser?.last_name}` : fame.invitee_name
                                    return (
                                        <FameUserItemWrapper
                                            user={{ ...customerUser }}
                                            name={name}
                                            shouldExpand={true}
                                            order={fame.order}
                                            fame={fame}
                                            getAllFameConnections={getAllFameConnections}
                                            maxOrder={maxOrder}
                                            allConnections={connections?.verified_connections}
                                            setMaxOrder={setMaxOrder}
                                            userProfile={profile}
                                            is_kyced={customerUser.is_kyced}
                                            onDelete={() => {
                                                setSelectedUser({ name, id: fame.id, is_kyced: true })
                                                setIsModalVisible(true)
                                            }} />
                                    )
                                })}
                            </>
                        }
                        {connections?.unverified_connections?.length > 0 &&
                            <>

                                {connections?.unverified_connections?.map(fame => {
                                    const { profile } = auth.user
                                    const customerUser = fame.user
                                    const name = customerUser?.first_name && customerUser?.last_name ?
                                        `${customerUser?.first_name} ${customerUser?.last_name}` : fame.invitee_name
                                    return (
                                        <FameUserItemWrapper
                                            user={{ ...customerUser }}
                                            name={name}
                                            shouldExpand={true}
                                            userProfile={profile}
                                            order={fame.order}
                                            is_kyced={customerUser.is_kyced}
                                            onDelete={() => {
                                                setSelectedUser({ name, id: fame.id, is_kyced: false })
                                                setIsModalVisible(true)
                                            }} />
                                    )
                                })}
                            </>
                        }
                    </Box>

                </Box>
                {/* <br /> */}
                <div>
                    <center>
                        <FameModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} name={selectedUser?.name} handleConfirm={deleteConnection} />
                    </center>
                </div>
            </Box>
            <Typography fontSize="0.9rem"
                component="h2"
                gutterBottom
                width="100%"
                float="right"
                textAlign="right">Tap name
                to display more information<br />
                <img style={{ height: 10 }} alt="identity validated" src="/images/GoldWreath.jpg" />
                 = identity confirmed with government documents
                 </Typography>
            
        </Box>
    )
}

export default Fame
