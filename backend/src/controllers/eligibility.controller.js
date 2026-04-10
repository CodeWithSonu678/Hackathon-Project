async function eligibiltyController(req,res){
    try {
        const{age,weight,healthCondition,takeMedicine,lastDonation} = req.body;

        if(!age){
            return res.status(200).json({
                eligible:false,
                msg:"Your age must be between 18 and 65"
            });
        }

        if(!weight){
            return res.status(200).json({
                eligible:false,
                msg:"Your weight must be above 50 kg"
            });
        }

        if(healthCondition){
            return res.status(200).json({
                eligible:false,
                msg:"You were recently ill"
            });
        }

        if(takeMedicine){
            return res.status(200).json({
                eligible:false,
                msg:"You are curently on medicine"
            });
        }

        if(lastDonation){
            const lastDate = new Date(lastDonation);
            const todayDate = new Date();

            const diffTime = todayDate - lastDate;
            const diffDays = diffTime/(1000*60*60*24);

            if(diffDays <90){
                return res.status(200).json({
                    eligible:false,
                    msg:"Wait at least 3 months before donating again"
                });
            }
        }

        res.status(200).json({
            eligible:true,
            msg:"You are eligible for donate blood 😊"
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error:error.message,
            eligible:false
        })
    }
}
    
module.exports = {eligibiltyController};