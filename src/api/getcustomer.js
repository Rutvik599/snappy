// getCustomerDetail.js

async function getCustomerDetail(custId) {
    try {
      const response = await fetch("http://localhost:3939/getuserdetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          custId: custId,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      return data; // Assuming the response is a JSON object containing customer details
    } catch (error) {
      console.error("Error fetching customer detail:", error);
      return null; // Return null or handle the error as needed
    }
  }
  
  export default getCustomerDetail;
  