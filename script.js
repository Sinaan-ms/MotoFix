(function () {
  emailjs.init("0oPHryVmZkRyncR9C");
})();

document.getElementById("breakdownForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
          const address = data.address || {};
          const locationName = `${address.road || ''}, ${address.suburb || ''}, ${address.city || address.town || address.village || ''}, ${address.state || ''}, ${address.country || ''}, ${address.postcode || ''}`.replace(/,\s+/g, ', ').trim();

          const formData = {
            name: document.getElementById("name").value,
            mobile: document.getElementById("mobile").value,
            car_number: document.getElementById("carNumber").value.toUpperCase(),
            car_type: document.getElementById("carType").value,
            date_time: document.getElementById("dateTime").value,
            issue: document.getElementById("issue").value,
            location: locationName || `Lat: ${latitude}, Lon: ${longitude}`
          };

          emailjs.send("service_tyr7ewf", "template_x0pcdzo", formData)
            .then(() => {
              alert("Breakdown alert sent successfully!");
              document.getElementById("breakdownForm").reset();
            })
            .catch((error) => {
              console.error("Failed to send email:", error);
              alert("Failed to send alert. Please try again.");
            });
        })
        .catch(() => {
          alert("Failed to get location details.");
        });
    },
    function (error) {
      alert("Unable to retrieve your location.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
});
