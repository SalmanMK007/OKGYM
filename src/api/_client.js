import axios from './axios';

const { get, post, put } = axios;

class ApiClient {
    /**
     * Construct url with given request params
     * @param {*} baseUrl - 
     * @param {*} params - mapping between request param and its value
     * @returns final url
     */
    static _constructUrl(baseUrl, params) {
        return Object.entries(params).reduce((acc, cur, i) => {
            if (cur[1]) {
                if (i===0) acc = acc.concat(`?${cur[0]}=${cur[1]}`);
                else acc = acc = acc.concat(`&${cur[0]}=${cur[1]}`);
            }
            return acc;
        }, baseUrl);
    }

    /**
     * Process incoming response
     * @param {*} response 
     * @returns Response object 
     */ 
    static _processResponse(response) {
        if (response.data && response.data.error) {
            return {
                error: response.data.error
            }
        }
        
        else if (response.status === 201 || response.status === 200) {
            return {
                result: response.data
            }
        }
    
        return {
            error: response.data,
        }
    }

    /**
     * Process api request
     * @param {*} url - url of request
     * @param {*} body - body to pass (for POST, PATCH)
     */
    static async processRequest(url, body=null, json=true, update=false, params={}) {
        try {
            if (body && !update) {
                const response = await post(
                    url,
                    json ? JSON.stringify(body) : body,
                );
                return this._processResponse(response);
            }

            if (update && body) {
                const response = await put(url, body,);
                return this._processResponse(response);
            }
            
            const getResponse = await get(url, {params});
            return this._processResponse(getResponse);
        } catch (error) {
            console.error("err", error);
            return {
                error
            }
        }
    }

    static async deleteReq(url, params) {
        const getResponse = await axios.delete(url, params);
        return this._processResponse(getResponse);
    }
}

export default ApiClient;