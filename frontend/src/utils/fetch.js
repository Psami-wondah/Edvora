import { BACKENDURL } from "../config";

export default function Fetch(Url, Method, Data = null) {
    if (Data) {
      Data = JSON.stringify(Data);
    }

    var ModifiedUrl = BACKENDURL + "/api/v1/" + Url;

  
    console.log(ModifiedUrl);
    var Response = fetch(ModifiedUrl, {
      method: Method,
      body: Data,
      headers: {
        "Content-Type": "application/json",
        cors: 'no-cors',
        Authorization: `Bearer ${
          localStorage.getItem("userDetails")
            ? JSON?.parse(localStorage?.getItem("token"))
            : ""
        }`,
      },
    });
    Response.then((data) => {
      if (data.status === 401 || data.statusText === "Unauthorized") {
        localStorage.clear();
        // window.location.href = "/";
      }
    });
    return Response;
  }