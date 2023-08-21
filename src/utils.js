import config from './config';

const WORK_TYPES = {
    "Photograph": "/images/artis_icons/photographIcon.png",
    "Film": "/images/artis_icons/filmIcon.png",
    "Art": "/images/artis_icons/artIcon.png",
    "Multimedia": "/images/artis_icons/multimediaIcon.png",
    "Dance": "/images/artis_icons/danceIcon.png",
    "Program": "/images/artis_icons/programIcon.png",
    "Website": "/images/artis_icons/websiteIcon.png",
    "Book": "/images/artis_icons/bookIcon.png",
    "Story": "/images/artis_icons/storyIcon.png",
    "Script": "/images/artis_icons/scriptIcon.png",
    "Music": "/images/artis_icons/musicIcon.png",
  };

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

const utils = {
    /**
     * Format date to this format: "mmm dd, yyyy"
     * @param {*} date 
     * @returns 
     */
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'});
    },
    /**
     * Get url of the media file
     * @param {*} path 
     * @returns 
     */
    getMediaUrl: (path) => {
        if (path?.includes(config.url.API_URL)) {
            return path;
        }
        return `${path}`;
    },
    /**
     * Validate email and name
     * @param {*} email 
     * @param {*} name 
     * @returns 
     */
    validateBasicForm: (email, name) => {
        if (email && email.includes("@") && name) return true;
        return false;
    },
    getImage: (workImage, work_type) => {
        if (workImage.image){
            return `${workImage.image}`;
        }
        else if (work_type) {
            return WORK_TYPES[work_type];
        }
        return WORK_TYPES['Photograph'];
    },
    getIcon: (workImage, work_type) => {
        if (workImage.icon){
          return `${workImage.icon}`;
        }
        else if (work_type) {
          return WORK_TYPES[work_type];
        }
        return WORK_TYPES['Photograph'];
    },
    /**
     * Show bytes in a human readable format
     * e.g MB, KB, GB
     * @param {*} x 
     * @returns 
     */ 
    niceBytes: (x) => {
        let l = 0, n = parseInt(x, 10) || 0;

        while(n >= 1024 && ++l){
            n = n/1024;
        }
        
        return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
    }
};

export default utils;
