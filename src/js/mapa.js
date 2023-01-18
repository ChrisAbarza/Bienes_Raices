(function () {
    const lat = -39.862847;
    const lng = -72.810181;
    const ZOOM = 16;
    const mapa = L.map("mapa").setView([lat, lng], ZOOM);

    let marker;

    //utilizar provider y geocoding
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);

    //datos del ping
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
    }).addTo(mapa);

    //detectar fin del movimiento del pin para obtener el marcador
    marker.on("moveend", function (e) {
        marker = e.target;

        const posicion = marker.getLatLng();

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        //obtener info de calles al soltar pin
        geocodeService
            .reverse()
            .latlng(posicion, ZOOM)
            .run(function (error, result) {
                marker.bindPopup(result.address.LongLabel);

                //cargar campos de ubicacion
                document.querySelector(".calle").textContent =
                    result?.address?.Address ?? "";
                document.querySelector("#calle").value =
                    result?.address?.Address ?? "";
                document.querySelector("#lat").value =
                    result?.latlng?.lat ?? "";
                document.querySelector("#lng").value =
                    result?.latlng?.lng ?? "";
            });
    });
})();