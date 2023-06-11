const connect = require("../config/configDB");
const admin = require("../../admin");
const pushNotification = async (req, res) => {
  const { FcmToken } = await req.params;
  //push notification: TODO
  const registrationToken = FcmToken;
  const date = new Date();
  //description push to mobile app
  message = {
    token: registrationToken,
    data: {
      type: "Notification",
    },
    notification: {
      body: `Your order has been confirmed at Time ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} Day ${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()})`,
    },
    //config notification for ios
    apns: {
      payload: {
        aps: {
          "mutable-content": 1,
        },
      },
      fcm_options: {
        //     image:
        //       "https://i.pinimg.com/236x/c2/9a/7d/c29a7d29348b1a3f502803ab9d8355cc.jpg",
      },
    },
    //config notification for android
    android: {
      notification: {
        // image:
        //   "https://i.pinimg.com/236x/c2/9a/7d/c29a7d29348b1a3f502803ab9d8355cc.jpg",
      },
    },
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

  //response to client
  res.status(200).json({ notification: "this is notification" });
};

module.exports = { pushNotification };
