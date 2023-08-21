import ApiClient from "./_client";

class AuthService {
    /**
     * Login function
     * @param {*} username 
     * @param {*} password 
     */
    static async login(username, password) {
        const response = await ApiClient.processRequest('/login/', { username, password });
        return response.result || null;
    }

    /**
     * 
     * @param {*} token 
     * @param {*} username 
     * @returns 
     */
    static async refresh(token, username) {
        const response = await ApiClient.processRequest('/refresh-token/', {refresh: token, username});
        return response.result || null;
    }

    /**
     * Sign up function
     * @param {*} username 
     * @param {*} email 
     * @param {*} password 
     * @param {*} profie - Profile instance
     */
    static async signUp(uid, inviteCode, body) {
        return (await ApiClient.processRequest(
            `/signup/${uid}/${inviteCode}/`,
            body,
            false
        ));
    }

    /**
     * Get form
     * @param {*} uid 
     * @param {*} inviteCode 
     */
    static async signUpWithInviteCode(uid, inviteCode) {
        const response = (await ApiClient.processRequest(`/signup/${uid}/${inviteCode}/`));
        return response.result || null;
    }

    /**
     * Invite user
     * @param {*} uid 
     * @param {*} email 
     */
    static async invite(uid, email) {
    }

    /**
     * Update bio of user
     * @param {*} uid 
     * @param {*} bio 
     */
    static async updateProfile(body) {
        return (await ApiClient.processRequest(`/user/profile/update/`, body, false, true));
    }

    /**
     * Get invited users
     */
    static async getInvitedUsers() {
        return (await ApiClient.processRequest('users/invited-users/'));
    }

    static async getVerificationStatus() {
        return await ApiClient.processRequest('users/verification-status')
    }

    /**
     * Invite user
     * @param {*} body 
     * @returns 
     */
    static async inviteUser(body) {
        return (await ApiClient.processRequest('users/invite/', body, true));
    }

    /**
     * Update artist type
     */
    static async updateArtistType(body) {
        return (await ApiClient.processRequest(`/type_update/`, body, true));
    }

    static async updateKyced(body) {
        return (await ApiClient.processRequest(`/kyced_update/`, body, true));
    }
    
    static async updateVerification(body) {
        return (await ApiClient.processRequest(`/update_verification/`, body, false));
    }

    static async sendFameInvitation(body) {
        return (await ApiClient.processRequest(`/fame/`, body, false));
    }

    static async getFameConnections(query="") {
        return (await ApiClient.processRequest(`/fame/${query}`));
    }

    static async deleteFameConnection(id) {
        return (await ApiClient.deleteReq(`/fame/${id}/delete/`));
    }

    static async updateOrder(body) {
        return (await ApiClient.processRequest("/fame/", body, true, true))
    }

    /**
     * Update tags and default tags
     */
    static async updateTags(body) {
        return (await ApiClient.processRequest(`/default_tags/`, body, true));
    }

    /**
     * Reset password
     */
    static async resetPassword(body) {
        return (await ApiClient.processRequest(`/password_reset/`, body, true));
    }

    /**
     * Verify reset
     * @param {*} token
     */
    static async verifyReset(body) {
        return (await ApiClient.processRequest(`/password_reset/confirm/`, body, true));
    }

    /**
     * Submit email for registration
     * @param {*} body
     */
    static async submitEmail(body) {
        return (await ApiClient.processRequest(`/users/submit-email/`, body, true));
    }
}

export default AuthService;