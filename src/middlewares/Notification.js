/* eslint-disable */
const axios = require("axios");
const Config = require("../config/config");

const NotificationMiddleware = {
    sendWhatsappNewOrderPlaced: async function(req, res){
        if(!req.body) return req.sendStatus(400);
        res.setHeader('Content-Type', 'application/json');
        const {recipient, parameters, lang} = req.body;
        const { name, phone, orderId} = parameters;
        try {
            const response = await axios({
                url: `https://graph.facebook.com/v15.0/113095531677116/messages`,
                method: 'post',
                headers: {
                        'Authorization': `Bearer ${Config.WHATSAPP_TOKEN}`,
                        'Content-Type': 'application/json',
                },
                data: {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: recipient,
                    type:  'template',
                    template : {
                        name: 'new_order_placed',
                        language: {
                            code: lang
                        },
                        components: [
                            {
                                type: 'body',
                                parameters: [
                                    {
                                        type: 'text',
                                        text: name
                                    },
                                    {
                                        type: 'text',
                                        text: phone
                                    },
                                    {
                                        type: 'text',
                                        text: orderId
                                    }
                                ]
                            }
                        ]
                    }
                },
                
            });
            console.log(response)
            return res.json(response);
        } catch (error) {
            console.error(error)
            return res.json(error);
        }
       
        
    },
};

module.exports = NotificationMiddleware;