const axios = require("axios");

async function getCordination(city){
    const url = `https://nominatim.openstreetmap.org/search?q=${city}&format=json`;
    
    try {
        const res = await axios.get(url,{
            headers:{
                "User-Agent":"Blood Donate App"
            }
        });
        const data = res.data;

        if(!data.length){
            throw new Error("City is not found !")
        }

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        return {lat,lng};
    } catch (error) {
        console.log(error.message)
        return null;
    }
}

module.exports = {getCordination};