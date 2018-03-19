const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

const responseFormat = (error, resultData, msg) => {
  if (error) {
    return {
      resultType: ERROR,
      results: resultData || null,
      resultMsg: msg || error.message || '',
      exceptionDetail: error
    }
  }

  if (resultData) {
    return {
      resultType: SUCCESS,
      results: resultData,
      resultMsg: msg || '',
      exceptionDetail: null
    }
  }

  return {
    resultType: SUCCESS,
    results: null,
    resultMsg: msg || '',
    exceptionDetail: null
  }
}

export { responseFormat }
