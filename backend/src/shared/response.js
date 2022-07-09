class ApiResponseService {
  constructor(response) {
    this.response = response;
  }
  responseError = (message) =>
    this.response.status(500).json({ success: false, message });

  responseNoAccess = (message) =>
    this.response.status(403).json({ success: false, message });

  responseNotFound = (message) =>
    this.response.status(404).json({ success: false, message });

  responseData = (data) =>
    this.response.status(200).json({ success: true, data });
}

export default ApiResponseService;
