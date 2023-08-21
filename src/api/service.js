import ApiClient from "./_client";

/**
 * Api client request related to Work
 */
class WorkService {
  static async getWork(artisCode) {
    return await ApiClient.processRequest(`/works/${artisCode}/`, null);
  }

  /**
   * Get works by request params
   * @param {*} uid - user id (required)
   * @param {*} page - page number
   * @param {*} search - search pattern
   * @param {*} tags - list of tags
   * @param {*} sort - sort by (asc, desc)
   * @param {*} ordering - order by (title, registerd_date)
   * @param {*} size - size of page
   */
  static async getWorks(queryForm) {
    return await ApiClient.processRequest(
      "/works/",
      null,
      false,
      false,
      queryForm
    );
  }

  /**
   * Create new work
   * @param {*} uid - user id (required)
   * @param {*} body - body of request
   * @returns response
   */
  static async createWork(body) {
    return await ApiClient.processRequest("/works/new/", body);
  }

  static async createCollaborators(body) {
    return await ApiClient.processRequest("/works/collaborators/", body);
  }

  static async createRegistrar(body) {
    return await ApiClient.processRequest("/works/registrars/", body);
  }

  static async updateRegistrar(body) {
    return await ApiClient.processRequest("/works/registrars/update/", body);
  }

  static async deleteRegistrar(id) {
    return await ApiClient.processRequest(`/works/registrars/${id}/delete/`);
  }

  static async getRegistrar(artis_code) {
    return await ApiClient.processRequest(`/works/registrars/${artis_code}/get/`);
  }

  static async getCollaboratorStatus() {
    return await ApiClient.processRequest("/works/collaborators/");
  }
  static async getCollaboratorById(body) {
    return await ApiClient.processRequest(`/works/collaborators/get/`, body);
  }
  static async updateCollab(body) {
    return await ApiClient.processRequest("/works/collaborators/",body,true,true);
  }

  static async deleteWorkAndCollab(id) {
    return await ApiClient.deleteReq(`/works/collaborators/${id}/delete/`);
  }

  static async getTagsById(body) {
    return await ApiClient.processRequest("/works/tagsview/", body);
  }

  static async updateTagsById(body) {
    return await ApiClient.processRequest("/works/tagsupdate/", body);
  }

  /**
   * Update work
   * @param {*} uid user id (required)
   * @param {*} workId - artis code of work
   * @param {*} body - body to send with request
   * @returns response
   */
  static async updateWork(workId, body) {
    return await ApiClient.processRequest(`/works/${workId}/update/`,body,true,true);
  }

  /**
   * Uploads file
   */
  static async uploadFile(body) {
    return await ApiClient.processRequest("/works/upload/", body, false);
  }

  static async uploadVideoFile(body) {
    return await ApiClient.processRequest("/works/uploadVideo/", body, false);
  }

  /**
   * Verify the work
   * @param {*} workId
   * @param {*} body
   * @returns
   */
  static async verifyFile(workId, body) {
    return await ApiClient.processRequest(`/works/${workId}/verify/`,body,false
    );
  }

  /**
   *
   * @param {*} workId
   * @param {*} body
   * @returns
   */
  static async sendWarningEmail(workId, body) {
    return await ApiClient.processRequest(`/works/warning/${workId}/`,body,false
    );
  }

  /**
   * get previous warning emails for the work
   * @param {*} workId
   * @returns
   */
  static async getPreviousWarnings(workId) {
    return await ApiClient.processRequest(`/works/warning/${workId}/`, null);
  }

  /**
   * Look up registered work
   * @param {*} artisCode
   * @returns
   */
  static async lookup(artisCode) {
    return await ApiClient.processRequest(`/works/look_up/`,{artis_code: artisCode,});
  }
}

export default WorkService;
