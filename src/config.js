const prod = {
    url: {
      API_URL: 'https://api.artis.app',
      S3_URL: 'https://artis-stage-data.s3.amazonaws.com/static'
    }
  }
  
  const dev = {
    url: {
      API_URL: 'https://api.artis.app',
      S3_URL: 'https://artis-stage-data.s3.amazonaws.com/static'
    //     API_URL: 'http://127.0.0.1:8000',
    //     S3_URL: 'http://127.0.0.1:8000'
    }
}

const config = {
    url: 
    process.env.NODE_ENV === 'development' ? dev.url:
    prod.url
}

export default config;

// nhs769%HJ9sad