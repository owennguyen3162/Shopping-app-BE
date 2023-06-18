const connect = require("../config/configDB");
const admin = require("../../admin");
const pushNotification = async (req, res) => {
  const { userId, orderId } = await req.params;
  const { status } = await req.body;
  const query = "INSERT INTO notification VALUES (?,?,?,?,?)";
  const selectFcmToken = "SELECT fcmToken FROM user where id = ?";
  const updateStatusOrder = "UPDATE orders SET status = ? where id = ?";
  const updateStatusOrderDone =
    "UPDATE orders SET status = ?, date = ? where id = ?";

  const date = new Date();
  const body = `Your order with code ${orderId} has been ${status} at Time ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} Day ${date.getDate()} - ${
    date.getMonth() + 1
  } - ${date.getFullYear()}`;
  const bodyDone = `Your order with code ${orderId} has been successfully delivered to you at Time ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} Day ${date.getDate()} - ${
    date.getMonth() + 1
  } - ${date.getFullYear()}`;
  try {
    const [data] = await connect.execute(selectFcmToken, [userId]);
    if (data.length !== 0) {
      const registrationToken = data[0].fcmToken;
      //description push to mobile app
      message = {
        token: registrationToken,
        data: {
          type: "Notification",
        },
        notification: {
          body: status === "done" ? bodyDone : body,
        },
        //config notification for ios
        apns: {
          payload: {
            aps: {
              "mutable-content": 1,
            },
          },
        },
      };
      admin
        .messaging()
        .send(message)
        .then(async (response) => {
          await connect.execute(query, [
            null,
            userId,
            status === "done" ? bodyDone : body,
            orderId,
            null,
          ]);
          if (status === "done") {
            await connect.execute(updateStatusOrderDone, [
              status,
              null,
              orderId,
            ]);
          } else {
            await connect.execute(updateStatusOrder, [status, orderId]);
          }

          return res.redirect("/order");
        })
        .catch((error) => {
          return res.json({ msg: "Error sending message: " + error });
        });
    }
  } catch (error) {
    return res.json({ msg: error });
  }
};

const getNotificationInDB = async (req, res) => {
  const { userId } = await req.params;
  const query = "SELECT * FROM notification WHERE userId = ?";
  try {
    const [data] = await connect.execute(query, [userId]);
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = await req.params;
  const query = "DELETE FROM notification WHERE id = ?";
  try {
    await connect.execute(query, [id]);
    return res.status(204).json({ msg: "delete successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

module.exports = { pushNotification, getNotificationInDB, deleteNotification };
